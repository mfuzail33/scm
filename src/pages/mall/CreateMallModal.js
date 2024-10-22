import { useState } from 'react';
import { Button, Grid, Modal, Stack, Typography, Box, MenuItem, TextField, Chip, CircularProgress } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import { createMall } from 'store/reducers/apis';
import MapComponent from 'pages/MapComponent';

const cityOptions = {
    Pakistan: ["Karachi", "Islamabad", "Lahore", "Faisalabad", "Multan"],
    UAE: ["Dubai", "Al Ain", "Abu Dhabi", "Ajman", "Sharjah", "Fujairah"],
    Saudia: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"],
    Behrain: ["Muharraq", "Riffa", "Manama", "Hamad Town", "Isa Town"],
    Oman: ["Bahla", "Muscat", "Nizwa", "Salalah", "Khasab"],
};

const CreateMallModal = ({ open, onClose, malls }) => {
    const userId = localStorage.getItem('profileId');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [newMall, setNewMall] = useState({
        shoppingMallName: '',
        country: '',
        city: '',
        coordinates: { lat: '', lon: '' },
        createdBy: userId,
        photo: '',
        outlets: [],
        foodCourts: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMall({ ...newMall, [name]: value });
    };

    const handleAddItem = (field, input) => {
        if (input) {
            setNewMall((prevState) => ({
                ...prevState,
                [field]: [...prevState[field], input],
                [`${field}Input`]: ''
            }));
        }
    };

    const handleDeleteItem = (field, index) => {
        setNewMall((prevState) => {
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
                setNewMall({ ...newMall, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = ({ lat, lng }) => {
        setNewMall((prevState) => ({
            ...prevState,
            coordinates: { lat, lon: lng }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setButtonLoading(true);
            const payload = {
                shoppingMallName: newMall.shoppingMallName,
                country: newMall.country,
                city: newMall.city,
                coordinates: {
                    lat: newMall.coordinates.lat,
                    lon: newMall.coordinates.lon,
                },
                createdBy: userId,
                photo: newMall.photo,
                other: {
                    outlets: newMall.outlets,
                    foodCourts: newMall.foodCourts
                }
            };
            await createMall(payload);
            malls();
            enqueueSnackbar('Mall added successfully.', { variant: 'success' });
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('Error creating Mall', { variant: 'error' });
        } finally {
            setButtonLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setNewMall({
            shoppingMallName: '',
            country: '',
            city: '',
            coordinates: { lat: '', lon: '' },
            createdBy: userId,
            photo: '',
            outlets: [],
            foodCourts: []
        });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <MainCard
                    title={<Typography variant="h3">Add New Mall</Typography>}
                    sx={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Country"
                                select
                                fullWidth
                                value={newMall.country}
                                onChange={(e) => setNewMall({ ...newMall, country: e.target.value, city: '' })}
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
                                value={newMall.city}
                                onChange={handleInputChange}
                                name="city"
                                sx={{ mt: 2 }}
                                disabled={!newMall.country}
                            >
                                <MenuItem value="" disabled>Select City</MenuItem>
                                {newMall.country && cityOptions[newMall.country]?.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Mall Name"
                                fullWidth
                                name="shoppingMallName"
                                value={newMall.shoppingMallName}
                                onChange={handleInputChange}
                                sx={{ mt: 2 }}
                            />

                            {['outlets', 'foodCourts'].map((field) => (
                                <Stack key={field} spacing={1} mt={2}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            label={`Enter ${field.slice(0, -1).charAt(0).toUpperCase() + field.slice(1, -1)}`}
                                            fullWidth
                                            name={`${field}Input`}
                                            value={newMall[`${field}Input`] || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddItem(field, newMall[`${field}Input`])}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                                        {newMall[field].map((item, index) => (
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
                                {newMall.photo && (
                                    <img src={newMall.photo} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '20px' }} />
                                )}
                            </Stack>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="lat"
                                        label="Enter Latitude"
                                        fullWidth
                                        type='number'
                                        value={newMall.coordinates.lat}
                                        onChange={(e) =>
                                            setNewMall({
                                                ...newMall,
                                                coordinates: {
                                                    ...newMall.coordinates,
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
                                        value={newMall.coordinates.lon}
                                        onChange={(e) =>
                                            setNewMall({
                                                ...newMall,
                                                coordinates: {
                                                    ...newMall.coordinates,
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

export default CreateMallModal;
