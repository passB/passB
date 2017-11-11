import {EntryMetadata, Filler} from '../../../InjectableInterfaces/Filler';
import {LoginFormFixture} from './__fixtures__/LoginForms.html.fixture';

export function testLoginForm(
  testName: string,
  fillerInstance: Filler<{}>,
  {html, passwordSelector, usernameSelector}: LoginFormFixture,
  entryMetadata: EntryMetadata,
  skipUsernameTest: boolean,
  [afterPasswordTest, afterUsernameTest]: [() => void, () => void] = [() => 0, () => 0],
): void {
  const uniqueTestValue = 'q29oui120943ijhljknmjfklsdfw';

  describe(testName, () => {
    beforeEach(() => {
      document.body.innerHTML = html;
    });

    describe('password filling', () => {
      let pwField: HTMLInputElement;
      let otherInputs: HTMLInputElement[];
      let otherInputValues: string[];
      beforeEach(async () => {
        pwField = document.querySelector(passwordSelector) as any; // tslint:disable-line:no-any
        otherInputs = Array.from(document.querySelectorAll('input')).filter((input: HTMLInputElement) => input !== pwField);
        otherInputValues = otherInputs.map((input: HTMLInputElement) => input.value);

        await fillerInstance.fillPassword({id: 0} as any, uniqueTestValue, entryMetadata); // tslint:disable-line:no-any
      });

      it('fills the correct field', () => {
        expect(pwField.value).toEqual(uniqueTestValue);
      });

      it('does not fill any other fields', () => {
       expect(otherInputs.map((input: HTMLInputElement) => input.value)).toEqual(otherInputValues);
      });

      afterPasswordTest();
    });

    if (!skipUsernameTest) {
      describe('username filling', () => {
        let usernameField: HTMLInputElement;
        let otherInputs: HTMLInputElement[];
        let otherInputValues: string[];
        beforeEach(async () => {
          usernameField = document.querySelector(usernameSelector) as any; // tslint:disable-line:no-any
          otherInputs = Array.from(document.querySelectorAll('input')).filter((input: HTMLInputElement) => input !== usernameField);
          otherInputValues = otherInputs.map((input: HTMLInputElement) => input.value);

          await fillerInstance.fillUsername({id: 0} as any, uniqueTestValue, entryMetadata); // tslint:disable-line:no-any
        });

        it('fills the correct field', () => {
          expect(usernameField.value).toEqual(uniqueTestValue);
        });

        it('does not fill any other fields', () => {
          expect(otherInputs.map((input: HTMLInputElement) => input.value)).toEqual(otherInputValues);
        });

        afterUsernameTest();
      });
    }

  });
}
