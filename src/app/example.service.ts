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

  activate(): Promise<Response> {
    return this.post("/api/fidebox/activate", {serial: "new_serial_number"});
  }

  create_prog(): Promise<Response> {
    return this.post("/api/program/create", {name: "doge", discount: "20", target: 10, pos_nr: "0001"});
  }

  login(): Promise<Response> {
    return this.post("/api/business/login", {username: "oskars2-1@yopmail.com", password: "123456"});
  }

  fideboxLogin(): Promise<Response> {
    return this.post("/api/fidebox/login", {serial: "doge"});
  }
}