import { useState } from 'react';
import { Button, Grid, Modal, Stack, Typography, Box, MenuItem, TextField, Chip, CircularProgress } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import { createHospital } from 'store/reducers/apis';
import MapComponent from 'pages/MapComponent';

const cityOptions = {
    Pakistan: ["Karachi", "Islamabad", "Lahore", "Faisalabad", "Multan"],
    UAE: ["Dubai", "Al Ain", "Abu Dhabi", "Ajman", "Sharjah", "Fujairah"],
    Saudia: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"],
    Behrain: ["Muharraq", "Riffa", "Manama", "Hamad Town", "Isa Town"],
    Oman: ["Bahla", "Muscat", "Nizwa", "Salalah", "Khasab"],
};

const CreateHealthModal = ({ open, onClose, healths }) => {
    const userId = localStorage.getItem('profileId');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [newHospital, setNewHospital] = useState({
        hospitalName: '',
        country: '',
        city: '',
        coordinates: { lat: '', lon: '' },
        createdBy: userId,
        photo: '',
        departments: [],
        doctors: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHospital({ ...newHospital, [name]: value });
    };

    const handleAddItem = (field, input) => {
        if (input) {
            setNewHospital((prevState) => ({
                ...prevState,
                [field]: [...prevState[field], input],
                [`${field}Input`]: ''
            }));
        }
    };

    const handleDeleteItem = (field, index) => {
        setNewHospital((prevState) => {
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
                setNewHospital({ ...newHospital, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = ({ lat, lng }) => {
        setNewHospital((prevState) => ({
            ...prevState,
            coordinates: { lat, lon: lng }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setButtonLoading(true);
            const payload = {
                hospitalName: newHospital.hospitalName,
                country: newHospital.country,
                city: newHospital.city,
                coordinates: {
                    lat: newHospital.coordinates.lat,
                    lon: newHospital.coordinates.lon,
                },
                createdBy: userId,
                photo: newHospital.photo,
                other: {
                    departments: newHospital.departments,
                    doctors: newHospital.doctors
                }
            };
            await createHospital(payload);
            healths();
            enqueueSnackbar('Hospital added successfully.', { variant: 'success' });
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('Error creating hospital', { variant: 'error' });
        } finally {
            setButtonLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setNewHospital({
            hospitalName: '',
            country: '',
            city: '',
            coordinates: { lat: '', lon: '' },
            createdBy: userId,
            photo: '',
            departments: [],
            doctors: []
        });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard
                    title={<Typography variant="h3">Add New Hospital</Typography>}
                    sx={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Country"
                                select
                                fullWidth
                                value={newHospital.country}
                                onChange={(e) => setNewHospital({ ...newHospital, country: e.target.value, city: '' })}
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
                                value={newHospital.city}
                                onChange={handleInputChange}
                                name="city"
                                sx={{ mt: 2 }}
                                disabled={!newHospital.country}
                            >
                                <MenuItem value="" disabled>Select City</MenuItem>
                                {newHospital.country && cityOptions[newHospital.country]?.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Hospital Name"
                                fullWidth
                                name="hospitalName"
                                value={newHospital.hospitalName}
                                onChange={handleInputChange}
                                sx={{ mt: 2 }}
                            />

                            {['departments', 'doctors'].map((field) => (
                                <Stack key={field} spacing={1} mt={2}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            label={`Enter ${field.slice(0, -1).charAt(0).toUpperCase() + field.slice(1, -1)}`}
                                            fullWidth
                                            name={`${field}Input`}
                                            value={newHospital[`${field}Input`] || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddItem(field, newHospital[`${field}Input`])}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                                        {newHospital[field].map((item, index) => (
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
                                {newHospital.photo && (
                                    <img src={newHospital.photo} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '20px' }} />
                                )}
                            </Stack>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="lat"
                                        label="Enter Latitude"
                                        fullWidth
                                        type='number'
                                        value={newHospital.coordinates.lat}
                                        onChange={(e) =>
                                            setNewHospital({
                                                ...newHospital,
                                                coordinates: {
                                                    ...newHospital.coordinates,
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
                                        value={newHospital.coordinates.lon}
                                        onChange={(e) =>
                                            setNewHospital({
                                                ...newHospital,
                                                coordinates: {
                                                    ...newHospital.coordinates,
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

export default CreateHealthModal;
