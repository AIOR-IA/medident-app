import { AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordMatchValidator = (password: string, confirmPassword: string): unknown => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors['passwordMismatch']
    ) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ 'passwordMismatch': true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
    return null;
  };
}
