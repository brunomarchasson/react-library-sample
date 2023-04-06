import React, { createRef } from "react";
import { renderHook,fireEvent, getByTestId, render, act, waitFor } from "@testing-library/react";
// import {  } from '@testing-library/react-hooks'
import useSource from "./useSource";

import {
  makeAsyncCallback,
  loadPDF,
  muteConsole,
  restoreConsole,
} from "../../../test-utils";
import path from "path";
import { waitFor } from "@storybook/testing-library";

const pdfFile = loadPDF("./__mocks__/_pdf.pdf");
const pdfFile2 = loadPDF("./__mocks__/_pdf2.pdf");

const OK = Symbol("OK");

// eslint-disable-next-line react/prop-types
function ChildInternal({ renderMode, rotate }) {
  return (
    <div
      data-testid="child"
      data-rendermode={renderMode}
      data-rotate={rotate}
    />
  );
}

function Child(props) {
  return (
    <DocumentContext.Consumer>
      {(context) => <ChildInternal {...context} {...props} />}
    </DocumentContext.Consumer>
  );
}

async function waitForAsync() {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe("useSource", () => {
  
  // Object with basic loaded PDF information that shall match after successful loading
  // const desiredLoadedPdf = {};
  // const desiredLoadedPdf2 = {};

  beforeAll(async () => {
    // const pdf = await pdfjs.getDocument({ data: pdfFile.arrayBuffer }).promise;
    // desiredLoadedPdf._pdfInfo = pdf._pdfInfo;

    // const pdf2 = await pdfjs.getDocument({ data: pdfFile2.arrayBuffer })
    //   .promise;
    // desiredLoadedPdf2._pdfInfo = pdf2._pdfInfo;
  });

  
    it("should return the initial values for source and error", async () => {
      const { result, waitForNextUpdate  } = renderHook(() => useSource());
      // const { source, error } = result.current;
      
      // expect(source).toBe(undefined);
      // await waitForNextUpdate()
      await act(async () => {
      await waitFor(() => {
        const { source, error } = result.current;
        
        expect(error).toBe(null);
      })
      })
    });

    it.skip("loads a file and calls onSourceSuccess callbacks via data URI properly", async () => {
      const { func: onSourceSuccess, promise: onSourceSuccessPromise } =
        makeAsyncCallback(OK);
      
      render(
        <Viewer
          file={pdfFile.dataURI}
          onSourceSuccess={onSourceSuccess}
        />
      );

      
      expect.assertions(1);
      await expect(onSourceSuccessPromise).resolves.toBe(OK);
      
    });

    it.skip("loads a file and calls onSourceSuccess callbacks via data URI properly (param object)", async () => {
      const { func: onSourceSuccess, promise: onSourceSuccessPromise } =
        makeAsyncCallback(OK);
     
      render(
        <Viewer
          file={{ url: pdfFile.dataURI }}
          onSourceSuccess={onSourceSuccess}
        />
      );

      expect.assertions(1);

      await expect(onSourceSuccessPromise).resolves.toBe(OK);
      
    });

    // FIXME: In Jest, it used to be worked around as described in https://github.com/facebook/jest/issues/7780
    it.skip("loads a file and calls onSourceSuccess callbacks via ArrayBuffer properly", async () => {
      const { func: onSourceSuccess, promise: onSourceSuccessPromise } =
        makeAsyncCallback(OK);
      
      render(
        <Viewer
          file={pdfFile.arrayBuffer}
          onSourceSuccess={onSourceSuccess}
        />
      );

      expect.assertions(1);

      await expect(onSourceSuccessPromise).resolves.toBe(OK);
      
    });

    it.skip("loads a file and calls onSourceSuccess  callbacks via Blob properly", async () => {
      const { func: onSourceSuccess, promise: onSourceSuccessPromise } =
        makeAsyncCallback(OK);
     
      render(
        <Viewer
          file={pdfFile.blob}
          onSourceSuccess={onSourceSuccess}
        />
      );

      expect.assertions(1);

      await expect(onSourceSuccessPromise).resolves.toBe(OK);
     
    });

    it.skip("loads a file and calls onSourceSuccess callbacks via File properly", async () => {
      const { func: onSourceSuccess, promise: onSourceSuccessPromise } =
        makeAsyncCallback(OK);

      render(
        <Viewer
          file={pdfFile.file}
          onSourceSuccess={onSourceSuccess}
        />
      );

      expect.assertions(1);

      await expect(onSourceSuccessPromise).resolves.toBe(OK);
    });

    it.skip("fails to load a file and calls onSourceError given invalid file source", async () => {
      const { func: onSourceError, promise: onSourceErrorPromise } =
        makeAsyncCallback();

      muteConsole();

      render(<Viewer file={() => null} onSourceError={onSourceError} />);

      expect.assertions(1);

      const error = await onSourceErrorPromise;

      expect(error).toMatchObject(expect.any(Error));

      restoreConsole();
    });

    it.skip("replaces a file properly", async () => {
      const { func: onSourceSuccess, promise: onSourceSuccessPromise } =
        makeAsyncCallback(OK);
    
      const { rerender } = render(
        <Viewer
          file={pdfFile.file}
         onSourceSuccess={onSourceSuccess}
        />
      );

      expect.assertions(2);

      await expect(onSourceSuccessPromise).resolves.toBe(OK);

      const { func: onSourceSuccess2, promise: onSourceSuccessPromise2 } =
        makeAsyncCallback(OK);
      
      rerender(
        <Viewer
          file={pdfFile2.file}
          onSourceSuccess={onSourceSuccess2}
        />
      );

      await expect(onSourceSuccessPromise2).resolves.toBe(OK);
    });
  });
