
import { Ifile } from './types';

const prefix: string = 'Invariant failed';

// Throw an error if the condition fails
// Strip out error messages for production
// > Not providing an inline default argument for message as the result is smaller
export function invariant(
    condition: any,
    // Can provide a string, or a function that returns a string for cases where
    // the message takes a fair amount of effort to compute
    message?: string | (() => string),
  ): asserts condition {
    if (condition) {
      return;
    }
    // Condition not passed
  
    const provided: string | undefined = typeof message === 'function' ? message() : message;
  
    // Options:
    // 1. message provided: `${prefix}: ${provided}`
    // 2. message not provided: prefix
    const value: string = provided ? `${prefix}: ${provided}` : prefix;
    throw new Error(value);
  }

export function makeCancellablePromise<T>(promise: Promise<T>) {
    let isCancelled = false;
  
    const wrappedPromise: typeof promise = new Promise((resolve, reject) => {
      promise
        .then((value) => !isCancelled && resolve(value))
        .catch((error) => !isCancelled && reject(error));
    });
  
    return {
      promise: wrappedPromise,
      cancel() {
        isCancelled = true;
      },
    };
  }

/**
 * Checks if we're running in a browser environment.
 */
export const isBrowser = typeof document !== 'undefined';

/**
 * Checks whether we're running from a local file system.
 */
export const isLocalFileSystem = isBrowser && window.location.protocol === 'file:';

/**
 * Checks whether a variable is defined.
 *
 * @param {*} variable Variable to check
 */
export function isDefined(variable:any) {
  return typeof variable !== 'undefined';
}

/**
 * Checks whether a variable is defined and not null.
 *
 * @param {*} variable Variable to check
 */
export function isProvided(variable:any) {
  return isDefined(variable) && variable !== null;
}

/**
 * Checks whether a variable provided is a string.
 *
 * @param {*} variable Variable to check
 */
export function isString(variable:string) {
  return typeof variable === 'string';
}



/**
 * Checks whether a variable provided is a Blob.
 *
 * @param {*} variable Variable to check
 */
export function isBlob(variable: Ifile) {
  invariant(isBrowser, 'isBlob can only be used in a browser environment');

  return variable instanceof Blob;
}

/**
 * Checks whether a string provided is a data URI.
 *
 * @param {string} str String to check
 */

export function isDataURI(str: string) {
  return isString(str) && /^data:/.test(str as string);
}
export function blobToUri(blob:Blob){
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = () => {
          resolve(reader.result as string);
        };
    
        reader.onerror = (event) => {
          if (!event.target) {
            return reject(new Error('Error while reading a file.'));
          }
    
          const { error } = event.target;
    
          switch (error?.code) {
            case error?.NOT_FOUND_ERR:
              return reject(new Error('Error while reading a file: File not found.'));
            case error?.SECURITY_ERR:
              return reject(new Error('Error while reading a file: Security error.'));
            case error?.ABORT_ERR:
              return reject(new Error('Error while reading a file: Aborted.'));
            default:
              return reject(new Error('Error while reading a file.'));
          }
        };
    
        reader.readAsDataURL(blob);
      });
}
function arrayBufferToBase64( buffer :ArrayBuffer):string {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
    console.log('rrr', binary)
	return window.btoa( binary );
}
function base64ToArrayBuffer(base64: string) : ArrayBuffer {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
export function arrayBufferToUri(buffer:ArrayBuffer, type:string){
   return `data:${type};base64,${arrayBufferToBase64(buffer)}`
} 
export function dataURItoByteString(dataURI: string) {
  invariant(isDataURI(dataURI), 'Invalid data URI.');

  const [headersString, dataString] = dataURI.split(',');
  const headers = headersString.split(';');

  if (headers.indexOf('base64') !== -1) {
    return atob(dataString);
  }

  return unescape(dataString);
}

export function getDevicePixelRatio() {
  return (isBrowser && window.devicePixelRatio) || 1;
}

const allowFileAccessFromFilesTip =
  'On Chromium based browsers, you can use --allow-file-access-from-files flag for debugging purposes.';

export function cancelRunningTask(runningTask: {cancel: ()=>void}) {
  if (runningTask && runningTask.cancel) runningTask.cancel();
}

export function isCancelException(error: {name:string}) {
  return error.name === 'RenderingCancelledException';
}

export function loadFromFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (event) => {
      if (!event.target) {
        return reject(new Error('Error while reading a file.'));
      }

      const { error } = event.target;

      switch (error?.code) {
        case error?.NOT_FOUND_ERR:
          return reject(new Error('Error while reading a file: File not found.'));
        case error?.SECURITY_ERR:
          return reject(new Error('Error while reading a file: Security error.'));
        case error?.ABORT_ERR:
          return reject(new Error('Error while reading a file: Aborted.'));
        default:
          return reject(new Error('Error while reading a file.'));
      }
    };

    reader.readAsArrayBuffer(file);
  });
}