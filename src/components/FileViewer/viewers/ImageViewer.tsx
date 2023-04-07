import React, { useEffect, useState } from "react";
import { sourceType } from "../types";

export interface viewerProps {
  source: sourceType;
}

function ImageViewer({ source }: viewerProps) {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    Promise.resolve(source.uri).then(setSrc);
  }, [source]);
  
  console.log('src', src)
  return (
    <img
      alt=""
      src={src}
      style={{
        boxSizing: "border-box",
        backgroundColor: "rgba(0,0,0,0)",
        height: "100%",
        width: "100%",
        minHeight: 0,
        objectFit: "contain",
        objectPosition: "center",
      }}
    />
  );
}

export default ImageViewer;
