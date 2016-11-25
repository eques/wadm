import { NgModule, ModuleWithProviders } from "@angular/core";
import { TranslateModule } from "ng2-translate/ng2-translate";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [],
  exports: [ TranslateModule ],
  imports: [
    CommonModule,
    HttpModule,
    TranslateModule.forRoot()
  ],
})
export class GeneralModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GeneralModule,
      providers: []
    };
  }
}
