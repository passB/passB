import {RouteComponentProps} from 'react-router';

export function getMockRouteComponentProps<P>(data: P): RouteComponentProps<P> {
  const location = {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: {},
  };
  return {
    match: {
      isExact: true,
      params: data,
      path: '',
      url: '',
    },
    location,
    history: {
      length: 2,
      action: 'POP',
      location,
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      block: jest.fn(),
      createHref: jest.fn(),
      listen: jest.fn(),
    },
    staticContext: {},
  };
}
