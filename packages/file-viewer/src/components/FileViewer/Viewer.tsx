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
import { Ifile, IPlugin } from "../../../../file-viewer-comon";
import clsx from "clsx";
import EmptyViewer from "./viewers/EmptyViewer";
import DefaultViewer from "./viewers/DefaultViewer";
import useSource from "./useSource";

export interface ViewerProps {
  onSourceError: (error: Error | null) => void;
  onSourceSuccess: () => void;
  /**
   * file to display
   */
  file: Ifile | string;
  type?: string;
  className: string;
  plugins: IPlugin[]
}
/**
 * display different type of files
 */
export function Viewer({
  onSourceError: onSourceErrorProps,
  onSourceSuccess: onSourceSuccessProps,
  file,
  type,
  className,
  plugins,
  ...rest
}: ViewerProps) {
  const { source, error } = useSource({
    file,
    type,
    onSourceError: onSourceErrorProps,
    onSourceSuccess: onSourceSuccessProps,
  });

  function renderContrent() {
    console.log("source", source);
    if (!source) return <EmptyViewer />;
    const CurrentViewer = plugins.find((v) => v.match(source));
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
