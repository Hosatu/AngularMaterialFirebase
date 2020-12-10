import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, Subject } from 'rxjs';
import { HasSubscriptions } from '../../shared/utilities';

@Injectable({
  providedIn: 'root'
})
export class ProgressService extends HasSubscriptions{
  private progress;
  public updated: Subject<void> = new BehaviorSubject<void>(null);
  constructor(private files: HttpClient) {
    super();
  }

   initProgress() {
    const uid = firebase.auth().currentUser.uid;
    this.safeSubscribe(
      this.files.get('/assets/data/progress.json'),
      (fileContent) => {
        console.log(fileContent, uid);
        firebase.firestore().collection(`progress`).doc(uid).get().then((snap) => {
          console.log(snap)
          if (snap.exists == false) {
            firebase.firestore().collection(`progress`).doc(uid).set(
              fileContent
            ).then(()=> {
              this.loadProgress(uid);
            });
          }
        });
      }
    );
    this.loadProgress(uid);
   }

   loadProgress(uid) {
    return firebase.firestore().collection(`progress`).doc(uid).get().then((snap) => snap.data()).then((data) => {
      this.progress = data;
      console.log("PROGRESS LOAD")
      this.updated.next();
    })
   }

  getProgress() {
    return this.progress;
   }

   updateProgress(uid, value) {
    firebase.firestore().collection(`progress`).doc(uid).update(value).then(()=> {
      console.log("FB UPDATE")
      this.loadProgress(uid);
      //this.updated.next();
    });
   }
}
