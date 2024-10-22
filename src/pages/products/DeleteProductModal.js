import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MainCard from 'components/MainCard';
import { enqueueSnackbar } from 'notistack';
import { deleteProduct } from 'store/reducers/products';

const DeleteProductModal = ({ open, onClose, productId, products }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            await deleteProduct(productId);
            products();
            onClose();
            enqueueSnackbar(`Product deleted successfully.`, {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'success'
            });
        } catch {
            console.error('Error deleting product:');
            enqueueSnackbar(`Failed to delete product`, {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'error'
            });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard title={<Typography variant="h3">Delete Product</Typography>} sx={{ width: '500px' }}>
                    <Typography>Are you sure you want to delete this product?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', columnGap: '10px' }} mt={2}>
                        <LoadingButton onClick={onClose}>Close</LoadingButton>
                        <LoadingButton
                            onClick={handleConfirmDelete}
                            loading={loading}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </LoadingButton>
                    </Box>
                </MainCard>
            </Box>
        </Modal>
    );
};

export default DeleteProductModal;
