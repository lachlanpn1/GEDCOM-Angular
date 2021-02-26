import { formatDate } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Event, EventType } from './event.model';
import { Family } from './family.model';

export enum Sex {
  Male,
  Female,
  Other,
  Unspecified,
}

export class Member {
  private _id: number;
  private _generation: number;
  private _givenName: String;
  private _middleNames: String;
  private _familyName: String;
  private _sex: Sex;
  private _events: Event[];

  private _spouseFamilyId: number;
  private _childFamilyId: number;
  private _lifeDates: String;


  // True only if the person has invalid details such as their name not initialising correctly.
  // This gives the user time to correct any errors within the GEDCOM before rendering the tree.
  private _error: Boolean;


  constructor(
    id?: number,
    givenName?: String,
    middleNames?: String,
    familyName?: String,
    sex?: Sex,
    events?: Event[]
  ) {
    if (id) {
      this.Id = id;
    }
    if (givenName) {
      this.GivenName = givenName;
    }
    if (middleNames) {
      this.MiddleNames = middleNames;
    }
    if (familyName) {
      this.FamilyName = familyName;
    }
    if (sex) {
      this.Sex = sex;
    }
    if (events) {
      this.Events = events;
    } else {
      this.Events = new Array<Event>();
    }
  }

  get Id(): number {
    return this._id;
  }

  set Id(id: number) {
    this._id = id;
  }

  get GivenName(): String {
    return this._givenName;
  }

  set GivenName(givenName: String) {
    this._givenName = givenName;
  }

  get MiddleNames(): String {
    return this._middleNames;
  }

  set MiddleNames(middleNames: String) {
    this._middleNames = middleNames;
  }

  get FamilyName(): String {
    return this._familyName;
  }

  set FamilyName(familyName: String) {
    this._familyName = familyName;
  }

  get Sex(): Sex {
    return this._sex;
  }

  set Sex(sex: Sex) {
    this._sex = sex;
  }

  get Events(): Event[] {
    return this._events;
  }

  set Events(events: Event[]) {
    this._events = events;
  }

  get SpouseFamilyId(): number {
    return this._spouseFamilyId;
  }

  set SpouseFamilyId(newSpouseFamilyId: number) {
    this._spouseFamilyId = newSpouseFamilyId;
  }

  get ChildFamilyId(): number {
    return this._childFamilyId;
  }

  set ChildFamilyId(newChildFamilyId: number) {
    this._childFamilyId = newChildFamilyId;
  }

  get LifeDates(): String {
    return this._lifeDates;
  }

  get Error(): Boolean {
    return this._error;
  }

  set Error(error: Boolean) {
    this._error = error;
  }

  get Generation(): number {
    return this._generation;
  }

  set Generation(val) {
    this._generation = val;
  }


  getEvent(eventType: EventType) {
    var result = this.Events.find((e) => e.eventType === eventType);
    if (result) {
      return result;
    }
    return null;
  }

  addEvent(newEvent: Event) {
    this._events.push(newEvent);
  }

  getBirthDateAsString(format?: string) {
    var birthDateString = 'Unknown';

    var birthEvent = this.getEvent(EventType.Birth);

    if (birthEvent) {
      var birthEventDate = this.getEvent(EventType.Birth).date;
      if (birthEventDate) {
        birthDateString = formatDate(
          birthEventDate,
          format ? format : 'yyyy',
          'en-US'
        );
      }
    }

    return birthDateString;
  }

  getDeathDateAsString(format?: string) {
    var deathDateString = 'Unknown';

    var deathEvent = this.getEvent(EventType.Death);

    if (deathEvent) {
      var deathEventDate = this.getEvent(EventType.Death).date;
      if (deathEventDate) {
        deathDateString = formatDate(
          deathEventDate,
          format ? format : 'yyyy',
          'en-US'
        );
      }
    }

    return deathDateString;
  }

  getLifeDatesAsString(format?: string) {
    if (!format) {
      format = 'yyyy';
    }
    return (
      this.getBirthDateAsString(format) +
      ' - ' +
      this.getDeathDateAsString(format)
    );
  }

  // return eithers
  // GivenName                     | John
  // GivenName familyName             | John Smith
  // GivenName MiddleNames familyName | John Donald Smith
  // familyName                       | Smith
  // 'Unknown'                     | Unknown
  getNameAsString(middleName?: Boolean) {
    if(!middleName) {
      middleName = false;
    }
    if (!this.GivenName) {
      if (this.FamilyName) {
        return this.FamilyName;
      } else {
        return 'Unknown';
      }
    } else {
      if (!this.FamilyName) {
        return this.GivenName;
      } else {
        if (this.MiddleNames && middleName) {
          return this.GivenName + ' ' + this.MiddleNames + ' ' + this.FamilyName;
        } else {
          return this.GivenName + ' ' + this.FamilyName;
        }
      }
    }
  }
}
