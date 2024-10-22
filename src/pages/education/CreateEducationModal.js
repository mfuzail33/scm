import { useState } from 'react';
import { Button, Grid, Modal, Stack, Typography, Box, MenuItem, TextField, Chip, CircularProgress } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import { createInstitute } from 'store/reducers/apis';
import MapComponent from 'pages/MapComponent';

const cityOptions = {
    Pakistan: ["Karachi", "Islamabad", "Lahore", "Faisalabad", "Multan"],
    UAE: ["Dubai", "Al Ain", "Abu Dhabi", "Ajman", "Sharjah", "Fujairah"],
    Saudia: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"],
    Behrain: ["Muharraq", "Riffa", "Manama", "Hamad Town", "Isa Town"],
    Oman: ["Bahla", "Muscat", "Nizwa", "Salalah", "Khasab"],
};

const CreateEducationModal = ({ open, onClose, educations }) => {
    const userId = localStorage.getItem('profileId');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [newEducation, setNewEducation] = useState({
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEducation({ ...newEducation, [name]: value });
    };

    const handleAddItem = (field, input) => {
        if (input) {
            setNewEducation((prevState) => ({
                ...prevState,
                [field]: [...prevState[field], input],
                [`${field}Input`]: ''
            }));
        }
    };

    const handleDeleteItem = (field, index) => {
        setNewEducation((prevState) => {
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
                setNewEducation({ ...newEducation, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = ({ lat, lng }) => {
        setNewEducation((prevState) => ({
            ...prevState,
            coordinates: { lat, lon: lng }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setButtonLoading(true);
            const payload = {
                institutionName: newEducation.institutionName,
                institutionType: newEducation.institutionType,
                country: newEducation.country,
                city: newEducation.city,
                coordinates: {
                    lat: newEducation.coordinates.lat,
                    lon: newEducation.coordinates.lon,
                },
                createdBy: userId,
                photo: newEducation.photo,
                other: {
                    departments: newEducation.departments,
                    faculty: newEducation.faculty
                }
            };
            await createInstitute(payload);
            educations();
            enqueueSnackbar('Institute added successfully.', { variant: 'success' });
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('Error creating Institute', { variant: 'error' });
        } finally {
            setButtonLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setNewEducation({
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
                    title={<Typography variant="h3">Add New Institute</Typography>}
                    sx={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Country"
                                select
                                fullWidth
                                value={newEducation.country}
                                onChange={(e) => setNewEducation({ ...newEducation, country: e.target.value, city: '' })}
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
                                value={newEducation.city}
                                onChange={handleInputChange}
                                name="city"
                                sx={{ mt: 2 }}
                                disabled={!newEducation.country}
                            >
                                <MenuItem value="" disabled>Select City</MenuItem>
                                {newEducation.country && cityOptions[newEducation.country]?.map((city) => (
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
                                    value={newEducation.institutionType}
                                    onChange={(e) => setNewEducation({ ...newEducation, institutionType: e.target.value })}
                                >
                                    <MenuItem value="type" disabled>Select Institution Type</MenuItem>
                                    <MenuItem value="university">University</MenuItem>
                                    <MenuItem value="college">College</MenuItem>
                                    <MenuItem value="school">School</MenuItem>
                                </TextField>
                            </Stack>

                            <TextField
                                label="Institute Name"
                                fullWidth
                                name="institutionName"
                                value={newEducation.institutionName}
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
                                            value={newEducation[`${field}Input`] || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddItem(field, newEducation[`${field}Input`])}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                                        {newEducation[field].map((item, index) => (
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
                                {newEducation.photo && (
                                    <img src={newEducation.photo} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '20px' }} />
                                )}
                            </Stack>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="lat"
                                        label="Enter Latitude"
                                        fullWidth
                                        type='number'
                                        value={newEducation.coordinates.lat}
                                        onChange={(e) =>
                                            setNewEducation({
                                                ...newEducation,
                                                coordinates: {
                                                    ...newEducation.coordinates,
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
                                        value={newEducation.coordinates.lon}
                                        onChange={(e) =>
                                            setNewEducation({
                                                ...newEducation,
                                                coordinates: {
                                                    ...newEducation.coordinates,
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
                                    {buttonLoading ? <CircularProgress size={20} color="inherit" /> : 'Add'}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </MainCard>
            </Box>
        </Modal>
    );
};

export default CreateEducationModal;
