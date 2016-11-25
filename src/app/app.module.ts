import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { routes } from "./route";
import { GeneralModule } from "./shared/general.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ExampleComponent } from "./example.component";
import { ExampleService } from "./example.service";

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy },
    ExampleService
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(Object.keys(routes).map((k) => routes[k])),
    GeneralModule.forRoot()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
