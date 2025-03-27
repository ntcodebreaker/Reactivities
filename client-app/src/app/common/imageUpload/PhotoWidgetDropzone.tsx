/**
 * snippet taken from react-dropzone documentation.
 * https://react-dropzone.js.org/
 */

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props {
  setFiles: (files: any) => void;
}

function PhotoWidgetDropzone({ setFiles }: Props) {
  const dzStyles = {
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center', // I must cast a string to a type 'center' 
    height: 200
  }

  const dzActive = {
    borderColor: 'green'
  }

  /**
   * useCallback is a hook that will return a memoized version 
   * of the callback that only changes if one of the dependencies 
   * has changed.
   * Helpful to avoid unnecessary re-renders.
   */
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, [setFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  )
}

export default PhotoWidgetDropzone;