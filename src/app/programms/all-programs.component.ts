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
  <th>customFields</th>
  <th>amount</th>
  <th>unit</th>
  <th>a</th>
  <th>a</th>
</tr>
</thead>
<tbody>
<div *ngFor="let program of programs">
  <tr *ngIf="!program.editing">
    <td>{{program.name}}</td>
    <td>{{program.customFields}}</td>
    <td>{{program.amount}}</td>
    <td>{{program.unit}}</td>
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
