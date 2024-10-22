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
import MUIDataTable from 'mui-datatables';
import CreateVendorModal from './CreateVendorModal';
import DeleteVendorModal from './DeleteVendorModal';
import UpdateVendorModal from './UpdateVendorModal';
import { getAllVendors } from 'store/reducers/vendors';

const Vendors = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [vendorId, setVendorId] = useState('');
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await getAllVendors();
            setVendors(response);
        } catch (error) {
            console.error('Error fetching Vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, vendor) => {
        setAnchorEl(event.currentTarget);
        setSelectedVendor(vendor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setVendorId(selectedVendor._id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleUpdate = () => {
        setVendorId(selectedVendor._id)
        setOpenUpdateModal(true);
        handleMenuClose();
    };

    const columns = [
        {
            name: 'name',
            label: 'Name of Vendor',
            options: {
                filterType: 'textField',
            },
        },
        {
            name: 'contactInfo',
            label: 'Phone Number',
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
                    const vendor = vendors[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, vendor)}>
                                <More />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
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
                    <Typography variant="h3">All Vendors</Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                        Create New Vendor
                    </Button>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title=""
                    data={vendors}
                    columns={columns}
                    options={options}
                />
            )}
            <CreateVendorModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                vendors={fetchVendors}
            />
            <DeleteVendorModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                vendorId={vendorId}
                vendors={fetchVendors}
            />
            <UpdateVendorModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                vendor={selectedVendor}
                vendors={fetchVendors}
                vendorId={vendorId}
            />
        </>
    );
};

export default Vendors;