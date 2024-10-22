import { useState, useEffect } from 'react';
import { Button, Grid, Modal, Stack, Typography, Box, MenuItem, TextField, Chip, CircularProgress } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import { updateInstitute } from 'store/reducers/apis';
import MapComponent from 'pages/MapComponent';

const cityOptions = {
    Pakistan: ["Karachi", "Islamabad", "Lahore", "Faisalabad", "Multan"],
    UAE: ["Dubai", "Al Ain", "Abu Dhabi", "Ajman", "Sharjah", "Fujairah"],
    Saudia: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"],
    Behrain: ["Muharraq", "Riffa", "Manama", "Hamad Town", "Isa Town"],
    Oman: ["Bahla", "Muscat", "Nizwa", "Salalah", "Khasab"],
};

const UpdateEducationModal = ({ open, onClose, educations, education }) => {
    const userId = localStorage.getItem('profileId');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [updatedEducation, setUpdatedEducation] = useState({
        institutionName: '',
        institutionType: '',
        country: '',
        city: '',
        coordinates: { lat: '', lon: '' },
        createdBy: userId,
        photo: '',
        departments: [],
        faculty: []
    });

    useEffect(() => {
        if (education) {
            setUpdatedEducation({
                institutionName: education.institutionName,
                institutionType: education.institutionType,
                country: education.country,
                city: education.city,
                coordinates: education.coordinates,
                createdBy: education.createdBy || userId,
                photo: education.photo,
                departments: education.other?.departments || [],
                faculty: education.other?.faculty || [],
            });
        }
    }, [education, open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEducation({ ...updatedEducation, [name]: value });
    };

    const handleAddItem = (field, input) => {
        if (input) {
            setUpdatedEducation((prevState) => ({
                ...prevState,
                [field]: [...prevState[field], input],
                [`${field}Input`]: ''
            }));
        }
    };

    const handleDeleteItem = (field, index) => {
        setUpdatedEducation((prevState) => {
            const updatedItems = [...prevState[field]];
            updatedItems.splice(index, 1);
            return { ...prevState, [field]: updatedItems };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedEducation({ ...updatedEducation, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = ({ lat, lng }) => {
        setUpdatedEducation((prevState) => ({
            ...prevState,
            coordinates: { lat, lon: lng }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setButtonLoading(true);
            const payload = {
                institutionName: updatedEducation.institutionName,
                institutionType: updatedEducation.institutionType,
                country: updatedEducation.country,
                city: updatedEducation.city,
                coordinates: {
                    lat: updatedEducation.coordinates.lat,
                    lon: updatedEducation.coordinates.lon,
                },
                createdBy: userId,
                photo: updatedEducation.photo,
                other: {
                    departments: updatedEducation.departments,
                    faculty: updatedEducation.faculty
                }
            };
            await updateInstitute(education._id, payload);
            educations();
            enqueueSnackbar('Institute updated successfully.', { variant: 'success' });
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('Error updating Institute', { variant: 'error' });
        } finally {
            setButtonLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setUpdatedEducation({
            institutionName: '',
            institutionType: '',
            country: '',
            city: '',
            coordinates: { lat: '', lon: '' },
            createdBy: userId,
            photo: '',
            departments: [],
            faculty: []
        });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard
                    title={<Typography variant="h3">Update Institute</Typography>}
                    sx={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Country"
                                select
                                fullWidth
                                value={updatedEducation.country}
                                onChange={(e) => setUpdatedEducation({ ...updatedEducation, country: e.target.value, city: '' })}
                                sx={{ mt: 2 }}
                            >
                                <MenuItem value="" disabled>Select Country</MenuItem>
                                {Object.keys(cityOptions).map((country) => (
                                    <MenuItem key={country} value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="City"
                                select
                                fullWidth
                                value={updatedEducation.city}
                                onChange={handleInputChange}
                                name="city"
                                sx={{ mt: 2 }}
                                disabled={!updatedEducation.country}
                            >
                                <MenuItem value="" disabled>Select City</MenuItem>
                                {updatedEducation.country && cityOptions[updatedEducation.country]?.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Stack mt={2}>
                                <TextField
                                    label="Institution Type"
                                    select
                                    fullWidth
                                    name="institutionType"
                                    value={updatedEducation.institutionType}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="type" disabled>Select Institution Type</MenuItem>
                                    <MenuItem value="university">University</MenuItem>
                                    <MenuItem value="college">College</MenuItem>
                                    <MenuItem value="school">School</MenuItem>
                                </TextField>
                            </Stack>

                            <TextField
                                label="Institution Name"
                                fullWidth
                                name="institutionName"
                                value={updatedEducation.institutionName}
                                onChange={handleInputChange}
                                sx={{ mt: 2 }}
                            />

                            {['departments', 'faculty'].map((field) => (
                                <Stack key={field} spacing={1} mt={2}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            label={`Enter ${field.slice(0, -1).charAt(0).toUpperCase() + field.slice(1, -1)}`}
                                            fullWidth
                                            name={`${field}Input`}
                                            value={updatedEducation[`${field}Input`] || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddItem(field, updatedEducation[`${field}Input`])}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                                        {updatedEducation[field].map((item, index) => (
                                            <Chip
                                                key={index}
                                                label={item}
                                                onDelete={() => handleDeleteItem(field, index)}
                                                sx={{ mt: 1 }}
                                            />
                                        ))}
                                    </Stack>
                                </Stack>
                            ))}

                            <Stack mt={2}>
                                <Typography>Upload Image</Typography>
                                <input type="file" onChange={handleImageChange} />
                                {updatedEducation.photo && (
                                    <img src={updatedEducation.photo} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '20px' }} />
                                )}
                            </Stack>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="lat"
                                        label="Enter Latitude"
                                        fullWidth
                                        type='number'
                                        value={updatedEducation.coordinates.lat}
                                        onChange={(e) =>
                                            setUpdatedEducation({
                                                ...updatedEducation,
                                                coordinates: {
                                                    ...updatedEducation.coordinates,
                                                    lat: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="lon"
                                        label="Enter Longitude"
                                        type='number'
                                        fullWidth
                                        value={updatedEducation.coordinates.lon}
                                        onChange={(e) =>
                                            setUpdatedEducation({
                                                ...updatedEducation,
                                                coordinates: {
                                                    ...updatedEducation.coordinates,
                                                    lon: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <Stack mt={2}>
                                <MapComponent onClick={handleMapClick} />
                            </Stack>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary" variant="contained" disabled={buttonLoading}>
                                    {buttonLoading ? <CircularProgress size={20} color="inherit" /> : 'Update'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </MainCard>
            </Box>
        </Modal>
    );
};

export default UpdateEducationModal;
