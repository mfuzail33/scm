import React, { useState, useEffect } from 'react';
import {
    Box, Button, FormHelperText, Grid, InputLabel, Modal,
    OutlinedInput, Stack, Typography, CardMedia, IconButton,
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { updateProduct, postImg } from 'store/reducers/products';
import { enqueueSnackbar } from 'notistack';
import { Trash } from 'iconsax-react';
import * as Yup from 'yup';

const UpdateProductModal = ({ open, onClose, productId, product, products }) => {
    const [values, setValues] = useState({
        title: '',
        desc: '',
        price: '',
        quantity: '',
        lowQuantityThreshold: '',
        size: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (product) {
            populateFormWithOldData();
        }
    }, [product]);

    const populateFormWithOldData = () => {
        setValues({
            title: product?.title || '',
            desc: product?.desc || '',
            price: product?.price || '',
            quantity: product?.quantity || '',
            lowQuantityThreshold: product?.lowQuantityThreshold || '',
            size: product?.size && product.size !== 'N/A' ? product.size : '',
        });
        setFiles(product?.images || []);
    };

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

    const handleUploadImages = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const schema = Yup.object().shape({
                title: Yup.string().required('Title is required'),
                desc: Yup.string().required('Description is required'),
                price: Yup.string().required('Price is required'),
                quantity: Yup.string().required('Quantity is required'),
                lowQuantityThreshold: Yup.string().required('lowQuantityThreshold is required'),
            });
            await schema.validate(values, { abortEarly: false });

            const imageUrls = [];
            for (const file of files) {
                if (file instanceof File) {
                    const imageUrl = await postImg(file);
                    imageUrls.push(imageUrl);
                } else {
                    imageUrls.push(file);
                }
            }

            const payload = {
                title: values.title,
                desc: values.desc,
                images: imageUrls,
                price: values.price,
                quantity: values.quantity,
                lowQuantityThreshold: values.lowQuantityThreshold,
                size: values.size || 'N/A'
            };

            await updateProduct(productId, payload);
            products();
            enqueueSnackbar(`Product updated successfully.`, {
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                variant: 'success'
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
            }
            enqueueSnackbar('Error updating product', { variant: 'error' });
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard
                    title={<Typography variant="h3">Update Product</Typography>}
                    sx={{
                        width: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
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
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="size">Size*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            id="size"
                                            type="text"
                                            value={values.size}
                                            name="size"
                                            onChange={handleInputChange}
                                            placeholder="Product Size"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="price">Price*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.price)}
                                            id="price"
                                            value={values.price}
                                            name="price"
                                            onChange={handleInputChange}
                                            placeholder="Product Price"
                                            type="number"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="quantity">Quantity*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.quantity)}
                                            id="quantity"
                                            value={values.quantity}
                                            name="quantity"
                                            onChange={handleInputChange}
                                            placeholder="Product Quantity"
                                            type="number"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="lowQuantityThreshold">Low Quantity Threshold*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(errors.lowQuantityThreshold)}
                                            id="lowQuantityThreshold"
                                            value={values.lowQuantityThreshold}
                                            name="lowQuantityThreshold"
                                            onChange={handleInputChange}
                                            placeholder="Product Low Quantity Threshold"
                                            type="number"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={0.5}>
                                        <InputLabel htmlFor="doc">Product Images*</InputLabel>
                                        <Button variant="outlined" fullWidth component="label">
                                            Upload Images
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                onChange={handleUploadImages}
                                            />
                                        </Button>
                                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                            {files.map((file, index) => (
                                                <Grid item key={index} xs={6}>
                                                    <Box display="flex" flexDirection="column" alignItems="center">
                                                        <CardMedia
                                                            component="img"
                                                            src={file instanceof File ? URL.createObjectURL(file) : file}
                                                            sx={{ height: 200, marginTop: 1 }}
                                                        />
                                                        <IconButton
                                                            onClick={() => handleRemoveFile(index)}
                                                            color="secondary"
                                                        >
                                                            <Trash />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Stack>
                                </Grid>
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

export default UpdateProductModal;
