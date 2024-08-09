import { AbstractControl } from '@angular/forms';
export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let confirm_password = control.get('confirm_password').value;
    if (password != confirm_password) {
      control.get('confirm_password').setErrors({ ConfirmPassword: true });
    }
    else {
      return null;
    }
  }
}