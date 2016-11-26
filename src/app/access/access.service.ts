import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";
import { AppState } from "../shared/app.state";

@Injectable()
export class AccessService extends GeneralHttpService {
  private paths = {
    activateFidebox: "some-api/test"
  };

  constructor(http: Http,
              private appState: AppState) {
    super(http);
  }

  login(): Promise<Response> {
    // TODO: implement me
    console.log("try login");
    this.appState.isLoggedIn = true;
    return Promise.resolve({status: 200});
  }

  signUp(): Promise<Response> {
    // TODO: implement me
    console.log("try sign up");
    this.appState.isLoggedIn = true;
    return Promise.resolve({status: 200});
  }

  signOut(): Promise<Response> {
    console.log("try sign out");
    this.appState.isLoggedIn = false;
    return Promise.resolve({status: 200});
  }
}