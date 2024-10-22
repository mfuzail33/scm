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
import { getAllInstitutes } from 'store/reducers/apis';
import MUIDataTable from 'mui-datatables';
import { useNavigate } from 'react-router';
import CreateEducationModal from './CreateEducationModal';
import DeleteEducationModal from './DeleteEducationModal';
import UpdateEducationModal from './UpdateEducationModal';

const Education = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [educationId, setEducationId] = useState('');
    const [educations, setEducations] = useState([]);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        setLoading(true);
        try {
            const response = await getAllInstitutes();
            setEducations(response);
        } catch (error) {
            console.error('Error fetching Institute:', error);
            setEducations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, education) => {
        setAnchorEl(event.currentTarget);
        setSelectedEducation(education);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setEducationId(selectedEducation._id)
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleUpdate = () => {
        setEducationId(selectedEducation._id)
        setOpenUpdateModal(true);
        handleMenuClose();
    };

    const handleView = () => {
        navigate(`/educationDetails/${selectedEducation._id}`)
        handleMenuClose();
    };

    const handleShowMap = (lat, lon) => {
        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}&hl=en&z=14`;
        window.open(mapUrl, '_blank');
    };

    const columns = [
        { name: 'institutionName', label: 'Institute Name' },
        { name: 'institutionType', label: 'Institute Type' },
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
                    const { coordinates } = educations[dataIndex];
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
                    const education = educations[dataIndex];
                    return (
                        <>
                            <IconButton onClick={(event) => handleMenuOpen(event, education)}>
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
                    <Typography variant="h3">Educational Institutes</Typography>
                </Grid>
                <Grid item>
                    {userRole === 'superadmin' && (
                        <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                            + Add New Institute
                        </Button>
                    )}
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <MUIDataTable
                    title=""
                    data={educations}
                    columns={columns}
                    options={options}
                />
            )}
            <CreateEducationModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                educations={fetchEducations}
            />
            <DeleteEducationModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                educationId={educationId}
                educations={fetchEducations}
            />
            <UpdateEducationModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                educations={fetchEducations}
                education={selectedEducation}
            />
        </>
    );
};

export default Education;
