import React, { useState } from 'react';
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
import { createCategory } from 'store/reducers/categories';

const CreateCategoryModal = ({ open, onClose, categories }) => {
    const [values, setValues] = useState({
        title: '',
        desc: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setIsSubmitting(false);
        onClose();
        setValues({
            title: '',
            desc: '',
        });
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
            await createCategory(payload)
            categories();
            enqueueSnackbar(`Category created successfully.`, {
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
            enqueueSnackbar('Error creating category', { variant: 'error' });
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard title={<Typography variant="h3">Add New Category</Typography>} sx={{ width: '500px' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="title">Title*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.title)}
                                            id="title"
                                            type="text"
                                            value={values.title}
                                            name="title"
                                            onChange={handleInputChange}
                                            placeholder="Product Title"
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
                                        <InputLabel htmlFor="desc">Description*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.desc)}
                                            id="desc"
                                            type="text"
                                            value={values.desc}
                                            name="desc"
                                            onChange={handleInputChange}
                                            placeholder="Product Description"
                                            multiline
                                            rows={4}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', columnGap: '10px' }}>
                                        <Button onClick={handleClose}>Close</Button>
                                        <AnimateButton>
                                            <Button
                                                disableElevation
                                                disabled={isSubmitting}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                            >
                                                Create
                                            </Button>
                                        </AnimateButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </MainCard>
            </Box>
        </Modal>
    );
};

export default CreateCategoryModal;
