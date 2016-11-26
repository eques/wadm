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
           placeholder="{{'access.fields.email' | translate}}">
  </div>
  <div class="form-group">
    <input type="password"
           name="password"
           class="form-control"
           [(ngModel)]="credentials.password"
           placeholder="{{'access.fields.password' | translate}}">
  </div>
  <button type="button" class="btn btn-primary" (click)="signup()">{{"access.buttons.sign-up" | translate}}</button>
  <button type="button" class="btn btn-success" (click)="login()">{{"access.buttons.login" | translate}}</button>
  </form>
  <div class="alert alert-error" role="alert" *ngIf="authError">{{"access.messages.error" | translate}}</div>
  <button class="btn btn-danger" *ngIf="appState.isLoggedIn" (click)="signOut()">{{"access.buttons.sing-out" | translate}}</button>
`
})
export class GetAccessComponent {

  private credentials = {
    username: <string> undefined,
    password: <string> undefined
  };

  private authError = false;

  constructor(private accessService: AccessService,
              private appState: AppState,
              private router: Router) {}

  signup() {
    this.accessService.signUp(this.credentials)
      .then(res => {
        if (res.status === 200) {
          this.appState.isLoggedIn = true;
          this.authError = false;
          this.router.navigate([programsRoutes.moduleRoot.path]);
        } else {
          this.authError = true;
        }
      })
      .catch(err => {
        this.authError = true;
        console.log(err)
      });
  }

  login() {
    this.accessService.login(this.credentials)
      .then(res => {
        if (res.status === 200) {
          this.appState.isLoggedIn = true;
          this.authError = false;
          this.router.navigateByUrl(programsRoutes.moduleRoot.path);
        } else {
          this.authError = true;
        }
      })
      .catch(err => {
        this.authError = true;
        console.log(err)
      });
  }

  signOut() {
    this.accessService.signOut();
    this.router.navigateByUrl(routes.toIndex.path);
  }
}
