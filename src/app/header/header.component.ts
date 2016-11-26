import { Component } from "@angular/core";

@Component({
  selector: "wheader",
  template: `
  <div class="page-header">
    <h1>{{"wheader.title-dashboard" | translate}}</h1>
    <access></access>
  </div>
`
})
export class HeaderComponent {}
