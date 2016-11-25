import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { programmsRoutes } from "./programms-routes";
import { AllProgrammsComponent } from "./all-programms.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    AllProgrammsComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forChild([programmsRoutes.moduleRoot]),
    SharedModule
  ]
})
export class ProgrammModule {}
