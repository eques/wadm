import { Component, Input } from "@angular/core";
import { FideboxService } from "./fidebox.service";

@Component({
  selector: "activate-fidebox",
  template: `
  <div>
    <form (ngSubmit)="registerNewFidebox()"
          #regFidebox="ngForm">
      <div *ngIf="!regFidebox?.submitted" class="form-group row">
        <div class="col-md-2 text-right">
          <label for="name">{{"fidebox.fields.serial" | translate}}</label>
        </div>
        <div class="col-md-4">
          <input type="text" [(ngModel)]="serial" name="serial" class="form-control form-control-lg" placeholder="{{'fidebox.fields.serial' | translate}}">
        </div>
        <button type="submit" class="col-md-2 btn btn-primary fide-success">{{"fidebox.buttons.activate" | translate}}</button>
      </div>
      <div *ngIf="regFidebox?.submitted">
        <div class="row">
          <div class="alert no-shadows fide-alert-success col-md-6" role="alert" *ngIf="response?.status === 200">{{"fidebox.messages.success" | translate}}</div>
          <div class="alert no-shadows fide-alert-error col-md-6" role="alert" *ngIf="response?.status !== 200">{{"fidebox.messages.error" | translate}}</div>
        </div>
        <div class="row">
          <button type="reset" class="btn fide-success col-md-3">{{"fidebox.buttons.another" | translate}}</button>
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
