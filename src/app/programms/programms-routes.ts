
import { AllProgrammsComponent } from "./all-programms.component";

const programmsChildRoutes = {
  // toExample: {path: "example", component: ExampleComponent}
};

export var programmsRoutes: any = Object.create(programmsChildRoutes);
programmsRoutes.moduleRoot = {
  path: "programms",
  component: AllProgrammsComponent,
  children: Object.keys(programmsChildRoutes).map((k) => programmsChildRoutes[k])
};