import { Member } from './member.model';

export class Family {
  // defines a Family using terminology consistent with .ged files (husband, wife & child).
  private _id: number;
  private _husband: Member;
  private _wife: Member;

  private _children: Member[];

  constructor() {
    this._husband = null;
    this._wife = null;
    this._children = [];
  }

  get id(): number {
    return this._id;
  }

  set id(newId: number) {
    this._id = newId;
  }

  get husband(): Member {
    return this._husband;
  }

  get wife(): Member {
    return this._wife;
  }

  get children(): Member[] {
    return this._children;
  }

  set husband(newHusband: Member) {
    this._husband = newHusband;
  }

  set wife(newWife: Member) {
    this._wife = newWife;
  }

  addChild(child: Member) {
    this.children.push(child);
  }


}
