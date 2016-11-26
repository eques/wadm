import { Component, Input, OnInit } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "edit-program",
  template: `
  <form (ngSubmit)="save()">
    <div class="row form-group">
      <div class="col-md-2 text-right">
        <label for="name">{{"program.fields.name" | translate}}</label>
      </div>
      <div class="col-md-4">
        <input name="name" id="name" class="form-control" [(ngModel)]="program.name" type="text" placeholder="{{'program.fields.name' | translate}}">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-2 text-right">
        <label for="percent">{{"program.fields.discount" | translate}}</label>
      </div>
      <div class="col-md-4">
        <input name="percent" id="percent" class="form-control" [(ngModel)]="program.discount" type="text" placeholder="{{'program.fields.discount' | translate}}">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-2 text-right">
        <label for="target">{{"program.fields.target" | translate}}</label>
      </div>
      <div class="col-md-4">
        <input name="target" id="target" class="form-control" [(ngModel)]="program.target" type="text" placeholder="{{'program.fields.target' | translate}}">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-2 text-right">
        <label for="pos">{{"program.fields.pos-nr" | translate}}</label>
      </div>
      <div class="col-md-4">
        <input name="pos" id="pos" class="form-control" [(ngModel)]="program.posNr" type="text" placeholder="{{'program.fields.pos-nr' | translate}}">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-2">&nbsp;</div>
      <div class="col-md-2">
        <button class="btn btn-success" type="submit">{{"program.buttons.save" | translate}}</button>
      </div>
      <div class="col-md-2">
        <button class="btn btn-warning" type="button" (click)="cancel()">{{"program.buttons.cancel" | translate}}</button>
      </div>
    </div>
  </form>
`
})
export class EditProgramComponent implements OnInit {

  @Input()
  private program: Program;

  private bcProgram: Program;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.bcProgram = Object.assign({}, this.program);
  }

  save() {
    this.programService.save(this.program)
      .then(res => this.program.editing = false)
      .catch(err => console.log(err));
  }

  cancel() {
    Object.assign(this.program, this.bcProgram);
    this.program.editing = false;
  }
}
