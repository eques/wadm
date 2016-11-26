import { Component } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "all-programs",
  template: `
<table>
<thead>
<tr>
  <th>name</th>
  <th>percent</th>
  <th>target</th>
  <th>pos</th>
  <th></th>
  <th></th>
</tr>
</thead>
<tbody>
<div *ngFor="let program of programs">
  <tr *ngIf="!program.editing">
    <td>{{program.name}}</td>
    <td>{{program.percent}}</td>
    <td>{{program.target}}</td>
    <td>{{program.pos}}</td>
    <td><button (click)="edit(program)">edit</button></td>
    <td><button (click)="delete(program)">delete</button></td>
  </tr>
  <tr *ngIf="program.editing" >
    <td colspan="6"><edit-program [program]="program"></edit-program></td>
  </tr>
</div>
</tbody>
</table>`
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

  delete(program: Program) {
    this.programService.delete(program)
      .then(res => this.programs = this.programs.filter(p => p.id !== program.id))
      .catch(err => console.log(err));
  }
}
