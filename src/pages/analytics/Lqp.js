import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { More, Edit, Trash } from 'iconsax-react';
import { getLowQuantityProducts } from 'store/reducers/products';
import MUIDataTable from 'mui-datatables';
import CreateProductModal from 'pages/products/CreateProductModal';
import DeleteProductModal from 'pages/products/DeleteProductModal';
import UpdateProductModal from 'pages/products/UpdateProductModal';

const Lqp = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let response = await getLowQuantityProducts();
            const formattedProducts = response.map(product => ({
                ...product,
                category: product.category ? product.category.title : 'No category',
                categoryDetails: product.category
            }));
            setProducts(formattedProducts);
        } catch (error) {
            console.error('Error fetching Products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setProductId(selectedProduct._id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleUpdate = () => {
        setProductId(selectedProduct._id)
        setOpenUpdateModal(true);
        handleMenuClose();
    };

    const columns = [
        { name: 'title', label: 'Title' },
        {
            name: 'size',
            label: 'Size',
            options: {
                customBodyRender: (value) => {
                    return value ? value : 'N/A';
                }
            }
        },
        {
            name: 'desc',
            label: 'Description',
        },
        {
            name: 'price',
            label: 'Price',
        },
        {
            name: 'quantity',
            label: 'Quantity',
        },
        {
            name: 'lowQuantityThreshold',
            label: 'LQT',
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    const product = products[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, product)}>
                                <More />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleUpdate}><Edit size="20" />&nbsp;&nbsp;Update</MenuItem>
                                <MenuItem onClick={handleDelete} sx={{ color: 'red' }}><Trash size="20" />&nbsp;&nbsp;Delete</MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        },
    ];

    const options = {
        selectableRows: 'none',
    };


    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                <Grid item>
                    <Typography variant="h3">Low Quantity Products</Typography>
                </Grid>
                <Grid item>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                                Create New Product
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title=""
                    data={products}
                    columns={columns}
                    options={options}
                />
            )}
            <CreateProductModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                products={fetchProducts}
            />
            <DeleteProductModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                productId={productId}
                products={fetchProducts}
            />
            <UpdateProductModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                product={selectedProduct}
                products={fetchProducts}
                productId={productId}
            />
        </>
    );
};

export default Lqp;
