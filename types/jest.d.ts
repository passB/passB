interface Equalable {
  equals(other: Equalable): boolean;
}

declare namespace jest {
  interface Matchers<R> {
    toEqualImmutable(received: Equalable): ({ pass: boolean; message(): string });
  }
}
