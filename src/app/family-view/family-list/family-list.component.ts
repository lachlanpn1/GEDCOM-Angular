import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FamilyService } from '../family-canvas/family.service';
import { Member } from '../shared/member.model';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css']
})
export class FamilyListComponent implements OnInit {

  members: Array<Member>;
  private subscription: Subscription;

  constructor(private familyService : FamilyService) {
    this.subscription = this.familyService.membersChanged.subscribe(
      (members) => {
        this.members = members;
      }
    );
   }

  ngOnInit(): void {
    this.members = this.familyService.getFamilyMembers();
  }

  getCountOfErrors() : Number {
    let errorCount = 0;
    this.members.forEach((member) => {
      if(member.Error) {
        errorCount++;
      }
    })
    return errorCount;
  }

}
