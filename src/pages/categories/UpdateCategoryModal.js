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
import { updateCategory } from 'store/reducers/categories';

const UpdateCategoryModal = ({ open, onClose, category, categories, categoryId }) => {
    const [values, setValues] = useState({
        title: '',
        desc: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setValues({
                title: category.title || '',
                desc: category.description || '',
            });
        }
    }, [category]);

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
                title: Yup.string().required('Title is required'),
                desc: Yup.string().required('Description is required'),
            });
            await schema.validate(values, { abortEarly: false });
            const payload = {
                title: values.title,
                description: values.desc,
            };
            await updateCategory(categoryId, payload)
            categories();
            enqueueSnackbar('Category updated successfully.', {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'success'
            });
            setValues({
                title: '',
                desc: '',
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
            enqueueSnackbar('Error updating category', { variant: 'error' });
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard title={<Typography variant="h3">Update Category</Typography>} sx={{ width: '500px' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="title">Title*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.title)}
                                            id="title"
                                            type="text"
                                            value={values.title}
                                            name="title"
                                            onChange={handleInputChange}
                                            placeholder="Category Title"
                                        />
                                        {errors.title && (
                                            <FormHelperText error id="helper-text-title">
                                                {errors.title}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="clientName">Description*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.desc)}
                                            id="desc"
                                            type="text"
                                            value={values.desc}
                                            name="desc"
                                            onChange={handleInputChange}
                                            placeholder="Category Description"
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
                                        {isSubmitting ? 'Updating...' : 'Update Category'}
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

export default UpdateCategoryModal;
