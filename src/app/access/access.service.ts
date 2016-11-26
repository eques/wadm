import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";

@Injectable()
export class AccessService extends GeneralHttpService {
  private paths = {
    activateFidebox: "some-api/test"
  };

  constructor(http: Http) {
    super(http);
  }

  login() {
    console.log("try login");
  }

  signUp() {
    console.log("try sign up");
  }
}