import {Filler} from '../../../InjectableInterfaces/Filler';
import * as Fixtures from './__fixtures__/LoginForms.html.fixture';

export function testLoginForm(
  testName: string,
  fixture: string,
  fillerInstance: Filler<{}>,
  correctPasswordSelector: string,
  correctUsernameSelector?: string | false,
): void {
  const uniqueTestValue = 'q29oui120943ijhljknmjfklsdfw';

  describe(testName, () => {
    beforeEach(() => {
      document.body.innerHTML = fixture;
    });

    it('test case provides correct selectors', () => {
      expect(document.querySelectorAll(correctPasswordSelector).length).toBe(1);
      if (correctUsernameSelector) {
        expect(document.querySelectorAll(correctUsernameSelector).length).toBe(1);
      }
    });

    describe('password filling', () => {
      let pwField: HTMLInputElement;
      let otherInputs: HTMLInputElement[];
      let otherInputValues: string[];
      beforeEach(() => {
        pwField = document.querySelector(correctPasswordSelector) as any; // tslint:disable-line:no-any
        otherInputs = Array.from(document.querySelectorAll('input')).filter((input: HTMLInputElement) => input !== pwField);
        otherInputValues = otherInputs.map((input: HTMLInputElement) => input.value);

        fillerInstance.fillPassword({id: 0} as any, uniqueTestValue); // tslint:disable-line:no-any
      });

      it('fills the correct field', () => {
        expect(pwField.value).toEqual(uniqueTestValue);
      });

      it('does not fill any other fields', () => {
        expect(otherInputs.map((input: HTMLInputElement) => input.value)).toEqual(otherInputValues);
      });

    });

    if (correctUsernameSelector) {
      describe('username filling', () => {
        let usernameField: HTMLInputElement;
        let otherInputs: HTMLInputElement[];
        let otherInputValues: string[];
        beforeEach(() => {
          usernameField = document.querySelector(correctUsernameSelector) as any; // tslint:disable-line:no-any
          otherInputs = Array.from(document.querySelectorAll('input')).filter((input: HTMLInputElement) => input !== usernameField);
          otherInputValues = otherInputs.map((input: HTMLInputElement) => input.value);

          fillerInstance.fillUsername({id: 0} as any, uniqueTestValue); // tslint:disable-line:no-any
        });

        it('fills the correct field', () => {
          expect(usernameField.value).toEqual(uniqueTestValue);
        });

        it('does not fill any other fields', () => {
          expect(otherInputs.map((input: HTMLInputElement) => input.value)).toEqual(otherInputValues);
        });
      });
    }

  });
}

export function testFixtures(filler: Filler<{}>, testUsernameFilling: boolean): void {
  testLoginForm(
    'google username step', Fixtures.googleUsernameStep, filler,
    'input[name="hiddenPassword"]', testUsernameFilling && '#identifierId',
  );
  testLoginForm(
    'google password step', Fixtures.googlePasswordStep, filler,
    'input[name="password"]', testUsernameFilling && '#hiddenEmail',
  );
  testLoginForm(
    'facebook', Fixtures.facebookLogin, filler,
    '#pass', testUsernameFilling && 'input[name="email"]',
  );
  testLoginForm(
    'amazon', Fixtures.amazonLogin, filler,
    '#ap_password', testUsernameFilling && '#ap_email',
  );
  testLoginForm(
    'wikipedia', Fixtures.wikipediaLogin, filler,
    '#wpPassword1', testUsernameFilling && '#wpName1',
  );
  testLoginForm(
    'twitter', Fixtures.twitterLogin, filler,
    'input.js-password-field', testUsernameFilling && 'input.js-username-field',
  );
  testLoginForm(
    'instagram', Fixtures.instagramLogin, filler,
    'input[name="password"]', testUsernameFilling && 'input[name="username"]',
  );
  testLoginForm(
    'ebay', Fixtures.ebayLogin, filler, '#pass', testUsernameFilling && '#userid_otp',
  );
}
