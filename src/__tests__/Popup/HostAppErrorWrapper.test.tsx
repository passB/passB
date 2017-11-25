import {shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {getMockRouteComponentProps} from '__test_helpers__/getMockRouteComponentProps';
import {container, Symbols} from 'Container';
import {HostAppErrorWrapper, HostAppErrorWrapperComponent, HostAppErrorWrapperComponentProps} from 'Popup/Components/HostAppErrorWrapper';
import {ErrorType} from 'State/HostApp/index';

function renderShallow({children, ...props}: Partial<HostAppErrorWrapperComponentProps>): ShallowWrapper {
  const mockedRouteComponentProps = getMockRouteComponentProps({});
  const mockedClasses = {fullWidth: 'fullWidth', padding: 'padding'};

  return shallow(
    <HostAppErrorWrapperComponent
      {...mockedRouteComponentProps}
      classes={mockedClasses}
      clearLastError={() => 0}
      hostAppError={void 0}
      {...props}
    >
      {children || <span>empty</span>}
    </HostAppErrorWrapperComponent>,
  );
}

describe('HostAppErrorWrapper', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('renders it\'s children when there is no error', () => {
    const rendered = renderShallow({children: <div id="test">test</div>});
    expect(rendered).toMatchSnapshot();
    expect(rendered.find('#test').length).toBe(1);
  });

  it('does not render children when there is an error', () => {
    const rendered = renderShallow({
      children: <div id="test">test</div>,
      hostAppError: {type: ErrorType.HOST_APP_ERROR, message: 'testError'},
    });
    expect(rendered).toMatchSnapshot();
    expect(rendered.find('#test').length).toBe(0);
  });

  describe('hostApp communication error', () => {
    let rendered: ShallowWrapper;
    beforeEach(() => {
      rendered = renderShallow({
        children: <div id="test">test</div>,
        hostAppError: {type: ErrorType.HOST_APP_ERROR, message: 'testError'},
      });
    });

    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });

    it('clicking hostAppInfo opens a tab with installation instructions', () => {
      rendered.find('.hostAppInfo').simulate('click');
      expect(browser.tabs.create).toHaveBeenCalledWith({url: 'https://passb.github.io/host_application.html'});
    });

    it('clicking reloadExtension reloads the extension', () => {
      const spy = jest.fn();
      container.rebind(Symbols.PassB).toConstantValue({reloadExtension: spy});
      rendered.find('.reloadExtension').simulate('click');
      expect(spy).toHaveBeenCalled();
    });

    it('clicking openGithub opens github', () => {
      rendered.find('.openGithub').simulate('click');
      expect(browser.tabs.create).toHaveBeenCalledWith({url: 'https://github.com/PassB/passB/issues'});
    });
  });

  describe('pass exection error', () => {
    let rendered: ShallowWrapper;
    let clearLastError: jest.Mock;
    let routeComponentProps: RouteComponentProps<{}>;
    beforeEach(() => {
      routeComponentProps = getMockRouteComponentProps({});
      clearLastError = jest.fn();
      rendered = renderShallow({
        ...routeComponentProps,
        children: <div id="test">test</div>,
        hostAppError: {type: ErrorType.PASS_EXECUTION_ERROR, message: 'testError'},
        clearLastError,
      });
    });

    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });

    it('does not show the error message initially', () => {
      expect(rendered.debug()).not.toContain('testError');
    });

    it('clicking showError shows the error message', () => {
      rendered.find('.showError').simulate('click');
      expect(rendered.debug()).toContain('testError');
    });

    it('clicking goBack clears the error and navigates back', () => {
      expect(clearLastError).not.toHaveBeenCalled();
      rendered.find('.goBack').simulate('click');
      expect(clearLastError).toHaveBeenCalled();
      expect(routeComponentProps.history.goBack).toHaveBeenCalled();
    });

    it('clicking openGithub opens github', () => {
      rendered.find('.openGithub').simulate('click');
      expect(browser.tabs.create).toHaveBeenCalledWith({url: 'https://github.com/PassB/passB/issues'});
    });
  });

});
