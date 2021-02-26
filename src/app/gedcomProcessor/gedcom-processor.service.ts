import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Event, EventType } from '../family-view/shared/event.model';
import { Family } from '../family-view/shared/family.model';
import { Member, Sex } from '../family-view/shared/member.model';
import { GEDCOMLine } from './gedcom-line.model';

/*
todo:
Add a getNameFromString() ... returns name broken into three components
/{
  first:string
  middle:string[]
  last:string
}
}

*/

@Injectable({
  providedIn: 'root',
})
export class GedcomProcessorService {
  // A GEDCOM line is in the following format:
  // [quantifier] [header] [content]
  // example: 0 DATE 1 January 1901
  private regexpGEDCOMLine: RegExp = /(?<quantifier>\d{1}) (?<header>[\@A-Z-a-z0-9]+) ?(?<content>.*)/;

  // A family is defined in GEDCOM in the following format:
  // @F[id]@ - example: @F12@
  private regexpFamily: RegExp = /\@F(?<id>\d+)\@/;

  // A individual is defined in GEDCOM in the following format:
  // @P[id]@ - example: @P33@
  private regexpIndividual: RegExp = /\@P(?<id>\d+)\@/;

  // Dates are input into GEDCOM as strings and can be many formats, or be completely unique
  // Common formats:
  // 2 Jan 1901
  // 2 January 1901
  // January 1901
  // Abt. January 1901
  // Before 1901
  // 1/2/1901
  // 1.2.1901
  // 1-2-1901
  // 1901
  // 2 January <-- invalid - a year must be provided.
  // This GEDCOM processor will only accept dates separated by /. or - in DD/MM/YYYY format
  // For a date to be valid it must include at least a complete year value.
  private regexpDate: RegExp = /^((About|about|Abt|abt|Before|before|Bef|bef|After|after|Aft|aft|bp|baptism|Baptism)[\.\- ,]*)?((?<year>\d{1,4})|(?<month>[A-Za-z]+)[\.\- \,](?<year1>\d{1,4})|(?<month1>[A-Za-z]+)[\.\- \,](?<day>\d{1,2})[\.\- \,]*(?<year2>\d{1,4})|(?<day1>\d{1,2})[\.\- \,](?<month2>\w+)[\.\- \,]*(?<year3>\d{1,4}))$/;

  private regexpName: RegExp = /^((?<given>[a-zA-Z'\-\.]+) ?)?(?<middle>([a-zA-z'\.]+ ?)*)? *(\((?<nickname>[a-zA-Z'\-]+)\))? ?(\/(?<family>[a-zA-Z'\- ]+)\/)? ?(\w+)?$/;

  public membersChanged: Subject<Member[]> = new Subject<Member[]>();
  public familiesChanged: Subject<Family[]> = new Subject<Family[]>();

  constructor() {}

  public processFile(fileContent: String) {
    let members: Array<Member>;
    let families: Array<Family>;
    let fileLines = fileContent.split('\n');
    let header: String;
    let content: String;
    let quantifier: Number;
    let details = null;

    fileLines.forEach((line) => {
      if (line.match(this.regexpGEDCOMLine)) {
        let lineGroups = line.match(this.regexpGEDCOMLine).groups;
        if (lineGroups) {
          quantifier = parseInt(lineGroups.quantifier);
          header = lineGroups.header;
          content = lineGroups.content;
        }

        if (quantifier == 0) {
          // A quantifier of 0 means this line is the beginning of a new family or member's details.
          if (header.match(this.regexpIndividual)) {
            if (details) {
              if (!members) {
                members = new Array<Member>();
              }
              members.push(this.processIndividual(details));
            }
            details = new Array<GEDCOMLine>();
            details.push(new GEDCOMLine(quantifier, header, content));
          } else if (header.match(this.regexpFamily)) {
            if (details) {
              if (!families) {
                // last individual needs to be processed
                members.push(this.processIndividual(details));
                families = new Array<Family>();
              } else {
                families.push(this.processFamily(members, details));
              }
            }
            details = new Array<GEDCOMLine>();
            details.push(new GEDCOMLine(quantifier, header, content));
          } else {
            // EOF , process last family
            if (details) {
              families.push(this.processFamily(members, details));
              details = null;
            }
          }
        } else {
          if (details) {
            details.push(new GEDCOMLine(quantifier, header, content));
          }
        }
      }
    });
    this.membersChanged.next(members);
    this.familiesChanged.next(families);
  }

  private processIndividual(details: Array<GEDCOMLine>): Member {
    let individual = new Member();
    details.forEach((line) => {
      if (line.header.match(this.regexpIndividual)) {
        let lineGroups = line.header.match(this.regexpIndividual).groups;
        if (lineGroups) {
          individual.Id = parseInt(lineGroups.id);
        }
      }

      // A quantifier of 1 means the beginning of a new event or detail related to a person or family.
      if (line.quantifier == 1) {
        if (line.header == 'NAME') {
          let { given, middle, family } = this.getNameFromString(line.content);
          if (given && family) {
            individual.GivenName = given;
            individual.MiddleNames = middle;
            individual.FamilyName = family;
          } else if (given) {
            individual.GivenName = given;
          } else if (family) {
            individual.FamilyName = family;
          } else {
            individual.GivenName = line.content;
            individual.Error = true;
          }
        }
        if (line.header == 'SEX') {
          individual.Sex = this.getSexFromString(line.content);
        } else if (line.content.match(this.regexpFamily)) {
          //FAMC or FAMS (ex; @F34@)
          let familyGroups = line.content.match(this.regexpFamily).groups;
          let id = parseInt(familyGroups.id);
          if (line.header == 'FAMC') {
            individual.ChildFamilyId = id;
          } else if (line.header == 'FAMS') {
            individual.SpouseFamilyId = id;
          }
        } else {
          let eventType = this.getEventType(line.header);
          let newEvent: Event = new Event();
          newEvent.eventType = eventType;

          individual.addEvent(newEvent);
        }
      }

      // A quantifier of 2 means a detail related to the most recently declared event
      if (line.quantifier == 2) {
        this.setEventDetail(
          individual.Events[individual.Events.length - 1],
          line.header,
          line.content
        );
      }
    });
    return individual;
  }

  private processFamily(members: Member[], details: Array<GEDCOMLine>): Family {
    let family = new Family();
    let husbandIndex, wifeIndex, childIndex;

    details.forEach((line) => {
      if (line.header.match(this.regexpFamily)) {
        let lineGroups = line.header.match(this.regexpFamily).groups;
        if (lineGroups) {
          family.id = parseInt(lineGroups.id);
        }
      }

      if (line.quantifier == 1) {
        if (line.header == 'MARR') {
          // not implemented.
        } else {
          let lineGroups = line.content.match(this.regexpIndividual).groups;
          let id = parseInt(lineGroups.id);
          let member = members.find((member) => member.Id == id);
          if (member) {
            if (line.header == 'HUSB') {
              family.husband = member;
              husbandIndex = members.findIndex((member) => member.Id == id);
            } else if (line.header == 'WIFE') {
              family.wife = member;
              wifeIndex = members.findIndex((member) => member.Id == id);
            } else if (line.header == 'CHIL') {
              family.children.push(member);
              childIndex = members.findIndex((member) => member.Id == id);
            }
          }
        }
      }
    });

    if(childIndex) {
      if(!members[childIndex].Generation) {
        members[childIndex].Generation = 1;
      }
      let childGeneration = members[childIndex].Generation;
      if(wifeIndex) {
        members[wifeIndex].Generation = childGeneration + 1;
      }
      if(husbandIndex) {
        members[husbandIndex].Generation = childGeneration + 1;
      }


    }
    return family;
  }

  private getEventType(eventTypeString): EventType {
    switch (eventTypeString) {
      case 'BIRT':
        return EventType.Birth;
      case 'DEAT':
        return EventType.Death;
      case 'RESI':
        return EventType.Residence;
      default:
        return EventType.Other;
    }
  }

  private setEventDetail(event: Event, header: String, content: String) {
    if (header == 'PLAC') {
      event.location = content;
    }
    if (header == 'DATE') {
      if (content.match(this.regexpDate)) {
        let dateGroups = content.match(this.regexpDate).groups;
        let day = this.getDayFromRegEx(dateGroups);
        let month = this.getMonthFromRegEx(dateGroups);
        let year = this.getYearFromRegEx(dateGroups);
        if (year) {
          if (month) {
            if (day) {
              if (this.isValidDay(day, month)) {
                event.date = new Date(year, month, day);
              }
            } else {
              event.date = new Date(year, month);
            }
          } else {
            event.date = new Date(year, 0);
          }
        } else {
          event.date = null;
        }
      }
    }
    if (header == 'TYPE') {
      event.description = content;
    }
  }

  private getDayFromRegEx(captureGroups: { [key: string]: string }): number {
    let dayString: string = null;
    if (captureGroups.day) {
      dayString = captureGroups.day;
    } else if (captureGroups.day1) {
      dayString = captureGroups.day1;
    }
    if (dayString) {
      return parseInt(dayString);
    }
    return null;
  }

  private getMonthFromRegEx(captureGroups: { [key: string]: string }): number {
    let monthString: string = null;
    if (captureGroups.month) {
      monthString = captureGroups.month;
    } else if (captureGroups.month1) {
      monthString = captureGroups.month1;
    } else if (captureGroups.month2) {
      monthString = captureGroups.month2;
    }

    if (monthString) {
      return this.getMonthAsNumber(monthString);
    }
    return null;
  }

  private getYearFromRegEx(captureGroups: { [key: string]: string }): number {
    let yearString: string = null;
    if (captureGroups.year) {
      yearString = captureGroups.year;
    } else if (captureGroups.year1) {
      yearString = captureGroups.year1;
    } else if (captureGroups.year2) {
      yearString = captureGroups.year2;
    } else if (captureGroups.year3) {
      yearString = captureGroups.year3;
    }

    if (yearString) {
      return parseInt(yearString);
    }
    return null;
  }

  private isValidDay(day, month): Boolean {
    if (month == 1) {
      return day <= 29;
    }
    if (month == 3 || month == 5 || month == 8 || month == 10) {
      return day <= 30;
    }
    return day <= 31;
  }

  private getMonthAsNumber(month): number {
    if (typeof month == 'number') {
      if (month <= 12) {
        return month;
      }
    } else if (typeof month == 'string') {
      let monthString = (month as String).substring(0, 3).toLowerCase();
      if (monthString) {
        switch (monthString) {
          case 'jan':
            return 0;
          case 'feb':
            return 1;
          case 'mar':
            return 2;
          case 'apr':
            return 3;
          case 'may':
            return 4;
          case 'jun':
            return 5;
          case 'jul':
            return 6;
          case 'aug':
            return 7;
          case 'sep':
            return 8;
          case 'oct':
            return 9;
          case 'nov':
            return 10;
          case 'dec':
            return 11;
          default:
            return null;
        }
      }
    }
    return null;
  }

  private getSexFromString(sex: String): Sex {
    if (sex == 'M') {
      return Sex.Male;
    } else if (sex == 'F') {
      return Sex.Female;
    } else {
      return Sex.Unspecified;
    }
  }

  private getNameFromString(
    fullNameString: String
  ): { given: String; middle: String; family: String } {
    let given = null;
    let middle = null;
    let family = null;
    if (fullNameString.match(this.regexpName)) {
      let nameGroups = fullNameString.match(this.regexpName).groups;
      given = nameGroups.given;
      middle = nameGroups.middle;
      family = nameGroups.family?.toUpperCase();
    }
    return { given, middle, family };
  }
}
