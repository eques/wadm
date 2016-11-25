import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { routes } from "./route";
import { SharedModule } from "./shared/shared.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ExampleComponent } from "./example.component";
import { ExampleService } from "./example.service";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { ProgrammModule } from "./programms/programm.module";
import { FideboxModule } from "./fidebox/fidebox.module";

@NgModule({
  declarations: [
    AppComponent,

    HeaderComponent,
    FooterComponent,
    MainMenuComponent,

    ExampleComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy },
    ExampleService
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(Object.keys(routes).map((k) => routes[k])),
    SharedModule.forRoot(),

    FideboxModule,
    ProgrammModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
