import { Component, Input, OnInit } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "edit-program",
  template: `
  <form (ngSubmit)="save()">
    <div class="row form-group">
      <div class="col-md-4">
        <input name="name" class="form-control" [(ngModel)]="program.name" type="text" placeholder="name">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-4">
        <input name="percent" class="form-control" [(ngModel)]="program.percent" type="text" placeholder="%">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-4">
        <input name="target" class="form-control" [(ngModel)]="program.target" type="text" placeholder="target">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-4">
        <input name="pos" class="form-control" [(ngModel)]="program.pos" type="text" placeholder="POS nr.">
      </div>
    </div>
    <div class="row form-group">
      <div class="col-md-2">
        <button class="btn btn-success" type="submit">save</button>
      </div>
      <div class="col-md-2">
        <button class="btn btn-warning" type="button" (click)="cancel()">cancel</button>
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
