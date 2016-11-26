import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";
import { AppState } from "../shared/app.state";
import { Program } from "./program";

@Injectable()
export class ProgramService extends GeneralHttpService {
  private paths = {
    getAllPrograms: "api/program/list",
    saveProgram: "api/program/save",
    deleteProgram: "api/program/delete"
  };

  constructor(http: Http) {
    super(http);
  }

  save(program: Program): Promise<Response> {
    return this.post(this.paths.saveProgram, program);
  }

  delete(program: Program): Promise<Response>  {
    return this.post(this.paths.deleteProgram, program);
  }

  getAllProgramms(): Promise<Response> {
    let programs = [
      new Program(),
      new Program(),
      new Program()
    ];

    return this.get(this.paths.getAllPrograms);
  }

}