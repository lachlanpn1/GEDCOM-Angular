import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileExtensionValidator(testExt: String): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let file = control.value;
      let validFile = file.split('.').pop() == testExt;
      return validFile ? null : { validExt: 'false' };
    }
  };
}
