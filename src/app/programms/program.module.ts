import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { HashLocationStrategy, LocationStrategy, CommonModule } from "@angular/common";
import { programsRoutes } from "./programs-routes";
import { AllProgramsComponent } from "./all-programs.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    AllProgramsComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forChild([programsRoutes.moduleRoot]),
    SharedModule
  ]
})
export class ProgramModule {}
