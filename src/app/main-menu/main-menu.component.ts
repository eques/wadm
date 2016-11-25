import { Component } from "@angular/core";

@Component({
  selector: "main-menu",
  template: `
    <dl>
    <dd><a href="/#/programms">{{"main-menu.link-all_programms" | translate}}</a></dd>
    <dd><a href="/#/activate-fidebox">{{"main-menu.link-activate_fidebox" | translate}}</a></dd>
    </dl> 
  `
})
export class MainMenuComponent {}
