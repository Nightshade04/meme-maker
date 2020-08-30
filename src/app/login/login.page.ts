import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LOGINFORMERRORS } from '../constants/validationErrorMessages';
import { HelperService } from '../services/helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { WidgetUtilService } from '../services/widget-util.service';
import { FirestoreDbService } from '../services/firestore-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  parentPage: string = null;

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formErrors: any = {
    email: '',
    password: ''
  }
  errorMessages: any = LOGINFORMERRORS;
  showSpinner: boolean = false;

  constructor(
    private helperService: HelperService,
    private router: Router,
    private firebaseAuthService: FirebaseAuthService,
    private firestoreDbService: FirestoreDbService,
    private widgetUtilService: WidgetUtilService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.parentPage = params["parentPage"];
    });
    this.createFormControl();
    this.createForm();
  }

  goToSignupPage() {
    this.router.navigate(['/signup']);
  }

  createFormControl() {
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
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
    this.loginForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data) {
    this.formErrors = this.helperService.prepareErrorMessages(this.loginForm, this.errorMessages, this.formErrors);

  }

  resetForm() {
    this.loginForm.reset();
    this.formErrors = {
      email: '',
      password: ''
    }
  }

  async login() {
    try {
      this.showSpinner = true;
      let result = await this.firebaseAuthService.signInWithEmailAndPassword(this.email.value, this.password.value);
      console.log(result);
      if (!(result.user.emailVerified)) {
        console.log('HERE')
        result = null
        await this.firebaseAuthService.logout();
        throw new Error('User email not verified, please verify the email and try again...');
      }
      else {
        console.log('Also HERE', this.parentPage)
        this.widgetUtilService.presentToast('Login Successful, Welcome!');
        this.resetForm();
        // this.router.navigate([this.parentPage]);
        this.router.navigate(['/tabs/user']);
      }
      this.showSpinner = false;
    } catch (error) {
      this.showSpinner = false
      this.widgetUtilService.presentToast("Error : " + error)
    }
  }

  googleLogin() {
    if (this.helperService.detectPlatform()) {
      this.nativeGoogleLogin()
    }
    else {
      this.googleWebLogin()
    }
  }

  async googleWebLogin() {
    try {
      this.widgetUtilService.presentLoading();
      this.firebaseAuthService.googleLoginWeb();
      this.widgetUtilService.presentToast('Login Successful');
      this.router.navigate(['/tabs/user']);
      this.widgetUtilService.dismissLoader();
    } catch (error) {
      this.widgetUtilService.dismissLoader();
      this.widgetUtilService.presentToast('Something went wrong!!!');
    }
  }

  async nativeGoogleLogin() {
    try {
      this.widgetUtilService.presentLoading();
      await this.firebaseAuthService.nativeGoogleLogin();
      this.widgetUtilService.presentToast('Login Successful')
      this.router.navigate(['/tabs/user']);
      this.widgetUtilService.dismissLoader();
    } catch (error) {
      console.log(error)
      this.widgetUtilService.presentToast('Something went wrong!!!')
      this.widgetUtilService.dismissLoader()
    }
  }

}
