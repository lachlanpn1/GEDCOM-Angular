import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FamilyCanvasComponent } from './family-view/family-canvas/family-canvas.component';
import { FamilyCanvasMemberComponent } from './family-view/family-canvas-member/family-canvas-member.component';
import { FamilyService } from './family-view/family-canvas/family.service';
import { FileInputComponent } from './file-input/file-input.component';
import { FamilyListComponent } from './family-view/family-list/family-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FamilyCanvasComponent,
    FamilyCanvasMemberComponent,
    FileInputComponent,
    FamilyListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [FamilyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
