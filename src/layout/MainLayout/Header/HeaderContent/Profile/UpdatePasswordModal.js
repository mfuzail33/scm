import React, { useState } from 'react';
import {
    Box, Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, Modal,
    OutlinedInput, Stack, Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { updatePassword } from 'store/reducers/settings';
import { enqueueSnackbar } from 'notistack';
import * as Yup from 'yup';

const UpdatePasswordModal = ({ open, onClose }) => {
    const [values, setValues] = useState({
        newPassword: '',
        currentPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setIsSubmitting(false);
        onClose();
        setValues({
            newPassword: '',
            currentPassword: '',
            showCurrentPassword: false,
            showNewPassword: false,
        });
        setErrors({});
        setError('');
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleToggleVisibility = (field) => {
        setValues({
            ...values,
            [field]: !values[field],
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const schema = Yup.object().shape({
                newPassword: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('New Password is required'),
                currentPassword: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Current Password is required'),
            });
            await schema.validate(values, { abortEarly: false });

            const payload = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            };
            await updatePassword(payload);
            enqueueSnackbar(`Password updated successfully.`, {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'success',
            });
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
                setError(err.message)
            }
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard
                    title={<Typography variant="h3">Update Password</Typography>}
                    sx={{
                        width: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="currentPassword">*Current Password</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.currentPassword)}
                                            id="currentPassword"
                                            type={values.showCurrentPassword ? 'text' : 'password'}
                                            value={values.currentPassword}
                                            name="currentPassword"
                                            onChange={handleInputChange}
                                            placeholder="Enter Current password"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleToggleVisibility('showCurrentPassword')}
                                                    >
                                                        {values.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.currentPassword && (
                                            <FormHelperText error id="helper-text-title">
                                                {errors.currentPassword}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="newPassword">*New Password</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.newPassword)}
                                            id="newPassword"
                                            type={values.showNewPassword ? 'text' : 'password'}
                                            value={values.newPassword}
                                            name="newPassword"
                                            onChange={handleInputChange}
                                            placeholder="Enter new password"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleToggleVisibility('showNewPassword')}
                                                    >
                                                        {values.showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.newPassword && (
                                            <FormHelperText error id="helper-text-title">
                                                {errors.newPassword}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {error && (
                                    <Grid item xs={12}>
                                        <Typography color="error" sx={{ mt: 2 }}>
                                            {error}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={handleClose}>Close</Button>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Update
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

export default UpdatePasswordModal;
