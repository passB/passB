// material-ui seems to have some problems - referencing it here solves that
// see https://github.com/callemall/material-ui/issues/7853
/// <reference types="@types/material-ui" />
// web-ext-types is not a @types repo and needs to be referenced here
/// <reference types="web-ext-types/global" />

import {ExecutionContext} from "../src/Decorators/ExecuteInContext";

declare global {
  export interface Window {
    executionContext: ExecutionContext;
  }
}
