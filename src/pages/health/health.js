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
import { getAllHospitals } from 'store/reducers/apis';
import MUIDataTable from 'mui-datatables';
import { useNavigate } from 'react-router';
import CreateHealthModal from './CreateHealthModal';
import DeleteHealthModal from './DeleteHealthModal';
import UpdateHealthModal from './UpdateHealthModal';

const Health = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedHealth, setSelectedHealth] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [healthId, setHealthId] = useState('');
    const [healths, setHealths] = useState([]);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        fetchHealths();
    }, []);

    const fetchHealths = async () => {
        setLoading(true);
        try {
            const response = await getAllHospitals();
            setHealths(response);
        } catch (error) {
            console.error('Error fetching Hospitals:', error);
            setHealths([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, health) => {
        setAnchorEl(event.currentTarget);
        setSelectedHealth(health);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setHealthId(selectedHealth._id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleUpdate = () => {
        setHealthId(selectedHealth._id)
        setOpenUpdateModal(true);
        handleMenuClose();
    };

    const handleView = () => {
        navigate(`/healthDetails/${selectedHealth._id}`)
        handleMenuClose();
    };

    const handleShowMap = (lat, lon) => {
        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}&hl=en&z=14`;
        window.open(mapUrl, '_blank');
    };

    const columns = [
        { name: 'hospitalName', label: 'Hospital Name' },
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
                    const { coordinates } = healths[dataIndex];
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
                    const health = healths[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, health)}>
                                <More />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                keepMounted
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
                    <Typography variant="h3">Health Care Centers</Typography>
                </Grid>
                <Grid item>
                    {userRole === 'superadmin' && (
                        <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                            + Add New Hospital
                        </Button>
                    )}
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title=""
                    data={healths}
                    columns={columns}
                    options={options}
                />
            )}
            <CreateHealthModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                healths={fetchHealths}
            />
            <DeleteHealthModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                healthId={healthId}
                healths={fetchHealths}
            />
            <UpdateHealthModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                healths={fetchHealths}
                health={selectedHealth}
            />
        </>
    );
};

export default Health;
