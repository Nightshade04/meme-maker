import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private platform: Platform
  ) { }

  prepareErrorMessages(form, validationErrorMessages, formFields) {

    for (const field in formFields) {
      formFields[field] = ''
      const control = form.controls[field];
      if (control && control.invalid) {
        const messageObj = validationErrorMessages[field]
        for (const key in control.errors) {
          formFields[field] = formFields[field] + messageObj[key] + ' '
        }
      }
    }

    return formFields;

  }

  detectPlatform() {
    return this.platform.is('cordova') || this.platform.is('capacitor');
  }

}
