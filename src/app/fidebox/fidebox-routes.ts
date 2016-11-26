import { ActivateFideboxComponent } from "./activate-fidebox.component";
import { AuthGuard } from "../shared/guard/auth.guard";
const fideboxChildRoutes = {

};

export var fideboxRoutes: any = Object.create(fideboxChildRoutes);
fideboxRoutes.moduleRoot = {
  path: "activate-fidebox",
  component: ActivateFideboxComponent,
  canActivate: [AuthGuard],
  children: Object.keys(fideboxChildRoutes).map((k) => fideboxChildRoutes[k])
};
