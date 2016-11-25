import { ActivateFideboxComponent } from "./activate-fidebox.component";
const fideboxChildRoutes = {
  // toExample: {path: "example", component: ExampleComponent}
};

export var fideboxRoutes: any = Object.create(fideboxChildRoutes);
fideboxRoutes.moduleRoot = {
  path: "activate-fidebox",
  component: ActivateFideboxComponent,
  children: Object.keys(fideboxChildRoutes).map((k) => fideboxChildRoutes[k])
};