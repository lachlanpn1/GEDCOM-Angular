import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Member, Sex } from '../shared/member.model';
import { Event, EventType } from '../shared/event.model';
import { Family } from '../shared/family.model';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  public membersChanged: Subject<Member[]> = new Subject<Member[]>();
  public familyChanged: Subject<Family[]> = new Subject<Family[]>();

  testFamily = [
    new Member(0, 'John', 'Peters', 'Smith', Sex.Male, [
      new Event(EventType.Birth, new Date(1900, 12, 1), 'Ballarat, VIC'),
      new Event(EventType.Death, new Date(1980, 10, 4), 'Madrid, Spain'),
    ]),
    new Member(1, 'William', null, 'Johnson', Sex.Female, [
      new Event(EventType.Birth, new Date(1927, 4, 3), 'Madrid, Spain'),
      new Event(EventType.Death, new Date(2007, 15, 3), 'Madrid Spain'),
    ]),
  ];

  members: Member[];
  families: Family[];
  _numberOfGenerations: number;

  constructor() {
    this.members = this.testFamily;
  }

  getFamilyMembers() {
    return this.members;
  }

  setFamilyMembers(members: Member[]) {
    this.members = members;
    this.membersChanged.next(this.members);

    this._numberOfGenerations = members.reduce((highest, current) =>
      highest.Generation > current.Generation ? highest : current
    ).Generation;

    if(this.NumberOfGenerations > 5) {
      this._numberOfGenerations = 5;
    }
  }

  getFamily() {
    return this.families;
  }

  setFamilies(families: Family[]) {
    this.families = families;
    this.familyChanged.next(this.families);
  }

  getFather(member: Member): Member {
    if (member.ChildFamilyId) {
      return this.families.find((family) => family.id == member.ChildFamilyId)
        ?.husband;
    }
    return null;
  }

  getMother(member: Member): Member {
    if (member.ChildFamilyId) {
      return this.families.find((family) => family.id == member.ChildFamilyId)
        ?.wife;
    }
    return null;
  }

  getSpouseFamily(member: Member): Family {
    if (member.SpouseFamilyId) {
      return this.families.find((family) => family.id == member.SpouseFamilyId);
    }
    return null;
  }

  hasChild(member: Member): Boolean {
    if (this.getSpouseFamily(member)) {
      return this.getSpouseFamily(member).children.length > 0;
    } else {
      return false;
    }
  }

  get NumberOfGenerations() {
    return this._numberOfGenerations;
  }
}
