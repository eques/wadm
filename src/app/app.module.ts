import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { routes } from "./route";
import { SharedModule } from "./shared/shared.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { ProgramModule } from "./programms/program.module";
import { FideboxModule } from "./fidebox/fidebox.module";
import { AccessModule } from "./access/access.module";
import { LandingComponent } from "./landing.component";

@NgModule({
  declarations: [
    AppComponent,

    HeaderComponent,
    FooterComponent,
    MainMenuComponent,
    LandingComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(Object.keys(routes).map((k) => routes[k])),
    SharedModule.forRoot(),

    FideboxModule,
    ProgramModule,
    AccessModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
