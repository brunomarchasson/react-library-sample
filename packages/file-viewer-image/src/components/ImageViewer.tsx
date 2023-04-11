import React, { useEffect, useState } from "react";
import { Isource } from "@file-viewer/comon";

export interface ImageViewerProps {
  source: Isource;
}

export function ImageViewer({ source }: ImageViewerProps) {
  console.log('rrr')
  const [src, setSrc] = useState<string>();
console.log(source)
  useEffect(() => {
    Promise.resolve(source?.uri).then(setSrc);
  }, [source]);
  
  console.log('src', source)
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
