import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { GeneralHttpService } from "../shared/general-http.service";
import "rxjs";
import { AppState } from "../shared/app.state";
import { Program } from "./program";

@Injectable()
export class ProgramService extends GeneralHttpService {
  private paths = {
    getAllPrograms: "w/programs",
    saveProgram: "w/programs",
    deleteProgram: "w/programs"
  };

  constructor(http: Http) {
    super(http);
  }

  save(program: Program): Promise<Response> {
    return Promise.resolve();
  }

  delete(program: Program): Promise<Response>  {
    return Promise.resolve();
  }

  getAllProgramms(): Promise<Program[]> {
    let programs = [
      new Program(),
      new Program(),
      new Program()
    ];

    // return this.post(this.paths.getAllPrograms, {});
    return Promise.resolve(programs);
  }

}