import { Component } from "@angular/core";

@Component({
  selector: "wheader",
  template: `
      <div class="page-header">
      <h1>{{"wheader.title-dashboard" | translate}}</h1>
</div>
`
})
export class HeaderComponent {}
