import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  template: `
  <div class="row-fluid">
    <div class="col-md-10 text-center">
      <h2>
      {{"landing.welcome" | translate}}
      </h2>
    </div>
  </div>
`
})
export class LandingComponent {

}