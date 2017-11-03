import {configure} from 'enzyme';
import Adapter = require('enzyme-adapter-react-16');
configure({ adapter: new Adapter() });

if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', (reason: Error) => {
    console.error(reason);
  });
  process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
}
