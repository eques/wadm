import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";

@Injectable()
export class FideboxService extends GeneralHttpService {
  private paths = {
    activateFidebox: "/api/fidebox/activate"
  };

  constructor(http: Http) {
    super(http);
  }

  activateFidebox(serial: string): Promise<Response> {
    return this.post(this.paths.activateFidebox, {serial: serial});
  }
}