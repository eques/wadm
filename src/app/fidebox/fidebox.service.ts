import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";

@Injectable()
export class FideboxService extends GeneralHttpService {
  private paths = {
    activateFidebox: "some-api/test"
  };

  constructor(http: Http) {
    super(http);
  }

  activateFidebox(): Promise<Response> {
    // TODO: implement me
    // return this.post(this.paths.activateFidebox, {lala: "lala"});
    return Promise.resolve({status: 200});
  }
}