import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MainCard from 'components/MainCard';
import { enqueueSnackbar } from 'notistack';
import { deleteHospital } from 'store/reducers/apis';

const DeleteHealthModal = ({ open, onClose, healthId, healths }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            await deleteHospital(healthId);
            healths();
            onClose();
            enqueueSnackbar(`Hospital deleted successfully.`, {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'success'
            });
        } catch {
            console.error('Error deleting hospital:');
            enqueueSnackbar(`Failed to delete hospital`, {
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
                <MainCard title={<Typography variant="h3">Delete Hospital</Typography>} sx={{ width: '500px' }}>
                    <Typography>Are you sure you want to delete this hospital?</Typography>
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

export default DeleteHealthModal;
