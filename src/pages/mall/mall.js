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
import { More, Edit, Trash, Information } from 'iconsax-react';
import { getAllMalls } from 'store/reducers/apis';
import MUIDataTable from 'mui-datatables';
import { useNavigate } from 'react-router';
import CreateMallModal from './CreateMallModal';
import DeleteMallModal from './DeleteMallModal';
import UpdateMallModal from './UpdateMallModal';

const Mall = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMall, setSelectedMall] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [mallId, setMallId] = useState('');
    const [malls, setMalls] = useState([]);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        fetchMalls();
    }, []);

    const fetchMalls = async () => {
        setLoading(true);
        try {
            const response = await getAllMalls();
            setMalls(response);
        } catch (error) {
            console.error('Error fetching Malls:', error);
            setMalls([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, mall) => {
        setAnchorEl(event.currentTarget);
        setSelectedMall(mall);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setMallId(selectedMall._id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleUpdate = () => {
        setMallId(selectedMall._id)
        setOpenUpdateModal(true);
        handleMenuClose();
    };

    const handleView = () => {
        navigate(`/mallDetails/${selectedMall._id}`)
        handleMenuClose();
    };

    const handleShowMap = (lat, lon) => {
        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}&hl=en&z=14`;
        window.open(mapUrl, '_blank');
    };

    const columns = [
        { name: 'shoppingMallName', label: 'Mall Name' },
        {
            name: 'country',
            label: 'Country',
        },
        {
            name: 'city',
            label: 'City',
        },
        {
            name: 'location',
            label: 'Location',
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const { coordinates } = malls[dataIndex];
                    return (
                        <Button
                            color="primary"
                            onClick={() => handleShowMap(coordinates.lat, coordinates.lon)}
                        >
                            View Directions
                        </Button>
                    );
                },
            },
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    const mall = malls[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, mall)}>
                                <More />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleView}><Information size="20" />&nbsp;&nbsp;View More</MenuItem>
                                {userRole === 'superadmin' && (
                                    <>
                                        <MenuItem onClick={handleUpdate}><Edit size="20" />&nbsp;&nbsp;Update</MenuItem>
                                        <MenuItem onClick={handleDelete} sx={{ color: 'red' }}><Trash size="20" />&nbsp;&nbsp;Delete</MenuItem>
                                    </>
                                )}
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
                    <Typography variant="h3">Shopping Mall</Typography>
                </Grid>
                <Grid item>
                    {userRole === 'superadmin' && (
                        <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                            + Add New Mall
                        </Button>
                    )}
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title=""
                    data={malls}
                    columns={columns}
                    options={options}
                />
            )}
            <CreateMallModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                malls={fetchMalls}
            />
            <UpdateMallModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                malls={fetchMalls}
                mall={selectedMall}
            />
            <DeleteMallModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                mallId={mallId}
                malls={fetchMalls}
            />
        </>
    );
};

export default Mall;
