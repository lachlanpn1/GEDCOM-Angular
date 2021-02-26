import { AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
import * as SvgPanZoom from 'svg-pan-zoom';
import { Member } from '../shared/member.model';
import { FamilyService } from './family.service';
import { PlotterService } from './plotter.service';
import { CanvasMember } from './shared/canvas-member.model';


@Component({
  selector: 'app-family-canvas',
  templateUrl: './family-canvas.component.html',
  styleUrls: ['./family-canvas.component.css']
})
export class FamilyCanvasComponent implements OnInit, AfterViewInit {

  options = {
    zoomEnabled: true,
    controlIconsEnabled: false,
    center: true,
    maxZoom: 100000,
  }

  canvasMembers: Array<CanvasMember>;

  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;
  lineLength : number = 500;
  sizeMultiplier: number = 90;

  constructor(private plotterService: PlotterService) {}

  ngOnInit(): void {
    this.canvasMembers = this.plotterService.plotFamily(this.lineLength);
  }

  ngAfterViewInit() {
    let svgPanZoom: SvgPanZoom.Instance = SvgPanZoom('#family-canvas-svg', this.options);
  }


  handleLineLengthChange(lineLength) {
    this.canvasMembers = this.plotterService.plotFamily(lineLength, this.sizeMultiplier / 100);
  }

  handleSizeMultiplierChange(sizeMultiplier) {
    this.canvasMembers = this.plotterService.plotFamily(this.lineLength, (sizeMultiplier / 100));
  }

  // plotFamily(lineLength) {
  //   this.canvasMembers = this.plotterService.plotFamily(lineLength)
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }



}
