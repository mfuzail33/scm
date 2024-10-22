import React, { useEffect, useState } from 'react';
import {
    Box, Button, FormHelperText, Grid, InputLabel, Modal,
    OutlinedInput, Stack, Typography, CardMedia, IconButton, MenuItem, Select, CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { postImg } from 'store/reducers/products';
import { createStockOut } from 'store/reducers/stocks';
import { enqueueSnackbar } from 'notistack';
import { Trash } from 'iconsax-react';
import * as Yup from 'yup';
import { getAllProducts } from 'store/reducers/products';
import { getAllVendors } from 'store/reducers/vendors';

const CreateStockOutModal = ({ open, onClose, reloadLogs }) => {
    const [values, setValues] = useState({
        productId: '',
        vendorId: '',
        warehouse: '',
        quantity: '',
        senderName: '',
        remarks:'',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        if (open) {
            fetchProducts();
            fetchVendors();
        }
    }, [open]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getAllProducts();
            setProducts(response);
        } catch (error) {
            console.error('Error fetching products:', error);
            enqueueSnackbar('Error fetching products, Please try again.', { variant: 'error' });
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await getAllVendors();
            setVendors(response);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            enqueueSnackbar('Error fetching vendors, Please try again.', { variant: 'error' });
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsSubmitting(false);
        onClose();
        setValues({
            productId: '',
            vendorId: '',
            warehouse: '',
            quantity: '',
            senderName: '',
            remarks:'',
        });
        setFiles([]);
        setErrors({});
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
                productId: Yup.string().required('Product is required'),
                vendorId: Yup.string().required('Vendor is required'),
                warehouse: Yup.string().required('Warehouse is required'),
                quantity: Yup.number().required('Quantity is required'),
                senderName: Yup.string().required('Sender Name is required'),
            });
            await schema.validate(values, { abortEarly: false });

            const imageUrls = [];
            for (const file of files) {
                const imageUrl = await postImg(file);
                imageUrls.push(imageUrl);
            }

            const payload = {
                productId: values.productId,
                vendorId: values.vendorId,
                warehouse: values.warehouse,
                quantity: values.quantity,
                remarks: values.remarks,
                senderName: values.senderName,
                images: imageUrls,
            };
            await createStockOut(payload);
            reloadLogs();
            const selectedProduct = products.find(product => product._id === values.productId);
            enqueueSnackbar(`${values.quantity} ${selectedProduct.title}s added successfully.`, {
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
            }
            enqueueSnackbar('Error creating Stock In', { variant: 'error' });
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard
                    title={<Typography variant="h3">Add New Stock</Typography>}
                    sx={{
                        width: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    {loading ? (
                        <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
                    ) : (
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={0.5}>
                                            <InputLabel htmlFor="productId">Product*</InputLabel>
                                            <Select
                                                fullWidth
                                                error={Boolean(errors.productId)}
                                                id="productId"
                                                value={values.productId}
                                                name="productId"
                                                onChange={handleInputChange}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <em>Select Product</em>;
                                                    }
                                                    const selectedProduct = products.find((product) => product._id === selected);
                                                    return selectedProduct ? `${selectedProduct.title} ${selectedProduct.size ? `(${selectedProduct.size})` : ''}` : '';
                                                }}
                                            >
                                                {products.map((product) => (
                                                    <MenuItem key={product._id} value={product._id}>
                                                        {product.title} {product.size && `(${product.size})`}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.productId && (
                                                <FormHelperText error id="helper-text-product">
                                                    {errors.productId}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={0.5}>
                                            <InputLabel htmlFor="vendorId">Vendor*</InputLabel>
                                            <Select
                                                fullWidth
                                                error={Boolean(errors.vendorId)}
                                                id="vendorId"
                                                value={values.vendorId}
                                                name="vendorId"
                                                onChange={handleInputChange}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <em>Select Vendor</em>;
                                                    }
                                                    const selectedVendor = vendors.find((vendor) => vendor._id === selected);
                                                    return selectedVendor ? selectedVendor.name : '';
                                                }}
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select Vendor</em>
                                                </MenuItem>
                                                {vendors.map((vendor) => (
                                                    <MenuItem key={vendor._id} value={vendor._id}>
                                                        {vendor.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                            {errors.vendorId && (
                                                <FormHelperText error id="helper-text-vendor">
                                                    {errors.vendorId}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={0.5}>
                                            <InputLabel htmlFor="warehouse">Warehouse*</InputLabel>
                                            <Select
                                                fullWidth
                                                error={Boolean(errors.warehouse)}
                                                id="warehouse"
                                                value={values.warehouse}
                                                name="warehouse"
                                                onChange={handleInputChange}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <em>Select Warehouse</em>;
                                                    }
                                                    return selected;
                                                }}
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select Warehouse</em>
                                                </MenuItem>
                                                <MenuItem value="All">All</MenuItem>
                                                <MenuItem value="Warehouse 1">Warehouse 1</MenuItem>
                                                <MenuItem value="Warehouse 2">Warehouse 2</MenuItem>
                                                <MenuItem value="Warehouse 3">Warehouse 3</MenuItem>
                                            </Select>
                                            {errors.warehouse && (
                                                <FormHelperText error id="helper-text-warehouse">
                                                    {errors.warehouse}
                                                </FormHelperText>
                                            )}
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
                                                placeholder="Enter Quantity"
                                                type="number"
                                            />
                                            {errors.quantity && (
                                                <FormHelperText error id="helper-text-quantity">
                                                    {errors.quantity}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>                                   
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <InputLabel htmlFor="senderName">Sender Name*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(errors.senderName)}
                                                id="senderName"
                                                value={values.senderName}
                                                name="senderName"
                                                onChange={handleInputChange}
                                                placeholder="Enter Sender Name"
                                                type="text"
                                            />
                                            {errors.senderName && (
                                                <FormHelperText error id="helper-text-senderName">
                                                    {errors.senderName}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={0.5}>
                                            <InputLabel htmlFor="remarks">Remarks*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                id="remarks"
                                                value={values.remarks}
                                                name="remarks"
                                                onChange={handleInputChange}
                                                placeholder="Enter remarks..."
                                                type="text"
                                                multiline
                                                rows={3}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={0.5}>
                                            <InputLabel htmlFor="images">Upload Images</InputLabel>
                                            <OutlinedInput
                                                type="file"
                                                id="images"
                                                multiple
                                                onChange={handleUploadImages}
                                                inputProps={{ capture: "environment" }}
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={1} mt={2}>
                                            {files.map((file, index) => (
                                                <Box key={index} position="relative">
                                                    <CardMedia
                                                        component="img"
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Uploaded ${file.name}`}
                                                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleRemoveFile(index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            color: 'red',
                                                        }}
                                                    >
                                                        <Trash size={20} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                                    <AnimateButton>
                                        <Button
                                            variant="outlined"
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                    </AnimateButton>
                                    <AnimateButton>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Removing...' : 'Remove Stock'}
                                        </Button>
                                    </AnimateButton>
                                </Stack>
                            </form>
                        </Box>
                    )}
                </MainCard>
            </Box>
        </Modal>
    );
};

export default CreateStockOutModal;
