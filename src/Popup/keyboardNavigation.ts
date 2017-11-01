import scrollIntoViewIfNeeded = require('scroll-into-view-if-needed');

enum keys {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  h = 'h',
  j = 'j',
  k = 'k',
  l = 'l',
}

const scrollTo = (element: Element) => scrollIntoViewIfNeeded(element, false, {})

const isPureNavigationKey = (event: KeyboardEvent) => (
  event.key === keys.ArrowUp ||
  event.key === keys.ArrowDown
);

const getFocusable = (): HTMLElement[] => Array.from(document.querySelectorAll('[tabindex'))
  .filter((elem: Element): elem is HTMLElement => elem instanceof HTMLElement)
  .filter((elem: HTMLElement) => elem.getAttribute('tabindex') !== '-1');

function moveFocusUp(target: HTMLElement): void {
  let elementBefore: HTMLElement | undefined = void 0;
  for (const other of getFocusable()) {
    if (target.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_PRECEDING) { // tslint:disable-line:no-bitwise
      elementBefore = other;
    } else {
      break;
    }
  }
  if (elementBefore) {
    scrollTo(elementBefore);
    elementBefore.focus();
  }
}

function moveFocusDown(target: HTMLElement): void {
  for (const other of getFocusable()) {
    if (target.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING) { // tslint:disable-line:no-bitwise
      scrollTo(other);
      other.focus();
      break;
    }
  }
}

function open(target: HTMLElement): void {
  if (target.classList.contains('collapsed')) {
    scrollTo(target);
    target.click();
  }
}

function closeOrOut(target: HTMLElement): void {
  // if target is opened, close it
  if (target.classList.contains('opened')) {
    scrollTo(target);
    target.click();
    return;
  }

  // try to find parent collapsible toggle and move focus there
  let item: HTMLElement | null = target;
  while (item) {
    if (item.classList.contains('collapse-container')) {
      const toggle = item.previousSibling;
      if (toggle && toggle instanceof HTMLElement && toggle.getAttribute('role') === 'button') {
        scrollTo(toggle);
        toggle.focus();
      }
      return;
    }
    item = item.parentElement;
  }
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (!(event.target instanceof HTMLElement) ||
    (!isPureNavigationKey(event) && event.target.tagName === 'INPUT')) {
    return;
  }

  switch (event.key) {
    case keys.ArrowDown:
    case keys.j:
      moveFocusDown(event.target);
      break;
    case keys.ArrowUp:
    case keys.k:
      moveFocusUp(event.target);
      break;
    case keys.ArrowLeft:
    case keys.h:
      closeOrOut(event.target);
      break;
    case keys.ArrowRight:
    case keys.l:
      open(event.target);
      break;
    default:
      return;
  }

  event.stopPropagation();
});
