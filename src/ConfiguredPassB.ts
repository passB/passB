import {Container} from 'typedi';

import {PassB} from "./PassB";

/**
 * exports a passB instance for the current context, with all options set
 */
export const passB: PassB = Container.get(PassB);
