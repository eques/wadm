import "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AppState {
  isLoggedIn: boolean = false;
}