import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FamilyService } from './family-view/family-canvas/family.service';
import { Family } from './family-view/shared/family.model';
import { Member } from './family-view/shared/member.model';
import { GedcomProcessorService } from './gedcomProcessor/gedcom-processor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  members: Member[];
  families: Family[];
  membersSubscription: Subscription;
  familiesSubscription: Subscription;
  fileLoaded: Boolean = false;
  displayTree: Boolean = false;

  constructor(private gedcomService: GedcomProcessorService, private familyService: FamilyService) {}

  ngOnInit() {
    this.membersSubscription = this.gedcomService.membersChanged.subscribe(
      (members) => {
        this.members = members;
        this.familyService.setFamilyMembers(this.members);
      }
    );

    this.familiesSubscription = this.gedcomService.familiesChanged.subscribe(
      (families) => {
        this.families = families;
        this.familyService.setFamilies(this.families);
      }
    )
  }

  loadFile(fileContent: String) {
    this.fileLoaded = true;
    this.gedcomService.processFile(fileContent);
  }

  ngOnDestroy() {
    this.membersSubscription.unsubscribe();
  }

  setDisplayTree(val: Boolean) {
    this.displayTree = val;
  }

  title = 'GEDCOMRenderer';
}
