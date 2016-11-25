import { Component, OnInit } from "@angular/core";
import { TranslateService } from "ng2-translate/ng2-translate";

@Component({
  selector: "my-app",
  template: `
      <wheader></wheader>
      <main id="content">
        <main-menu></main-menu>
        <router-outlet></router-outlet>
      </main>
      <wfooter></wfooter>
`
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.configureTranslator();
  }

  private configureTranslator() {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }
}
