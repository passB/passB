import 'jest';
import {container, Interfaces, Symbols} from 'Container';
import {fillSelectorTarget, SelectorFiller} from 'PluggableStrategies/Fillers/SelectorFiller/SelectorFiller';
import {testLoginForm} from '../testFixtures';
import {Fixtures, SpecialFixtures} from '../__fixtures__/LoginForms.html.fixture';

describe('SelectorFiller', () => {
  beforeAll(() => {
    browser.tabs.executeScript = jest.fn(
      async (unused: {}, {code}: { code: string }) => {
        // necessary for code coverage - see https://github.com/gotwarlost/istanbul/issues/674
        code = code.replace(/cov_\w+\.\w(\[\d+])+\+\+[,;]/g, '');
        eval(code);  // tslint:disable-line:no-eval
      },
    );
  });

  it('is registered as Filler', () => {
    const instances = container.getAll<Interfaces.Filler<{}>>(Symbols.Filler);
    expect(
      instances.some((instance: Interfaces.Filler<{}>) => instance instanceof SelectorFiller),
    ).toBeTruthy();
  });

  describe('fills with default options', () => {
    const filler = container.resolve(SelectorFiller);
    Object.defineProperty(filler, 'options', {value: filler.defaultOptions});

    const meta = {entryName: '', entryContents: []};

    // default username filler will not get every username field correctly.
    // that is okay. but test the rest to prevent regression.
    const skipUsernameTests = ['wikipediaLogin', 'twitterLogin', 'instagramLogin', 'ebayLogin'];

    for (const [name, fixture] of Object.entries(Fixtures)) {
      testLoginForm(name, filler, fixture, meta, skipUsernameTests.includes(name));
    }
  });

  describe('filling with an empty password', () => {
    it('does not trigger browser.tabs.executeScript', async () => {
      const callCountBefore = (browser.tabs.executeScript as jest.Mock<void>).mock.calls.length;
      const filler = container.resolve(SelectorFiller);
      Object.defineProperty(filler, 'options', {value: filler.defaultOptions});

      await filler.fillPassword({id: 0} as any, '', {entryName: '', entryContents: []}); // tslint:disable-line:no-any

      expect((browser.tabs.executeScript as jest.Mock<void>).mock.calls.length).toBe(callCountBefore);
    });
  });

  describe('fills (direct call)', async () => {
    let otherInputs: HTMLInputElement[];
    let otherInputValues: string[];
    const uniqueTestValue = '19248zuc2983';

    describe('onlyFirst', () => {
      let pwField: HTMLInputElement;
      beforeAll(async () => {
        const fixture = SpecialFixtures.multiplePasswordFields;
        document.body.innerHTML = fixture.html;

        pwField = document.querySelector(fixture.passwordSelector) as any; // tslint:disable-line:no-any
        otherInputs = Array.from(document.querySelectorAll('input')).filter((input: HTMLInputElement) => input !== pwField);
        otherInputValues = otherInputs.map((input: HTMLInputElement) => input.value);

        fillSelectorTarget(fixture.passwordSelector, uniqueTestValue, true);
      });

      it('fills the correct field', () => {
        expect(pwField.value).toEqual(uniqueTestValue);
      });

      it('does not fill any other fields', () => {
        expect(otherInputs.map((input: HTMLInputElement) => input.value)).toEqual(otherInputValues);
      });
    });

    describe('multiple', () => {
      let pwFields: HTMLInputElement[];
      beforeAll(async () => {
        const fixture = SpecialFixtures.multiplePasswordFields;
        document.body.innerHTML = fixture.html;

        pwFields = Array.from(document.querySelectorAll(fixture.passwordSelector) as any); // tslint:disable-line:no-any
        otherInputs = Array.from(document.querySelectorAll('input')).filter((input: HTMLInputElement) => !pwFields.includes(input));
        otherInputValues = otherInputs.map((input: HTMLInputElement) => input.value);

        fillSelectorTarget(fixture.passwordSelector, uniqueTestValue, false);
      });

      it('fills the correct fields', () => {
        for (const pwField of pwFields) {
          expect(pwField.value).toEqual(uniqueTestValue);
        }
      });

      it('does not fill any other fieldss', () => {
        expect(otherInputs.map((input: HTMLInputElement) => input.value)).toEqual(otherInputValues);
      });
    });
  });

  describe('fills with entry-specific config in entry options', () => {
    const filler = container.resolve(SelectorFiller);
    Object.defineProperty(filler, 'options', {
      value: filler.defaultOptions.merge({
        usernameSelectorPrefix: 'usernameSelector:',
        passwordSelectorPrefix: 'passwordSelector:',
      }),
    });

    for (const [name, fixture] of Object.entries(Fixtures)) {
      {
        const entryContents = `myPassword
username: foo
usernameSelector: ${fixture.usernameSelector}
passwordSelector: ${fixture.passwordSelector}
`;
        const fillerSpy = jest.spyOn((filler as any), 'fillSelect'); // tslint:disable-line:no-any

        testLoginForm(
          name,
          filler,
          fixture,
          {entryName: `${name}/username`, entryContents: entryContents.split('\n')},
          false,
          [
            () => it('should have called fillSelect with the password selector from the entry-specific config', () => {
              expect(fillerSpy.mock.calls[fillerSpy.mock.calls.length - 1][1].trim()).toBe(fixture.passwordSelector);
            }),
            () => it('should have called fillSelect with the username selector from the entry-specific config', () => {
              expect(fillerSpy.mock.calls[fillerSpy.mock.calls.length - 1][1].trim()).toBe(fixture.usernameSelector);
            }),
          ],
        );
      }
    }
  });

  describe('falls back to default value when the file contains no prefix', () => {
    const filler = container.resolve(SelectorFiller);
    Object.defineProperty(filler, 'options', {
      value: filler.defaultOptions.merge({
        usernameSelectorPrefix: 'usernameSelector:',
        passwordSelectorPrefix: 'passwordSelector:',
      }),
    });

    const name = 'googlePasswordStep';
    const fixture = Fixtures[name];
    const entryContents = `myPassword
username: foo
`;
    const fillerSpy = jest.spyOn((filler as any), 'fillSelect'); // tslint:disable-line:no-any

    testLoginForm(
      name,
      filler,
      fixture,
      {entryName: `${name}/username`, entryContents: entryContents.split('\n')},
      false,
      [
        () => it('falls back to default password selector', () => {
          expect(fillerSpy.mock.calls[fillerSpy.mock.calls.length - 1][1].trim())
            .toBe(filler.defaultOptions.get('defaultPasswordSelector'));
        }),
        () => it('falls back to default username selector', () => {
          expect(fillerSpy.mock.calls[fillerSpy.mock.calls.length - 1][1].trim())
            .toBe(filler.defaultOptions.get('defaultUsernameSelector'));
        }),
      ],
    );
  });
});
