import { Component, Input, OnInit } from '@angular/core';
import { CanvasMember } from '../family-canvas/shared/canvas-member.model';
import { Member, Sex } from '../shared/member.model';
import { Point } from '../shared/point.model';

@Component({
  selector: '[family-canvas-member]',
  templateUrl: './family-canvas-member.component.html',
  styleUrls: ['./family-canvas-member.component.css'],
})
export class FamilyCanvasMemberComponent implements OnInit {
  @Input() canvasMember: CanvasMember;

  member: Member;
  location: Point;

  width: number;
  height: number;
  rx: number = 15; // rounded edges
  fill: string = '#707070';

  nameFill: string = 'white';
  nameFontSize;
  yNameOffset: number = 15;

  yDateOffset: number = 35;
  dateFill: string = '#dbdbdb';
  dateFontSize;

  verticalLineLength: number;
  horizontalLineLength: number;

  drawFatherLine: boolean;
  drawMotherLine: boolean;

  constructor() {}

  ngOnInit(): void {
    this.member = this.canvasMember.Member;
    this.location = this.canvasMember.Point;
    this.width = this.canvasMember.Width;
    this.height = this.canvasMember.Height;
    this.nameFontSize = this.canvasMember.FontSize;
    this.dateFontSize = this.canvasMember.FontSize * 0.6;
    this.verticalLineLength = this.canvasMember.VerticalLineLength;
    this.horizontalLineLength = this.canvasMember.HorizontalLineLength;

    if(this.canvasMember.HasChild) {
      if (this.canvasMember.Member.Sex == Sex.Male) {
        this.drawFatherLine = true;
      } else if (this.canvasMember.Member.Sex == Sex.Female) {
        this.drawMotherLine = true;
      }
    }
  }
}
