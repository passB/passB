import {ExecutionContext} from "../src/Decorators/ExecuteInContext";

declare global {
  export interface Window {
    executionContext: ExecutionContext;
  }
}
