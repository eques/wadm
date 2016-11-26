import { Component } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "all-programs",
  template: `
<table>
<tr>
  <th>name</th>
  <th>customFields</th>
  <th>amount</th>
  <th>unit</th>
</tr>
<tr *ngFor="let program of programs">
<div *ngIf="!program.editing">
  <td>{{program.name}}</td>
  <td>{{program.customFields}}</td>
  <td>{{program.amount}}</td>
  <td>{{program.unit}}</td>
  <td><button (click)="edit(program)">edit</button></td>
  <td><button (click)="delete(program)">delete</button></td>
</div>
  <td colspan="6" *ngIf="program.editing">lala</td>
</tr></table>`
})
export class AllProgramsComponent {
  private programs;

  constructor(private programService: ProgramService) {
    this.programService.getAllProgramms()
      .then(res => this.programs = res)
      .then(() => this.programs.map(p => p.editing = false))
      .catch(err => console.log(err));
  }

  edit(program: Program) {
    program.editing = true;
  }

  save(program: Program) {
    this.programService.save(program)
      .catch(err => console.log(err));
  }

  delete(program: Program) {
    this.programService.delete(program)
      .then(res => this.programs = this.programs.filter(p => p.id !== program.id))
      .catch(err => console.log(err));
  }
}
