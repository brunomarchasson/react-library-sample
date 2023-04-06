
/**
 * Checks whether a variable provided is an ArrayBuffer.
 *
 * @param {*} variable Variable to check
 */
export function isArrayBuffer(variable:any) {
    console.log(variable, typeof variable ,variable instanceof ArrayBuffer,variable instanceof Uint8Array)
  return variable instanceof ArrayBuffer;
}