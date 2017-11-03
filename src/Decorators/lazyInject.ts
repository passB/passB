import getDecorators from 'inversify-inject-decorators';
import {container} from 'Container';

const {lazyInject} = getDecorators(container);

export {lazyInject};
