import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '@shared';
import { Theme } from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  constructor(private authService: AuthService) {}

  themes = Theme;
  public onSuccess(): void {
    return this.authService.onSuccess();
  }

}
