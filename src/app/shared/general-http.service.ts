import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export abstract class GeneralHttpService {

  constructor(private http: Http) {
    this.defaultRequestOprions = new RequestOptions();
    this.defaultRequestOprions.headers = new Headers({"Content-Type": "application/json"});
  };

  private defaultRequestOprions: RequestOptions;

  get(path: string): Promise<Response> {
    console.log("GET", path);
    return this.http
      .get(path)
      .toPromise();
  }

  post(path: string, params?: any, options?: RequestOptions): Promise<Response> {
    console.log("POST", path, params);
    return this.http
      .post(path, JSON.stringify(params), options || this.defaultRequestOprions)
      .toPromise();
  }
}