import fs from 'node:fs';

export function makeAsyncCallback(callbackValue) {
  let promiseResolve;
  const promise = new Promise((resolve) => {
    promiseResolve = resolve;
  });
  const func = jest.fn(
    callbackValue
      ? () => promiseResolve(callbackValue)
      : (...args) => promiseResolve(args.length === 1 ? args[0] : args),
  );

  return { promise, func };
}

export function loadPDF(path) {
  const raw = fs.readFileSync(path);
  const arrayBuffer = raw.buffer;

  return {
    raw,
    arrayBuffer,
    get blob() {
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    },
    get data() {
      return new Uint8Array(raw);
    },
    get dataURI() {
      return `data:application/pdf;base64,${raw.toString('base64')}`;
    },
    get file() {
      return new File([arrayBuffer], 'test.pdf', { type: 'application/pdf' });
    },
  };
}

export function muteConsole() {
  jest.spyOn(global.console, 'log').mockImplementation(() => {
    // Intentionally empty
  });
  jest.spyOn(global.console, 'error').mockImplementation(() => {
    // Intentionally empty
  });
  jest.spyOn(global.console, 'warn').mockImplementation(() => {
    // Intentionally empty
  });
}

export function restoreConsole() {
  jest.mocked(global.console.log).mockRestore();
  jest.mocked(global.console.error).mockRestore();
  jest.mocked(global.console.warn).mockRestore();
}