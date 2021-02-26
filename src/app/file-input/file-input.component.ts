import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { GedcomProcessorService } from '../gedcomProcessor/gedcom-processor.service';
import { fileExtensionValidator } from './shared/file-extension.directive';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
})
export class FileInputComponent implements OnInit {
  constructor(private fb: FormBuilder, private gp: GedcomProcessorService) {}

  file: File;
  @Output() loadFileEvent = new EventEmitter<String>();
  submitted: Boolean = false;

  fileForm: FormGroup;
  fileExt: String = 'ged';

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
    }
  }

  onSubmit() {
    this.submitted = true;
    const reader = new FileReader();

    reader.readAsText(this.file);

    reader.onload = () => {
      this.loadFileEvent.emit(reader.result as String);
    };
  }

  ngOnInit(): void {
    this.fileForm = new FormGroup({
      file: new FormControl(this.file, [
        Validators.required,
        fileExtensionValidator(this.fileExt),
      ]),
    });
  }


}
