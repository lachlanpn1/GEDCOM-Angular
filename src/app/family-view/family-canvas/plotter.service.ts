import { Injectable } from '@angular/core';
import { FamilyService } from '../family-canvas/family.service';
import { Member, Sex } from '../shared/member.model';
import { Point } from '../shared/point.model';
import { CanvasMember } from './shared/canvas-member.model';

@Injectable({
  providedIn: 'root',
})
export class PlotterService {
  verticalLineLength: number = 100;
  initialHorizontalLineLength: number = 20;
  horizontalLineLength: number;
  lengthMultipler: number = 2;
  initialX: number = 0;
  initialY: number = 0;
  initialWidth: number = 200;
  initialHeight: number = 50;
  minHeight: number = 25;
  minWidth: number = 100;
  minFontSize: number = 7.5;
  initialFontSize: number = 15;
  sizeMultiplier = 0.95;
  initialSizeMultiplier = 0.99;
  lineLengthMultiplier = 0.6;
  generationCount: number;

  constructor(private familyService: FamilyService) {}

  getLineLength(currentIteration: number) {
    // console.log("GetLineLength()");
    // console.log("Current Iteration: " + currentIteration);
    // console.log("GenerationCount: " + this.generationCount);
    // console.log("HLL: " + this.horizontalLineLength);
    return (
      Math.pow(2, this.generationCount - currentIteration) *
      this.horizontalLineLength
    );
  }

  plotFamily(
    lineLength?: number,
    sizeMultiplier?: number
  ): Array<CanvasMember> {
    lineLength
      ? (this.horizontalLineLength = lineLength)
      : (this.horizontalLineLength = this.initialHorizontalLineLength);
    sizeMultiplier
      ? (this.sizeMultiplier = sizeMultiplier)
      : (this.sizeMultiplier = this.initialSizeMultiplier);
    this.generationCount = this.familyService.NumberOfGenerations;
    return this.plotMember(this.familyService.members[0]);
  }

  plotMember(
    member: Member,
    childPoint?: Point,
    iterationNumber?: number,
    childWidth?: number,
    childHeight?: number,
    childFontSize?: number,
    childVerticalLineLength?: number,
    childHorizontalLineLength?: number
  ): Array<CanvasMember> {

    let result = new Array<CanvasMember>();
    let point,
      width,
      height,
      fontSize,
      horizontalLineLength,
      verticalLineLength;
    if (childPoint && iterationNumber) {

      width = childWidth * this.sizeMultiplier;
      height = childHeight * this.sizeMultiplier;
      fontSize = childFontSize * this.sizeMultiplier;

      let memberX;
      let memberY = this.verticalLineLength * iterationNumber;
      if (member.Sex == Sex.Male) {
        // memberX = childPoint.X + this.horizontalLineLength / (2 * iterationNumber);
        memberX = childPoint.X + this.getLineLength(iterationNumber);
      } else {
        // memberX = childPoint.X - this.horizontalLineLength / (2 * iterationNumber);
        memberX = childPoint.X - this.getLineLength(iterationNumber) + childWidth - width;
      }
      point = new Point(memberX, memberY);
    } else {
      // First iteration of plot function
      point = new Point(this.initialX, this.initialY);
      width = this.initialWidth;
      height = this.initialHeight;
      fontSize = this.initialFontSize;
    }


    if (width <= this.minWidth) {
      width = this.minWidth;
      height = this.minHeight;
      fontSize = this.minFontSize;
    }

    let canvasMember = new CanvasMember(point, member, width, height, fontSize);

    let father = this.familyService.getFather(member);
    let mother = this.familyService.getMother(member);

    father ? (canvasMember.HasFather = true) : (canvasMember.HasFather = false);
    mother ? (canvasMember.HasMother = true) : (canvasMember.HasMother = false);

    // if (canvasMember.HasParents) {
    //   if (childHorizontalLineLength) {
    //     canvasMember.HorizontalLineLength =
    //       childHorizontalLineLength * this.lineLengthMultiplier;
    //   } else {
    //     canvasMember.HorizontalLineLength = this.initialHorizontalLineLength;
    //   }
    //   if (childVerticalLineLength) {
    //     canvasMember.VerticalLineLength = childVerticalLineLength;
    //   } else {
    //     canvasMember.VerticalLineLength = this.verticalLineLength;
    //   }
    // }
    // if(canvasMember.HasParents && iterationNumber) {
    // } else {
    //   canvasMember.VerticalLineLength = this.verticalLineLength;
    // }

    canvasMember.VerticalLineLength =
      this.verticalLineLength + (height * this.sizeMultiplier) / 2;

    if (this.familyService.hasChild(member)) {
      canvasMember.HasChild = true;
      if (member.Sex == Sex.Male) {
        canvasMember.HorizontalLineLength =
          this.getLineLength(iterationNumber) - (childWidth/2);
      } else {
        canvasMember.HorizontalLineLength =
          this.getLineLength(iterationNumber) - (childWidth/2);
      }
    } else {
      canvasMember.HasChild = false;
    }

    horizontalLineLength = canvasMember.HorizontalLineLength;
    verticalLineLength = canvasMember.VerticalLineLength;

    result.push(canvasMember);

    if (iterationNumber) {
      iterationNumber++;
    } else {
      iterationNumber = 1;
    }

    if (father && iterationNumber <= 5) {
      result = result.concat(
        this.plotMember(
          father,
          point,
          iterationNumber,
          width,
          height,
          fontSize,
          verticalLineLength,
          horizontalLineLength
        )
      );
    } else {
    }

    if (mother && iterationNumber <= 5) {
      result = result.concat(
        this.plotMember(
          mother,
          point,
          iterationNumber,
          width,
          height,
          fontSize,
          verticalLineLength,
          horizontalLineLength
        )
      );
    } else {
    }

    return result;
  }
}
