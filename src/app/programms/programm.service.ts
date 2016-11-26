import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";
import { AppState } from "../shared/app.state";

@Injectable()
export class ProgramService extends GeneralHttpService {
  private paths = {
    activateFidebox: "some-api/test"
  };

  constructor(http: Http) {
    super(http);
  }

  getAllProgramms(): Promise<Response> {
    let programms = {

    }

    return Promise.resolve(programms);
  }

}