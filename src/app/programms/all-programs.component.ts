import { Component } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "all-programs",
  template: `
  <div class="row">
    <div class="col-md-9">&nbsp;</div>
    <button class="btn btn-primary col-md-2" (click)="addNew()">Add new</button>
  </div>
  <div class="row">
    <div class="col-md-2">Name</div>
    <div class="col-md-2">Discount</div>
    <div class="col-md-2">Target</div>
    <div class="col-md-2">POS Nr.</div>
    <div class="col-md-2">&nbsp;</div>
    <div class="col-md-2">&nbsp;</div>
</div>
<div *ngFor="let program of programs">
  <div class="row" *ngIf="!program.editing">
    <div class="col-md-2">{{program.name}}</div>
    <div class="col-md-2">{{program.percent}}</div>
    <div class="col-md-2">{{program.target}}</div>
    <div class="col-md-2">{{program.pos}}</div>
    <div class="col-md-2 clickable text-success" (click)="edit(program)"><span class="glyphicon glyphicon-pencil"></span> Edit</div>
    <div class="col-md-2 clickable text-danger" (click)="delete(program)"><span class="glyphicon glyphicon-remove"></span> Delete</div>
  </div>
  <div class="row" *ngIf="program.editing" >
    <div class="col-md-8"><edit-program [program]="program"></edit-program></div>
  </div>
</div>
`
})
export class AllProgramsComponent {
  private programs;

  constructor(private programService: ProgramService) {
    this.programService.getAllProgramms()
      .then(res => this.programs = res)
      .then(() => this.programs.map(p => p.editing = false))
      .catch(err => console.log(err));
  }

  addNew() {
    let newProgram = new Program();
    newProgram.editing = true;
    this.programs.push(newProgram);
  }

  edit(program: Program) {
    program.editing = true;
  }

  delete(program: Program) {
    this.programService.delete(program)
      .then(res => this.programs = this.programs.filter(p => p.id !== program.id))
      .catch(err => console.log(err));
  }
}
