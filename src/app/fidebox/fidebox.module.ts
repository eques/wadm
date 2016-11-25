import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ActivateFideboxComponent } from "./activate-fidebox.component";
import { fideboxRoutes } from "./fidebox-routes";

@NgModule({
  declarations: [
    ActivateFideboxComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forChild([fideboxRoutes.moduleRoot]),
    SharedModule
  ]
})
export class FideboxModule {}
