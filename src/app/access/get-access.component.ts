import { Component } from "@angular/core";
import { AccessService } from "./access.service";
import { AppState } from "../shared/app.state";
import { Router } from "@angular/router";
import { programsRoutes } from "../programms/programs-routes";
import { routes } from "../route";

@Component({
  selector: "access",
  template: `
  <form *ngIf="!appState.isLoggedIn" class="form-inline">
  <div class="form-group">
    <input type="email" 
           name="email"
           class="form-control"
           [(ngModel)]="credentials.username"
           placeholder="{{'access.placeholder-enter_email' | translate}}">
  </div>
  <div class="form-group">
    <input type="password"
           name="password"
           class="form-control"
           [(ngModel)]="credentials.password"
           placeholder="{{'access.placeholder-enter_passw' | translate}}">
  </div>
  <button type="button" class="btn btn-primary" (click)="signup()">{{"access.button-signup" | translate}}</button>
  <button type="button" class="btn btn-success" (click)="login()">{{"access.button-login" | translate}}</button>
  </form>
  <button class="btn btn-danger" *ngIf="appState.isLoggedIn" (click)="signOut()">{{"access.button-sign_out" | translate}}</button>
`
})
export class GetAccessComponent {

  private credentials = {
    username: <string> undefined,
    password: <string> undefined
  };

  constructor(private accessService: AccessService,
              private appState: AppState,
              private router: Router) {}

  signup() {
    this.accessService.signUp(this.credentials)
      .then(res => this.router.navigate([programsRoutes.moduleRoot.path]))
      .catch(err => console.log(err));
  }

  login() {
    this.accessService.login(this.credentials)
      .then(res => {
        console.log("lala");
        this.router.navigateByUrl(programsRoutes.moduleRoot.path);
      })
      .catch(err => console.log(err));
  }

  signOut() {
    this.accessService.signOut();
    this.router.navigateByUrl(routes.toIndex.path);
  }
}
