import React from 'react'

function ImageViewer({src}) {
  return (
    <img
      alt=""
      src={ src }
      style={ {
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0,0,0,0)',
        height: '100%',
        width: '100%',
        minHeight: 0,
        objectFit: 'contain',
        objectPosition: 'center',
      } }
    />
  )
}

export default ImageViewer