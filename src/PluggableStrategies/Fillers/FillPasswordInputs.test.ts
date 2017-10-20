import 'jest';
import {Container} from 'typedi';
import {fillPasswordInputs, FillPasswordInputs} from './FillPasswordInputs';

describe('FillPasswordInputs', () => {

  beforeEach(() => {
    document.body.innerHTML = `
    <div>
      <input id="input-1" type="text" value="foo" />
      <input id="pw-input-1" type="password" value="foo" />
      <input id="pw-input-2" type="password" value="foo" />
    </div>
  `;
  });

  const pwString = 'as1d\'qw3e"y4§$xc`f!gh';

  interface TestState {
    input1: string;
    pwInput1: string;
    pwInput2: string;
  }

  async function expectBeforeAfter(before: TestState, callback: () => Promise<void | {}>, after: TestState): Promise<void> {
    const input1 = document.getElementById('input-1') as HTMLInputElement;
    const pwInput1 = document.getElementById('pw-input-1') as HTMLInputElement;
    const pwInput2 = document.getElementById('pw-input-2') as HTMLInputElement;

    expect(input1.value).toBe(before.input1);
    expect(pwInput1.value).toBe(before.pwInput1);
    expect(pwInput2.value).toBe(before.pwInput2);

    await callback();

    expect(input1.value).toBe(after.input1);
    expect(pwInput1.value).toBe(after.pwInput1);
    expect(pwInput2.value).toBe(after.pwInput2);
  }

  it('should fill a password', async () => {
    const executeScript = jest.fn(
      async (unused: {}, {code}: { code: string }) => {
        // necessary for code coverage - see https://github.com/gotwarlost/istanbul/issues/674
        code = code.replace(/cov_\w+\.\w(\[\d+])+\+\+[,;]/g, '');
        eval(code);  // tslint:disable-line:no-eval
      },
    );
    (window as any).browser = {tabs: {executeScript}}; // tslint:disable-line:no-any

    const filler = Container.get(FillPasswordInputs);

    await expectBeforeAfter(
      {input1: 'foo', pwInput1: 'foo', pwInput2: 'foo'},
      () => filler.fillPassword({id: 0} as any, pwString), // tslint:disable-line:no-any
      {input1: 'foo', pwInput1: pwString, pwInput2: pwString},
    );

    expect(executeScript.mock.calls.length).toBe(1);
  });

  it('should fill a password (direct call)', async () => {
    await expectBeforeAfter(
      {input1: 'foo', pwInput1: 'foo', pwInput2: 'foo'},
      async () => fillPasswordInputs(pwString),
      {input1: 'foo', pwInput1: pwString, pwInput2: pwString},
    );
  });

  it('should not fill on empty string', async () => {
    const executeScript = jest.fn(
      async (unused: {}, {code}: { code: string }) => {
        // necessary for code coverage - see https://github.com/gotwarlost/istanbul/issues/674
        code = code.replace(/cov_\w+\.\w(\[\d+])+\+\+[,;]/g, '');
        eval(code);  // tslint:disable-line:no-eval
      },
    );
    (window as any).browser = {tabs: {executeScript}}; // tslint:disable-line:no-any

    const filler = Container.get(FillPasswordInputs);

    await expectBeforeAfter(
      {input1: 'foo', pwInput1: 'foo', pwInput2: 'foo'},
      () => filler.fillPassword({id: 0} as any, ''), // tslint:disable-line:no-any
      {input1: 'foo', pwInput1: 'foo', pwInput2: 'foo'},
    );

    expect(executeScript.mock.calls.length).toBe(0);
  });

  it('should not fill usernames', async () => {
    const filler = Container.get(FillPasswordInputs);

    await expectBeforeAfter(
      {input1: 'foo', pwInput1: 'foo', pwInput2: 'foo'},
      () => filler.fillUsername({id: 0} as any, 'username'), // tslint:disable-line:no-any
      {input1: 'foo', pwInput1: 'foo', pwInput2: 'foo'},
    );
  });
});
