import {shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {getMockRouteComponentProps} from '../../__test_helpers__/getMockRouteComponentProps';
import {ErrorBoundaryComponent, Props} from '../../Popup/Components/ErrorBoundary';

function renderShallow({children, ...props}: Partial<Props & RouteComponentProps<{}>>): ShallowWrapper {
  const mockedRouteComponentProps = getMockRouteComponentProps({});
  const mockedClasses = {fullWidth: 'fullWidth', padding: 'padding'};

  return shallow(
    <ErrorBoundaryComponent
      {...mockedRouteComponentProps}
      classes={mockedClasses}
      {...props}
    >
      {children || <span>empty</span>}
    </ErrorBoundaryComponent>,
  );
}

describe('ErrorBoundary', () => {
  it('renders children', () => {
    expect(renderShallow({})).toMatchSnapshot();
  });

  it('renders error message when child throws error', () => {
    const rendered = renderShallow({});
    (rendered.instance() as ErrorBoundaryComponent)
      .componentDidCatch(new Error('testError'), {componentStack: 'testStack'});

    expect(rendered.update()).toMatchSnapshot();
  });

  describe('menu interaction', () => {
    let rendered: ShallowWrapper;
    let routeComponentProps: RouteComponentProps<{}>;
    beforeEach(() => {
      routeComponentProps = getMockRouteComponentProps({});
      rendered = renderShallow({
        ...routeComponentProps,
        children: <div id="test">test</div>,
      });
      rendered.setState({
        error: new Error('testError'),
        info: {componentStack: 'testStack'},
      });
    });

    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });

    it('does not show the error message initially', () => {
      expect(rendered.debug()).not.toContain('testError');
    });

    it('clicking showError shows the error message and stack', () => {
      rendered.find('.showError').simulate('click');
      expect(rendered.debug()).toContain('testError');
      expect(rendered.debug()).toContain('testStack');
    });

    it('clicking goBack clears the error and navigates back', () => {
      rendered.find('.goBack').simulate('click');
      expect(routeComponentProps.history.goBack).toHaveBeenCalled();
    });

    it('clicking openGithub opens github', () => {
      rendered.find('.openGithub').simulate('click');
      expect(browser.tabs.create).toHaveBeenCalledWith({url: 'https://github.com/PassB/passB/issues'});
    });
  });

});
