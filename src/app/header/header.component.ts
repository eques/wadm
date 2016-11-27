import { Component } from "@angular/core";

@Component({
  selector: "wheader",
  template: `
  <div class="page-header">
    <div class="main-logo"></div>
    <div class="subtitle">{{"wheader.title-dashboard" | translate}}</div>
    <access></access>
  </div>
`
})
export class HeaderComponent {}
