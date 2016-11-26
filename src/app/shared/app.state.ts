import "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AppState {
  isCustomerLoggedIn: boolean = false;
}