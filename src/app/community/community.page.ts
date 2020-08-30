import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { WidgetUtilService } from '../services/widget-util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-community',
  templateUrl: 'community.page.html',
  styleUrls: ['community.page.scss']
})
export class Tab2Page {

  isLoggedIn: boolean = false;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private widgetUtilService: WidgetUtilService,
    private router: Router,
    private navCtrl: NavController
  ) {
    // this.getAuthState();
  }

  getAuthState() {
    this.widgetUtilService.presentLoading();
    this.firebaseAuthService.getAuthState().subscribe(user => {
      console.log('user =======> ', user ? user.toJSON() : null)
      if (user && user.emailVerified) {
        this.isLoggedIn = true;
      }
      else {
        user = null;
        this.isLoggedIn = false;
      }
      console.log('HERERERERERE');
      this.handleNavigation();
      this.widgetUtilService.dismissLoader();
    }, error => {
      this.widgetUtilService.dismissLoader();
      this.widgetUtilService.presentToast(error);
    });
  }

  handleNavigation() {
    if (this.isLoggedIn) {
      console.log(this.router.url)
      const currentUrl = this.router.url.split('/')[1];
      if (currentUrl === 'login' || currentUrl === 'signup') {
        this.router.navigate(['/tabs/community']);
      }
    }
    else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          parentPage: this.router.url
        }
      }
      this.navCtrl.navigateForward(['/login'], navigationExtras)
      // this.router.navigate(['/login']);
    }
  }

}
