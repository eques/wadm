import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ActivateFideboxComponent } from "./activate-fidebox.component";
import { fideboxRoutes } from "./fidebox-routes";
import { FideboxService } from "./fidebox.service";

@NgModule({
  declarations: [
    ActivateFideboxComponent
  ],
  providers: [ FideboxService ],
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forChild([fideboxRoutes.moduleRoot]),
    SharedModule
  ]
})
export class FideboxModule {}
