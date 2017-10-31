declare namespace jest {
  interface Matchers<R> {
    toEqualImmutable(received: Equalable): ({ pass: boolean; message(): string });
  }
}
