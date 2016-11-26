import { Component } from "@angular/core";
import { AccessService } from "./access.service";
import { AppState } from "../shared/app.state";

@Component({
  selector: "access",
  template: `
  <form>
    <input type="email" placeholder="{{'access.placeholder-enter_email' | translate}}">
    <input type="password" placeholder="{{'access.placeholder-enter_passw' | translate}}">
    <button type="submit" (click)="signup()">{{"access.button-signup" | translate}}</button>
    <button type="submit" (click)="login()">{{"access.button-login" | translate}}</button>
  </form>
`
})
export class GetAccessComponent {
  constructor(private accessService: AccessService) {}

  signup() {
    this.accessService.signUp()
      .catch(err => console.log(err));
  }

  login() {
    this.accessService.login()
      .catch(err => console.log(err));
  }
}
