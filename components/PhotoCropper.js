import React, {
    useRef
} from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const PhotoCropper = ({
    imageType,
    setImage,
    imagePreview
}) => {
    const cropper = useRef(null);
    const cropImage = (imageType) => {
        if (cropper.current && cropper.current.cropper &&
            typeof cropper.current.cropper.getCroppedCanvas === 'undefined') {
            return;
        }
        cropper &&
            cropper.current &&
            cropper.current.cropper.getCroppedCanvas().toBlob((blob) => {
                setImage(blob);
            }, imageType);
    };
    return <Cropper
        ref={cropper}
        src={imagePreview}
        style={{
            height: 200,
            width: '100%'
        }}
        // Cropper.js options
        aspectRatio={1 / 1}
        preview={false}
        guides={false}
        viewMode={1}
        dragMode={'move'}
        scalable={true}
        cropBoxMovable={true}
        cropBoxResizable={true}
        crop={() => cropImage(imageType)}
    />;
};
export default PhotoCropper;