import React, { useCallback, useEffect, useState } from "react";
import { Ifile, fileType, sourceType } from "./types";
import {
  arrayBufferToUri,
  blobToUri,
  cancelRunningTask,
  dataURItoByteString,
  fileToUri,
  invariant,
  isBlob,
  isBrowser,
  isDataURI,
  loadFromFile,
  makeCancellablePromise,
} from "./utils";
import { isArrayBuffer } from "./utils/isArrayBuffer";



export interface useSourceProps {
  onSourceError?: (error: Error | null) => void;
  onSourceSuccess?: () => void;
  file?: fileType;
  type?: string;
}

export default function useSource({
  file,
  type,
  onSourceError: onSourceErrorProps,
  onSourceSuccess: onSourceSuccessProps,
}: useSourceProps = {}): {
  source: sourceType | null | undefined;
  error: Error | null;
} {
  const [source, setSource] = useState<sourceType | null | undefined>(undefined);
  const [sourceError, setSourceError] = useState<Error | null>(null);

  /**
   * Called when a document source is resolved correctly
   */
  function onSourceSuccess() {
    if (onSourceSuccessProps) {
      onSourceSuccessProps();
    }
  }

  /**
   * Called when a document source failed to be resolved correctly
   */
  function onSourceError() {
    if (onSourceErrorProps) {
      onSourceErrorProps(sourceError);
    }
  }

  function resetSource() {
    setSource(undefined);
    setSourceError(null);
  }

  useEffect(resetSource, [file]);

  

  const findDocumentSource = useCallback(async (): Promise<sourceType | null> => {
    if (!file) {
      return null;
    }

    const getType = ():string => {
      if(type) return type 
      if((file as Ifile)?.type) return (file as Ifile)?.type ?? '' 
      if(typeof file === "string" && isDataURI(file as string)){
        return file.substring(file.indexOf(":")+1, file.indexOf(";"))
      }
      return ''
    };
    const currentType = getType()
    // File is a string
    if (typeof file === "string") {
      console.log("string");

      return { 
        type: currentType,
        uri: file as string,
        get data(){ 
          if(!isDataURI(file)) return null;
          return dataURItoByteString(file)
        }
      };
    }

    // File is an ArrayBuffer
    if (isArrayBuffer(file)) {
      console.log("arrayBuffer");
      return { 
        type: currentType,
        get uri(){return arrayBufferToUri(file as ArrayBuffer,currentType)},
        data: file
      };
    }

    /**
     * The cases below are browser-only.
     * If you're running on a non-browser environment, these cases will be of no use.
     */
    if (isBrowser) {
      // File is a Blob
      if (isBlob(file)) {
        console.log("blob");
        return { 
          type: currentType,
          get uri(){return blobToUri(file as File)},
          get data(){return loadFromFile(file as Blob)}
        };
      }
    }
    // At this point, file must be an object
    invariant(
      typeof file === "object",
      "Invalid parameter in file, need either Uint8Array, string or a parameter object"
    );

    invariant(
      "data" in file || "range" in file || "url" in file,
      "Invalid parameter object: need either .data, .range or .url"
    );

    // File .url is a string
    if ("url" in file && typeof file.url === "string") {
      const { url, ...otherParams } = file;
      return { 
        type: currentType,
        uri: url,
        get data(){ 
          if(!isDataURI(url)) return null;
          return dataURItoByteString(url)
        },
        ...otherParams
      };
    }

    return {type: currentType, ...file};
  }, [file]);

  useEffect(() => {
    const cancellable = makeCancellablePromise(findDocumentSource());

    cancellable.promise.then(setSource).catch((error) => {
      setSource(null);
      setSourceError(error);
    });

    return () => {
      cancelRunningTask(cancellable);
    };
  }, [findDocumentSource]);

  useEffect(
    () => {
      if (typeof source === "undefined") {
        return;
      }

      if (source || source === null) {
        onSourceSuccess();
      } else {
        onSourceError();
      }
    },
    // Ommitted callbacks so they are not called every time they change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source]
  );

  return { source, error: sourceError };
}
