import { Component } from "@angular/core";
import { FideboxService } from "./fidebox.service";

@Component({
  selector: "activate-fidebox",
  template: `
  <div>
    <form (ngSubmit)="registerNewFidebox()"
          #regFidebox="ngForm">
      <div *ngIf="!regFidebox?.submitted">
        <input type="text" placeholder="{{'activate-fidebox.placeholder-enter_serial_numb' | translate}}">
        <button type="submit">{{"activate-fidebox.button-activate" | translate}}</button>
      </div>
      <div *ngIf="regFidebox?.submitted">
        <div *ngIf="response?.status === 200">{{"activate-fidebox.text-successful_activation" | translate}}</div>
        <div *ngIf="response?.status !== 200">{{"activate-fidebox.text-failed_activation" | translate}}</div>
        <button type="reset">{{"activate-fidebox.button-reset" | translate}}</button>
      </div>
    </form>
  </div>
`
})
export class ActivateFideboxComponent {

  private response: any;

  constructor(private fideboxService: FideboxService) {}

  registerNewFidebox() {
    this.fideboxService.activateFidebox()
      .then(res => this.response = res)
      .catch(err => this.response = err);
  }
}
