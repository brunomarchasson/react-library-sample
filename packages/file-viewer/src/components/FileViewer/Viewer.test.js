import React, { createRef } from "react";
import { fireEvent, getByTestId, render } from "@testing-library/react";

// import { pdfjs } from './index.test';

import Viewer from "./Viewer";

import {
  makeAsyncCallback,
  loadFile,
  muteConsole,
  restoreConsole,
} from "../../../test-utils";
import path from "path";

const pdfFile = loadFile("./__mocks__/_pdf.pdf");
const pdfFile2 = loadFile("./__mocks__/_pdf2.pdf");

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

describe("Viewer", () => {
  
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

  

  describe("rendering", () => {
    it.skip("applies className to its wrapper when given a string", () => {
      const className = "testClassName";

      const { container } = render(<Viewer className={className} />);

      const wrapper = container.querySelector(".file-viewer__wrapper");

      expect(wrapper.getAttribute('class')).toBe("file-viewer__wrapper "+className);
    });

    it.skip('renders empty element when given nothing', () => {
      const { container } = render(<Viewer />);

      const noData = container.querySelector(".file-viewer__empty");
      console.log(noData)
      expect(noData).toBeInTheDocument();
    });

    it.skip("renders custom no data message when given nothing and noData prop is given", () => {
      const { container } = render(<Viewer noData="Nothing here" />);

      const noData = container.querySelector(".react-pdf__message");

      expect(noData).toBeInTheDocument();
      expect(noData).toHaveTextContent("Nothing here");
    });

    it.skip("renders custom no data message when given nothing and noData prop is given as a function", () => {
      const { container } = render(<Viewer noData={() => "Nothing here"} />);

      const noData = container.querySelector(".react-pdf__message");

      expect(noData).toBeInTheDocument();
      expect(noData).toHaveTextContent("Nothing here");
    });

    it.skip('renders "Loading PDF…" when loading a file', async () => {
      const { container, findByText } = render(<Viewer file={pdfFile.file} />);

      const loading = container.querySelector(".react-pdf__message");

      expect(loading).toBeInTheDocument();
      expect(await findByText("Loading PDF…")).toBeInTheDocument();
    });

    it.skip("renders custom loading message when loading a file and loading prop is given", async () => {
      const { container, findByText } = render(
        <Viewer file={pdfFile.file} loading="Loading" />
      );

      const loading = container.querySelector(".react-pdf__message");

      expect(loading).toBeInTheDocument();
      expect(await findByText("Loading")).toBeInTheDocument();
    });

    it.skip("renders custom loading message when loading a file and loading prop is given as a function", async () => {
      const { container, findByText } = render(
        <Viewer file={pdfFile.file} loading={() => "Loading"} />
      );

      const loading = container.querySelector(".react-pdf__message");

      expect(loading).toBeInTheDocument();
      expect(await findByText("Loading")).toBeInTheDocument();
    });

    it.skip('renders "Failed to load PDF file." when failed to load a document', async () => {
      const { func: onLoadError, promise: onLoadErrorPromise } =
        makeAsyncCallback();
      const failingPdf = "data:application/pdf;base64,abcdef";

      muteConsole();

      const { container, findByText } = render(
        <Viewer file={failingPdf} onLoadError={onLoadError} />
      );

      expect.assertions(2);

      await onLoadErrorPromise;

      await waitForAsync();

      const error = container.querySelector(".react-pdf__message");

      expect(error).toBeInTheDocument();
      expect(await findByText("Failed to load PDF file.")).toBeInTheDocument();

      restoreConsole();
    });

    it.skip("renders custom error message when failed to load a document and error prop is given", async () => {
      const { func: onLoadError, promise: onLoadErrorPromise } =
        makeAsyncCallback();
      const failingPdf = "data:application/pdf;base64,abcdef";

      muteConsole();

      const { container, findByText } = render(
        <Viewer error="Error" file={failingPdf} onLoadError={onLoadError} />
      );

      expect.assertions(2);

      await onLoadErrorPromise;

      await waitForAsync();

      const error = container.querySelector(".react-pdf__message");

      expect(error).toBeInTheDocument();
      expect(await findByText("Error")).toBeInTheDocument();

      restoreConsole();
    });

    it.skip("renders custom error message when failed to load a document and error prop is given as a function", async () => {
      const { func: onLoadError, promise: onLoadErrorPromise } =
        makeAsyncCallback();
      const failingPdf = "data:application/pdf;base64,abcdef";

      muteConsole();

      const { container, findByText } = render(
        <Viewer error="Error" file={failingPdf} onLoadError={onLoadError} />
      );

      expect.assertions(2);

      await onLoadErrorPromise;

      await waitForAsync();

      const error = container.querySelector(".react-pdf__message");

      expect(error).toBeInTheDocument();
      expect(await findByText("Error")).toBeInTheDocument();

      restoreConsole();
    });

    it.skip("passes renderMode prop to its children", async () => {
      const { func: onLoadSuccess, promise: onLoadSuccessPromise } =
        makeAsyncCallback();

      const { container } = render(
        <Viewer
          file={pdfFile.file}
          loading="Loading"
          onLoadSuccess={onLoadSuccess}
          renderMode="svg"
        >
          <Child />
        </Viewer>
      );

      expect.assertions(1);

      await onLoadSuccessPromise;

      const child = getByTestId(container, "child");

      expect(child.dataset.rendermode).toBe("svg");
    });

    it.skip("passes rotate prop to its children", async () => {
      const { func: onLoadSuccess, promise: onLoadSuccessPromise } =
        makeAsyncCallback();

      const { container } = render(
        <Viewer
          file={pdfFile.file}
          loading="Loading"
          onLoadSuccess={onLoadSuccess}
          rotate={90}
        >
          <Child />
        </Viewer>
      );

      expect.assertions(1);

      await onLoadSuccessPromise;

      const child = getByTestId(container, "child");

      expect(child.dataset.rotate).toBe("90");
    });

    it.skip("does not overwrite renderMode prop in its children when given renderMode prop to both Document and its children", async () => {
      const { func: onLoadSuccess, promise: onLoadSuccessPromise } =
        makeAsyncCallback();

      const { container } = render(
        <Viewer
          file={pdfFile.file}
          loading="Loading"
          onLoadSuccess={onLoadSuccess}
          renderMode="svg"
        >
          <Child renderMode="canvas" />
        </Viewer>
      );

      expect.assertions(1);

      await onLoadSuccessPromise;

      const child = getByTestId(container, "child");

      expect(child.dataset.rendermode).toBe("canvas");
    });

    it.skip("does not overwrite rotate prop in its children when given rotate prop to both Document and its children", async () => {
      const { func: onLoadSuccess, promise: onLoadSuccessPromise } =
        makeAsyncCallback();

      const { container } = render(
        <Viewer
          file={pdfFile.file}
          loading="Loading"
          onLoadSuccess={onLoadSuccess}
          rotate={90}
        >
          <Child rotate={180} />
        </Viewer>
      );

      expect.assertions(1);

      await onLoadSuccessPromise;

      const child = getByTestId(container, "child");

      expect(child.dataset.rotate).toBe("180");
    });
  });

  describe("viewer", () => {
    it.skip("calls onItemClick if defined", async () => {
      const { func: onLoadSuccess, promise: onLoadSuccessPromise } =
        makeAsyncCallback();

      const onItemClick = jest.fn();
      const instance = createRef();

      render(
        <Viewer
          file={pdfFile.file}
          onItemClick={onItemClick}
          onLoadSuccess={onLoadSuccess}
          ref={instance}
        />
      );

      expect.assertions(2);

      await onLoadSuccessPromise;

      const dest = [];
      const pageIndex = 5;
      const pageNumber = 6;

      // Simulate clicking on an outline item
      instance.current.viewer.current.scrollPageIntoView({
        dest,
        pageIndex,
        pageNumber,
      });

      expect(onItemClick).toHaveBeenCalledTimes(1);
      expect(onItemClick).toHaveBeenCalledWith({ dest, pageIndex, pageNumber });
    });
  });

  it.skip("calls onClick callback when clicked a page (sample of mouse events family)", () => {
    const onClick = jest.fn();

    const { container } = render(<Viewer onClick={onClick} />);

    const document = container.querySelector(".file-viewer__wrapper");
    fireEvent.click(document);

    expect(onClick).toHaveBeenCalled();
  });

  it.skip("calls onTouchStart callback when touched a page (sample of touch events family)", () => {
    const onTouchStart = jest.fn();

    const { container } = render(<Viewer onTouchStart={onTouchStart} />);

    const document = container.querySelector(".file-viewer__wrapper");
    fireEvent.touchStart(document);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
