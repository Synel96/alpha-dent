// Array.prototype.at (ES2022) for older browsers - Safari before 15.4 (iOS
// 15.0-15.3), Chrome before 92 - and the testing tools that still run one
// (e.g. Yellow Lab Tools). Vike's own client runtime calls it, so without it
// such browsers throw "e.at is not a function" and the page isn't hydrated.
if (!("at" in Array.prototype)) {
  Object.defineProperty(Array.prototype, "at", {
    value: function at<T>(this: T[], index: number): T | undefined {
      const offset = Math.trunc(index) || 0;
      const position = offset < 0 ? this.length + offset : offset;
      return position >= 0 && position < this.length ? this[position] : undefined;
    },
    writable: true,
    configurable: true,
  });
}
