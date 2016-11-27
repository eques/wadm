import { Component } from "@angular/core";

@Component({
  selector: "wfooter",
  template: `
<div class="fide-footer">
  {{"wfooter.feeling-lost" | translate}} <a href="http://www.fidebox.com" target="_blank">Fidebox.com</a>!      
</div>
`
})
export class FooterComponent {}
