import React, { useCallback, useEffect, useState } from "react";
import {
  cancelRunningTask,
  dataURItoByteString,
  invariant,
  isBlob,
  isBrowser,
  isDataURI,
  loadFromFile,
  makeCancellablePromise,
} from "./utils";
import { FileType } from "./types";
import clsx from "clsx";
import { isArrayBuffer } from "./utils/isArrayBuffer";
import EmptyViewer from "./viewers/EmptyViewer";
import DefaultViewer from "./viewers/DefaultViewer";

// export const keyboardEvents = ['onKeyDown', 'onKeyPress', 'onKeyUp'] as const;
// export const mouseEvents = [
//     'onClick',
//     'onContextMenu',
//     'onDoubleClick',
//     'onDrag',
//     'onDragEnd',
//     'onDragEnter',
//     'onDragExit',
//     'onDragLeave',
//     'onDragOver',
//     'onDragStart',
//     'onDrop',
//     'onMouseDown',
//     'onMouseEnter',
//     'onMouseLeave',
//     'onMouseMove',
//     'onMouseOut',
//     'onMouseOver',
//     'onMouseUp',
//   ] as const;
// export const touchEvents = ['onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart'] as const;

export interface ViewerProps {
  onSourceError: (error: Error | undefined) => void;
  onSourceSuccess: () => void;
  onLoadError: (error: Error | undefined) => void;
  onLoadSuccess: () => void;
  file: FileType;
  className: string;
}

function Viewer({
  onSourceError: onSourceErrorProps,
  onSourceSuccess: onSourceSuccessProps,
  file,
  className,
  ...rest
}: ViewerProps) {
  const [source, setSource] = useState<{} | null | undefined>(undefined);
  const [sourceError, setSourceError] = useState(undefined);

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
    setSourceError(undefined);
  }

  useEffect(resetSource, [file]);

  const findDocumentSource = useCallback(async (): Promise<{} | null> => {
    if (!file) {
      return null;
    }

    // File is a string
    if (typeof file === "string") {
      if (isDataURI(file)) {
        const fileByteString = dataURItoByteString(file);
        return { data: fileByteString };
      }

      return { url: file };
    }

    // File is an ArrayBuffer
    console.log('array')
    if (isArrayBuffer(file)) {
        console.log('yes')
      return { data: file };
    }

    /**
     * The cases below are browser-only.
     * If you're running on a non-browser environment, these cases will be of no use.
     */
    if (isBrowser) {
      // File is a Blob
      console.log('blob')
      if (isBlob(file)) {

        const data = await loadFromFile(file);

        return { data };
      }
    }
    console.log(file)
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
      if (isDataURI(file.url)) {
        const { url, ...otherParams } = file;
        const fileByteString = dataURItoByteString(url);
        return { data: fileByteString, ...otherParams };
      }
    }

    return file;
  }, [file]);

  useEffect(() => {
    const cancellable = makeCancellablePromise(findDocumentSource());

    cancellable.promise.then(setSource).catch((error) => {
      setSource(false);
      setSourceError(error);
    });

    return () => {
      cancelRunningTask(cancellable);
    };
  }, [findDocumentSource]);

  useEffect(
    () => {
      if (typeof source === 'undefined') {
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
    [source],
  );

function renderContrent() {
    console.log('source', source)
    if(!source) return <EmptyViewer />

    return <DefaultViewer source = {source} />
}
  return <div className={clsx("file-viewer__wrapper", className)} {...rest}>
    {renderContrent()}
</div>;
}

export default Viewer;
