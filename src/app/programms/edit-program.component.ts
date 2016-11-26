import { Component, Input, OnInit } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "edit-program",
  template: `
  <form (ngSubmit)="save()">
    <input name="name" [(ngModel)]="program.name" type="text" placeholder="name"><br>
    <input name="percent" [(ngModel)]="program.percent" type="text" placeholder="%"><br>
    <input name="target" [(ngModel)]="program.target" type="text" placeholder="target"><br>
    <input name="pos" [(ngModel)]="program.pos" type="text" placeholder="POS nr."><br>
    <button type="submit">save</button>
    <button (click)="cancel()">cancel</button>
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

  save(program: Program) {
    this.programService.save(program)
      .then(res => program.editing = false)
      .catch(err => console.log(err));
  }

  cancel() {
    this.program = Object.assign(this.program, this.bcProgram);
    this.program.editing = false;
  }
}
