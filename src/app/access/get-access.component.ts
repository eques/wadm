import { Component } from "@angular/core";
import { AccessService } from "./access.service";
import { AppState } from "../shared/app.state";

@Component({
  selector: "access",
  template: `
  <form *ngIf="!appState.isLoggedIn">
    <input type="email" placeholder="{{'access.placeholder-enter_email' | translate}}">
    <input type="password" placeholder="{{'access.placeholder-enter_passw' | translate}}">
    <button (click)="signup()">{{"access.button-signup" | translate}}</button>
    <button (click)="login()">{{"access.button-login" | translate}}</button>
  </form>
  <button *ngIf="appState.isLoggedIn" (click)="signOut()">{{"access.button-sign_out" | translate}}</button>
`
})
export class GetAccessComponent {
  constructor(private accessService: AccessService,
              private appState: AppState) {}

  signup() {
    this.accessService.signUp()
      .catch(err => console.log(err));
  }

  login() {
    this.accessService.login()
      .catch(err => console.log(err));
  }

  signOut() {
    this.accessService.signOut();
  }
}
