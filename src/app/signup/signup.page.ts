import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SIGNUPFORMERRORS } from '../constants/validationErrorMessages';
import { HelperService } from '../services/helper.service';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { WidgetUtilService } from '../services/widget-util.service';
import { FirestoreDbService } from '../services/firestore-db.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupFrom: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  formErrors: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
  errorMessages: any = SIGNUPFORMERRORS;
  showSpinner: boolean = false;

  constructor(
    private helperService: HelperService,
    private router: Router,
    private firebaseAuthService: FirebaseAuthService,
    private firestoreDbService: FirestoreDbService,
    private widgetUtilService: WidgetUtilService
  ) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  resetForm() {
    this.signupFrom.reset();
    this.formErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  }

  async signUp() {
    try {
      this.showSpinner = true;
      await this.firestoreDbService.addUser('users', {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        displayName: this.firstName.value + " " + this.lastName.value,
        email: this.email.value,
        followedBy: [],
        follows: [],
        posts:[],
        photoURL: ''
      });
      const result = await this.firebaseAuthService.registerWithEmailAndPassword(this.email.value, this.password.value);
      console.log(result);
      this.widgetUtilService.presentToast('SignUp Successful!, Verification Email Sent!');
      this.resetForm();
      this.router.navigate(['/login']);
      this.showSpinner = false;
    }
    catch (error) {
      this.showSpinner = false;
      this.widgetUtilService.presentToast(error);
      console.log(error);
    }
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  createFormControl() {
    this.firstName = new FormControl('', [
      Validators.required
    ]);
    this.lastName = new FormControl('', [
      Validators.required
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})");
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(strongRegex)
    ]);
  }

  createForm() {
    this.signupFrom = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    });
    this.signupFrom.valueChanges.subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data) {
    this.formErrors = this.helperService.prepareErrorMessages(this.signupFrom, this.errorMessages, this.formErrors);

  }

}
