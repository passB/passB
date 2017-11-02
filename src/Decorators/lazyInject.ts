import getDecorators from 'inversify-inject-decorators';
import {Container} from 'Container';

const {lazyInject} = getDecorators(Container);

export {lazyInject};
