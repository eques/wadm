import { Component, Input } from "@angular/core";
import { FideboxService } from "./fidebox.service";

@Component({
  selector: "activate-fidebox",
  template: `
  <div>
    <form (ngSubmit)="registerNewFidebox()"
          #regFidebox="ngForm">
      <div *ngIf="!regFidebox?.submitted" class="form-group row">
        <div class="col-md-4">
          <input type="text" [(ngModel)]="serial" name="serial" class="form-control form-control-lg" placeholder="{{'activate-fidebox.placeholder-enter_serial_numb' | translate}}">
        </div>
        <button type="submit" class="col-md-2 btn btn-primary">{{"activate-fidebox.button-activate" | translate}}</button>
      </div>
      <div *ngIf="regFidebox?.submitted">
        <div class="row">
          <div class="alert alert-success col-md-6" role="alert" *ngIf="response?.status === 200">{{"activate-fidebox.text-successful_activation" | translate}}</div>
          <div class="alert alert-error col-md-6" role="alert" *ngIf="response?.status !== 200">{{"activate-fidebox.text-failed_activation" | translate}}</div>
        </div>
        <div class="row">
          <button type="reset" class="btn btn-success col-md-3">{{"activate-fidebox.button-reset" | translate}}</button>
        </div>
      </div>
    </form>
  </div>
`
})
export class ActivateFideboxComponent {

  private response: any;

  @Input()
  private serial: string;

  constructor(private fideboxService: FideboxService) {}

  registerNewFidebox() {
    this.fideboxService.activateFidebox(this.serial)
      .then(res => this.response = res)
      .catch(err => this.response = err);
  }
}
