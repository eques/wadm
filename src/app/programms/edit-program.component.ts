import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { ProgramService } from "./programm.service";
import { Program } from "./program";

@Component({
  selector: "edit-program",
  template: `
    <div class="row">
      <div class="col-md-2">
        <input name="name" id="name" class="form-control" [(ngModel)]="program.name" type="text" placeholder="{{'program.fields.name' | translate}}">
      </div>
      <div class="col-md-2">
        <input name="percent" id="percent" class="form-control" [(ngModel)]="program.discount" type="text" placeholder="{{'program.fields.discount' | translate}}">
      </div>
      <div class="col-md-2">
        <input name="target" id="target" class="form-control" [(ngModel)]="program.target" type="text" placeholder="{{'program.fields.target' | translate}}">
      </div>
      <div class="col-md-2">
        <input name="pos" id="pos" class="form-control" [(ngModel)]="program.posNr" type="text" placeholder="{{'program.fields.pos-nr' | translate}}">
      </div>
      <div class="col-md-2 clickable text-success clickable" (click)="save()"><span class="glyphicon glyphicon-floppy-disk"></span> {{"program.buttons.save" | translate}}</div>
      <div class="col-md-2 clickable text-danger clickable" (click)="cancel()"><span class="glyphicon glyphicon-remove"></span> {{"program.buttons.cancel" | translate}}</div>
    </div>
`
})
export class EditProgramComponent implements OnInit {

  @Input()
  private program: Program;

  @Input()
  private programs: Program[];

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  private bcProgram: Program;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.bcProgram = Object.assign({}, this.program);
  }

  save() {
    this.programService.save(this.program)
      .then(res => {
        if (!this.program.hasOwnProperty("programId")) {
          this.programs.shift();
          this.programs.push(res.json());
        }
        this.program.editing = false;
        this.close.emit(false);
      })
      .catch(err => console.log(err));
  }

  cancel() {
    Object.assign(this.program, this.bcProgram);
    if (!this.program.hasOwnProperty("programId")) {
      this.programs.shift();
    }
    this.program.editing = false;
    this.close.emit(false);
  }
}
