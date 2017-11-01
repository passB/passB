/**
 * Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1324255
 * This does not seem to work in every browser version, but at least for some.
 */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(
    () => {
      document.querySelector('body')!.focus();
    },
    100,
  );
});

window.onload = () => {
  setTimeout(
    () => {
      document.querySelector('body')!.focus();
    },
    150,
  );
};
