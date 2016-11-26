import { Component } from "@angular/core";

@Component({
  selector: "main-menu",
  template: `

    <ul class="nav nav-pills nav-stacked">
        <li><a href="/#/programms"><span class="glyphicon glyphicon-list"></span> {{"main-menu.link-all_programms" | translate}}</a></li>
        <li><a href="/#/activate-fidebox"><span class="glyphicon glyphicon-off"></span>  {{"main-menu.link-activate_fidebox" | translate}}</a></li>
    </ul>
  `
})
export class MainMenuComponent {}
