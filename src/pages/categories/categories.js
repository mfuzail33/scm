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
import { More, Eye, Edit, Trash } from 'iconsax-react';
import MUIDataTable from 'mui-datatables';
import CreateCategoryModal from './CreateCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';
import { getAllCategories } from 'store/reducers/categories';
import { useNavigate } from 'react-router';

const Categories = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching Categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, category) => {
        setAnchorEl(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setCategoryId(selectedCategory._id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleUpdate = () => {
        setCategoryId(selectedCategory._id)
        setOpenUpdateModal(true);
        handleMenuClose();
    };

    const handleviewProducts = () => {
        navigate(`/productsByCategory/${selectedCategory.title}/${selectedCategory._id}`)
        handleMenuClose();
    };

    const columns = [
        {
            name: 'title',
            label: 'Title',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const category = categories[dataIndex];

                    const handleKeyPress = (event) => {
                        if (event.key === 'Enter') {
                            navigate(`/productsByCategory/${category.title}/${category._id}`);
                        }
                    };

                    return (
                        <div
                            role="button"
                            tabIndex="0"
                            onClick={() => navigate(`/productsByCategory/${category.title}/${category._id}`)}
                            onKeyDown={handleKeyPress}
                            style={{ cursor: 'pointer', fontWeight: 500 }}
                        >
                            {category.title}
                        </div>
                    );
                },
            },
        },
        {
            name: 'description',
            label: 'Description',
            options: {
                filterType: 'textField',
            },
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    const category = categories[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, category)}>
                                <More />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleviewProducts}><Eye size="20"/>&nbsp;&nbsp;View Products</MenuItem>
                                <MenuItem onClick={handleUpdate}><Edit size="20"/>&nbsp;&nbsp;Update</MenuItem>
                                <MenuItem onClick={handleDelete} sx={{ color: 'red' }}><Trash size="20"/>&nbsp;&nbsp;Delete</MenuItem>
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
                    <Typography variant="h3">All Categories</Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                        Create New Category
                    </Button>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title=""
                    data={categories}
                    columns={columns}
                    options={options}
                />
            )}
            <CreateCategoryModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                categories={fetchCategories}
            />
            <DeleteCategoryModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                categoryId={categoryId}
                categories={fetchCategories}
            />
            <UpdateCategoryModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                category={selectedCategory}
                categories={fetchCategories}
                categoryId={categoryId}
            />
        </>
    );
};

export default Categories;