import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDbService {

  constructor(
    private db: AngularFirestore
  ) { }

  getUserDataByEmail(collecttionId, email) {
    return this.db.collection(collecttionId, ref => ref.where('email', '==', email)).snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          var obj: any = doc.payload.doc.data();
          return {
            id: doc.payload.doc.id,
            ...obj
          }
        })
      })
    );
  }

  async updateUserDataById(collectionId, docId, data) {
    try {
      const result = await this.db.doc(`${collectionId}/${docId}`).update(data);
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteUserDataById(collectionId, docId) {
    try {
      const result = await this.db.doc(`${collectionId}/${docId}`).delete();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  async addUser(collectionId, data) {
    try {
      const result = await this.db.collection(collectionId).add(data);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

}
