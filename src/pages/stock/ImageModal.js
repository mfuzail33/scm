import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton as MuiIconButton,
    Typography,
    CircularProgress,
    Slide,
} from '@mui/material';
import { ArrowRight2, ArrowLeft2, CloseSquare } from 'iconsax-react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ImageModal = ({ open, images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const handleNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setImageLoading(true);
        }
    };

    const handlePrevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
            setImageLoading(true);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Typography variant="h6">Images</Typography>
                <MuiIconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 16, top: 16 }}
                >
                    <CloseSquare />
                </MuiIconButton>
            </DialogTitle>
            <DialogContent style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {images.length > 0 ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {currentIndex > 0 && (
                            <MuiIconButton
                                onClick={handlePrevImage}
                                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                            >
                                <ArrowLeft2 />
                            </MuiIconButton>
                        )}
                        {imageLoading && (
                            <CircularProgress
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        )}
                        <img
                            src={images[currentIndex]}
                            alt=""
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                            onLoad={() => setImageLoading(false)}
                        />
                        {currentIndex < images.length - 1 && (
                            <MuiIconButton
                                onClick={handleNextImage}
                                style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                            >
                                <ArrowRight2 />
                            </MuiIconButton>
                        )}
                    </div>
                ) : (
                    <Typography>No images available</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;
