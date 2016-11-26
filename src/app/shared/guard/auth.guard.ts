import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AppState } from "../app.state";
import { Observable } from "rxjs";
import { routes } from "../../route";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private appState: AppState,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.appState.isLoggedIn) {
      this.router.navigate([routes.toAccess.path]);
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}