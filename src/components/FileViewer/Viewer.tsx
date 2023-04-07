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
import { Ifile, sourceType } from "./types";
import clsx from "clsx";
import { isArrayBuffer } from "./utils/isArrayBuffer";
import EmptyViewer from "./viewers/EmptyViewer";
import DefaultViewer from "./viewers/DefaultViewer";
import { viewers } from "./viewers";
import useSource from "./useSource";

interface ViewerProps {
  onSourceError: (error: Error | null) => void;
  onSourceSuccess: () => void;
  /**
   * file to display
   */
  file: Ifile | string;
  type?: string;
  className: string;
}
/**
 * display different type of files
 */
function Viewer({
  onSourceError: onSourceErrorProps,
  onSourceSuccess: onSourceSuccessProps,
  file,
  type,
  className,
  ...rest
}: ViewerProps) {
  console.log("file", file, "rest", rest);
  const { source, error } = useSource({
    file,
    type,
    onSourceError: onSourceErrorProps,
    onSourceSuccess: onSourceSuccessProps,
  });

  function renderContrent() {
    console.log("source", source);
    if (!source) return <EmptyViewer />;
    const CurrentViewer = viewers.find((v) => v.match(source));
    if (!CurrentViewer) return <DefaultViewer source={source} />;
    return <CurrentViewer.viewer source={source} />;
  }
  return (
    <div className={clsx("file-viewer__wrapper", className)} {...rest}>
      {renderContrent()}
    </div>
  );
}

export default Viewer;
