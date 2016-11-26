
import { AllProgramsComponent } from "./all-programs.component";
import { AuthGuard } from "../shared/guard/auth.guard";

const programsChildRoutes = {
  // toExample: {path: "example", component: ExampleComponent}
};

export var programsRoutes: any = Object.create(programsChildRoutes);
programsRoutes.moduleRoot = {
  path: "programs",
  component: AllProgramsComponent,
  canActivate: [AuthGuard],
  children: Object.keys(programsChildRoutes).map((k) => programsChildRoutes[k])
};