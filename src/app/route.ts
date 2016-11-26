import { ExampleComponent } from "./example.component";
import { GetAccessComponent } from "./access/get-access.component";

export const routes = {
  toIndex: {path: "", component: ExampleComponent},
  toAccess: {path: "access", component: GetAccessComponent}
};