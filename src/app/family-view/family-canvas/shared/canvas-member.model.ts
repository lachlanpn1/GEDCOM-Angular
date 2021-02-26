import { Member } from '../../shared/member.model';
import { Point } from '../../shared/point.model';

export class CanvasMember {
  private _point: Point;
  private _member: Member;
  private _width: number;
  private _height: number;
  private _fontSize: number;
  private _verticalLineLength: number;
  private _horizontalLineLength: number;
  private _hasFather: boolean;
  private _hasMother: boolean;
  private _hasChild: boolean;

  constructor(point, member, width, height, fontSize) {
    this._point = point;
    this._member = member;
    this._width = width;
    this._height = height;
    this._fontSize = fontSize;
  }

  get Member() {
    return this._member;
  }

  get Point() {
    return this._point;
  }

  get Width() {
    return this._width;
  }

  get Height() {
    return this._height;
  }

  get FontSize() {
    return this._fontSize;
  }

  get HasFather() {
    return this._hasFather;
  }

  get HasMother() {
    return this._hasMother;
  }

  get HasParents() {
    return (this.HasFather || this.HasMother);
  }

  set HasFather(bool) {
    this._hasFather = bool;
  }

  set HasMother(bool) {
    this._hasMother = bool;
  }

  get VerticalLineLength() {
    return this._verticalLineLength;
  }

  set VerticalLineLength(val) {
    this._verticalLineLength = val;
  }

  get HorizontalLineLength() {
    return this._horizontalLineLength;
  }

  set HorizontalLineLength(val) {
    this._horizontalLineLength = val;
  }

  get HasChild() {
    return this._hasChild;
  }

  set HasChild(val) {
    this._hasChild = val;
  }

}
