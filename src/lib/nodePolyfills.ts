// Expo Router's web "server" output renders the route tree once in Node (no
// DOM) to produce the initial HTML. Some UI libraries (gesture-handler,
// reanimated, used internally by the tab navigator's animations) call
// requestAnimationFrame during that render/mount pass, which doesn't exist in
// Node and otherwise crashes the export/server with
// "ReferenceError: requestAnimationFrame is not defined". This must be
// imported before anything else in app/_layout.tsx.
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  const g = globalThis as unknown as {
    requestAnimationFrame: (cb: (time: number) => void) => ReturnType<typeof setTimeout>;
    cancelAnimationFrame: (id: ReturnType<typeof setTimeout>) => void;
  };
  g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
  g.cancelAnimationFrame = (id) => clearTimeout(id);
}
