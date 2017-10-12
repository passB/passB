window.executionContext = 'background';

import {Container} from 'typedi';
import {PassB} from './PassB';

Container.get(PassB).initialize();
