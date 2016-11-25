// get /dump/
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "./shared/general-http.service";

@Injectable()
export class ExampleService extends GeneralHttpService {
  private path = {};

  constructor(http: Http) {
    super(http);
  }

  dump(): Promise<Response> {
    return this.post("/some-api/test", {});
  }
}