import { Component, OnInit } from "@angular/core";
import { TranslateService } from "ng2-translate/ng2-translate";

@Component({
  selector: "my-app",
  template: `
      <header>header</header>
      <main id="content">
          <router-outlet></router-outlet>
      </main>
      <footer>footer</footer>
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
