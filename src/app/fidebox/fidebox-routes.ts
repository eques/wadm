import { ActivateFideboxComponent } from "./activate-fidebox.component";
import { AuthGuard } from "../shared/guard/auth.guard";
import { ExampleComponent } from "../example.component";
import { findFormatter } from "tslint/lib/formatterLoader";
const fideboxChildRoutes = {
  toExample: {path: "example", component: ExampleComponent}
};

export var fideboxRoutes: any = Object.create(fideboxChildRoutes);
fideboxRoutes.moduleRoot = {
  path: "activate-fidebox",
  component: ActivateFideboxComponent,
  canActivate: [AuthGuard],
  children: Object.keys(fideboxChildRoutes).map((k) => fideboxChildRoutes[k])
};
