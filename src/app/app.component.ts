import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { ProgressService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private progress: ProgressService){
    firebase.initializeApp(firebaseKeys);
  }

  public ngOnInit(): void {
    if(firebase.auth().currentUser) {
      this.progress.initProgress();
    }
    firebase.auth().onAuthStateChanged((authState)=> {
      console.error(authState)
      if(authState.uid) {
        this.progress.initProgress();
      }
    });
  }
}
