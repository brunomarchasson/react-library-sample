import { sourceType } from "../types";
import DefaultViewer from "./DefaultViewer";
import ImageViewer from "./ImageViewer";

export const viewers = [
  {
    match: (source: sourceType) =>
      source.type.match(/(^image)(\/)[a-zA-Z0-9_]*/gm),
    viewer: ImageViewer,
  },
];
