import { Component } from "@angular/core";
import { ExampleService } from "./example.service";

@Component({
  selector: "my-app",
  template: `
      example component
`
})
export class ExampleComponent {

  constructor(private es: ExampleService) {
    // es.login().then(res =>
    //   es.activate().then(res => console.log(res.json()))
    // );
    // es.fideboxLogin()
    //   .then(res => console.log(res.json()))
    // es.login().then(res =>
    //   es.create_prog().then(res => console.log(res.json()))
    // );
  }
}
