import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { GetAccessComponent } from "./get-access.component";
import { SharedModule } from "../shared/shared.module";
import { AccessService } from "./access.service";

@NgModule({
  declarations: [
    GetAccessComponent
  ],
  exports: [ GetAccessComponent ],
  providers: [ AccessService ],
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    SharedModule
  ]
})
export class AccessModule {}
