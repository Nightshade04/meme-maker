import { Component } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { WidgetUtilService } from '../services/widget-util.service';
import { Router } from '@angular/router';
import { FirestoreDbService } from '../services/firestore-db.service';

@Component({
  selector: 'app-user',
  templateUrl: 'user.page.html',
  styleUrls: ['user.page.scss']
})
export class Tab3Page {

  isLoggedIn: boolean = false;
  presentLoader: boolean = true;
  profileData: any = {};
  profileDataNotAvailabe: boolean = false;
  userPosts: Array<String> = [];

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private firestoreDbService: FirestoreDbService,
    private widgetUtilService: WidgetUtilService,
    private router: Router
  ) {
    this.getAuthState();
  }

  getAuthState() {
    this.presentLoader = false;
    this.firebaseAuthService.getAuthState().subscribe(user => {
      console.log('user =======> ', user ? user.toJSON() : null)
      if (user && user.emailVerified) {
        var email = user.toJSON()['email'];
        this.firestoreDbService.getUserDataByEmail('users', email).subscribe(result => {
          console.log(result);
          this.profileData = result.length == 0 ? user.toJSON() : result[0];
          this.presentLoader = true;
          this.isLoggedIn = true;
          if (result.length == 0) {
            console.log('I am HERE!!!!!!!!!!!!!!!!!!');
            this.firestoreDbService.addUser('users', {
              fiestName: user.toJSON()['displayName'].split(' ')[0],
              lastName: user.toJSON()['displayName'].split(' ')[1],
              displayName: user.toJSON()['displayName'],
              email: user.toJSON()['email'],
              follows: [],
              followedBy: [],
              posts: [],
              photoURL: user.toJSON()['photoURL']
            }).then(() => {
              this.getAuthState();
            });
          }
          else {
            this.getAllPostsByUser(email);
          }
        }, error => {
          this.presentLoader = true;
          this.isLoggedIn = false;
          this.widgetUtilService.presentToast(error);
        });
      }
      else {
        user = null;
        this.presentLoader = true;
        this.isLoggedIn = false;
      }
    }, error => {
      this.widgetUtilService.presentToast(error);
    });
  }


  //dummy method, maybe used later...
  handleNavigation() {
    if (this.isLoggedIn) {
      console.log(this.router.url)
      const currentUrl = this.router.url.split('/')[1];
      if (currentUrl === 'login' || currentUrl === 'signup') {
        this.router.navigate(['/tabs/user']);
      }
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    try {
      this.profileData = {};
      await this.firebaseAuthService.logout();
      this.widgetUtilService.presentToast('Logged Out Successfully');
      this.router.navigate(['/tabs/library']);
    } catch (error) {
      this.widgetUtilService.presentToast(error)
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  getAllPostsByUser(email) {
    this.firestoreDbService.getUserDataByEmail('users', email).subscribe(result => {
      console.log(result[0])
      this.userPosts = result[0]['posts'];
      console.log(this.userPosts, 'USER POSTS');
    }
      , error => {
        this.widgetUtilService.dismissLoader();
        this.widgetUtilService.presentToast(error);

      })
  }


}
