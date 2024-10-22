import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    Modal,
    OutlinedInput,
    Stack,
    Typography,
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { enqueueSnackbar } from 'notistack';
import { updateVendor } from 'store/reducers/vendors';

const UpdateVendorModal = ({ open, onClose, vendor, vendors, vendorId }) => {
    const [values, setValues] = useState({
        name: '',
        contactInfo: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (vendor) {
            setValues({
                name: vendor.name || '',
                contactInfo: vendor.contactInfo || '',
            });
        }
    }, [vendor]);

    const handleClose = () => {
        setIsSubmitting(false);
        onClose();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required('Vendor name is required'),
            });
            await schema.validate(values, { abortEarly: false });
            const payload = {
                name: values.name,
                contactInfo: values.contactInfo,
            };
            await updateVendor(vendorId, payload)
            vendors();
            enqueueSnackbar('Vendor updated successfully.', {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'success'
            });
            setValues({
                name: '',
                contactInfo: '',
            });
            setIsSubmitting(false);
            handleClose();
        } catch (err) {
            console.error(err);
            if (err.inner) {
                const validationErrors = {};
                err.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Validation error:', err.message);
            }
            enqueueSnackbar('Error updating vendor', { variant: 'error' });
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard title={<Typography variant="h3">Update Vendor</Typography>} sx={{ width: '500px' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Vendor Name*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.name)}
                                            id="name"
                                            type="text"
                                            value={values.name}
                                            name="name"
                                            onChange={handleInputChange}
                                            placeholder="Enter Vendor Name"
                                        />
                                        {errors.name && (
                                            <FormHelperText error id="helper-text-name">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="contactInfo">Phone Number*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            id="contactInfo"
                                            type="number"
                                            value={values.contactInfo}
                                            name="contactInfo"
                                            onChange={handleInputChange}
                                            placeholder="Enter Phone Number"
                                            multiline
                                            rows={4}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleClose}>Close</Button>
                                <AnimateButton>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Vendor'}
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                    </Box>
                </MainCard>
            </Box>
        </Modal>
    );
};

export default UpdateVendorModal;
