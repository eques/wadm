import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";
import { AppState } from "../shared/app.state";

@Injectable()
export class AccessService extends GeneralHttpService {
  private paths = {
    activateFidebox: "some-api/test",
    register: "/api/business/register"
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

  signUp(credentials): Promise<Response> {
    let params = {
      username: credentials.username,
      password: credentials.password
    };

    this.appState.isLoggedIn = true;
    return this.post(this.paths.register, params);
  }

  signOut(): Promise<Response> {
    console.log("try sign out");
    this.appState.isLoggedIn = false;
    return Promise.resolve({status: 200});
  }
}