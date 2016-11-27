import { Component } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "all-programs",
  template: `
  <div class="row" *ngIf="!editMode">
    <div class="col-md-9">&nbsp;</div>
    <button class="btn btn-primary col-md-2 fide-button" (click)="addNew()">{{"program.buttons.add-new" | translate}}</button>
  </div>
  <div class="row title-row">
    <div class="col-md-2 row-title">{{"program.fields.name" | translate}}</div>
    <div class="col-md-2 row-title">{{"program.fields.discount" | translate}}</div>
    <div class="col-md-2 row-title">{{"program.fields.target" | translate}}</div>
    <div class="col-md-2 row-title">{{"program.fields.pos-nr" | translate}}</div>
    <div class="col-md-2">&nbsp;</div>
    <div class="col-md-2">&nbsp;</div>
</div>
<div class="fide-table">
  <div *ngFor="let program of programs" class="fide-table-row">
    <div class="fide-table-row" *ngIf="program.editing" >
      <edit-program [program]="program" [programs]="programs" (close)="onEditClose($event)"></edit-program>
    </div>
    <div class="row" *ngIf="!program.editing">
      <div class="col-md-2">{{program.name}}</div>
      <div class="col-md-2">{{program.discount}}</div>
      <div class="col-md-2">{{program.target}}</div>
      <div class="col-md-2">{{program.posNr}}</div>
      <div class="col-md-2 clickable text-success clickable" *ngIf="!editMode" (click)="edit(program)"><span class="glyphicon glyphicon-pencil"></span> {{"program.buttons.edit" | translate}}</div>
      <div class="col-md-2 clickable text-danger clickable" *ngIf="!editMode" (click)="delete(program)"><span class="glyphicon glyphicon-remove"></span> {{"program.buttons.delete" | translate}}</div>
    </div>
  </div>
</div>
`
})
export class AllProgramsComponent {
  private programs;
  private editMode = false;

  constructor(private programService: ProgramService) {
    this.programService.getAllProgramms()
      .then(res => {
        this.programs = res.json()

      })
      .then(() => this.programs.map(p => p.editing = false))
      .catch(err => console.log(err));
  }

  onEditClose(b:boolean):void {
    this.editMode = b;
  }

  addNew() {
    this.editMode = true;
    let newProgram = new Program();
    newProgram.editing = true;
    this.programs.unshift(newProgram);
  }

  edit(program: Program) {
    this.editMode = true;
    program.editing = true;
  }

  delete(program: Program) {
    this.programService.delete(program)
      .then(res => this.programs = this.programs.filter(p => p.programId !== program.programId))
      .catch(err => console.log(err));
  }
}
