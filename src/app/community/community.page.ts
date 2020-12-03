import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { WidgetUtilService } from '../services/widget-util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirestoreDbService } from '../services/firestore-db.service';

@Component({
  selector: 'app-community',
  templateUrl: 'community.page.html',
  styleUrls: ['community.page.scss']
})
export class Tab2Page {

  isLoggedIn: boolean = false;
  posts: Array<any> = [];
  loggedInUser: any = undefined;
  

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private widgetUtilService: WidgetUtilService,
    private router: Router,
    private firestoreDbService: FirestoreDbService
  ) {
    this.getAuthState();
  }

  getAuthState() {
    this.widgetUtilService.presentLoading();
    this.firebaseAuthService.getAuthState().subscribe(user => {
      if (user && user.emailVerified) {
        console.log('User is already Logged IN');
        this.loggedInUser = user;
        this.getAllPostsByTime();
      }
      else {
        user = null;
        this.router.navigate(['/login']);
      }
      this.widgetUtilService.dismissLoader();
    }, error => {
      this.widgetUtilService.dismissLoader();
      this.widgetUtilService.presentToast(error);
    });
  }

  getAllPostsByTime() {
    this.firestoreDbService.getAllPosts('posts').subscribe(result => {
      this.posts = result;
      console.log(this.posts);
      this.widgetUtilService.dismissLoader();
    }, error => {
      this.widgetUtilService.presentToast(error);
    });
  }

}
