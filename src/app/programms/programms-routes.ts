
import { AllProgrammsComponent } from "./all-programms.component";
import { AuthGuard } from "../shared/guard/auth.guard";

const programmsChildRoutes = {
  // toExample: {path: "example", component: ExampleComponent}
};

export var programmsRoutes: any = Object.create(programmsChildRoutes);
programmsRoutes.moduleRoot = {
  path: "programms",
  component: AllProgrammsComponent,
  canActivate: [AuthGuard],
  children: Object.keys(programmsChildRoutes).map((k) => programmsChildRoutes[k])
};