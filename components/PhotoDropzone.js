import React, {
    useCallback
} from 'react';
import {
    useDropzone
} from 'react-dropzone';
import {Trans, t} from '@lingui/macro';
const PhotoDropzone = ({
    setFiles
}) => {
    //when a file dropped this even get raised
    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [setFiles]);
    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop
    });
    return (
        <div {...getRootProps({className: 'dropzone flex flex-column items-center pa2 br2 bg-dark-gray white pointer'})}>
            <input {...getInputProps()} />
            <span className="flex content-center items-center"><Trans>Drag and drop image here<br />Or<br/>Browse</Trans></span>
        </div>
    );
};
export default PhotoDropzone;