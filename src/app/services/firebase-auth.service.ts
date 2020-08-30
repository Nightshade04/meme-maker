import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HelperService } from './helper.service';
import { auth } from 'firebase';
import { FirestoreDbService } from './firestore-db.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(
    private angularFireAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private firestoreDbService: FirestoreDbService,
    private helperService: HelperService
  ) { }

  async registerWithEmailAndPassword(email, password) {
    try {
      const result = await this.angularFireAuth.createUserWithEmailAndPassword(email, password);
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      return result;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  async signInWithEmailAndPassword(email, password) {
    try {
      const result = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
      return result;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  async logout() {
    try {
      await this.angularFireAuth.signOut();
      if (this.helperService.detectPlatform()) {
        await this.nativeGooleLogout()
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async nativeGooleLogout() {
    try {
      await this.googlePlus.logout()
    } catch (error) {
      throw new Error(error)
    }
  }

  getAuthState() {
    return this.angularFireAuth.authState;
  }

  async googleLoginWeb() {
    try {
      await this.angularFireAuth.signInWithRedirect(new auth.GoogleAuthProvider());
    } catch (error) {
      throw new Error(error);
    }
  }

  async nativeGoogleLogin() {
    try {
      const result = await this.googlePlus.login({
        webClientId: '405295606690-tlgdldti91dkq7o8sogk75rjs3dlvim1.apps.googleusercontent.com',
        offline: true,
        scope: 'profile email'
      });
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }
}
