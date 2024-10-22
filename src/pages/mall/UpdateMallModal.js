import { useState, useEffect } from 'react';
import { Button, Grid, Modal, Stack, Typography, Box, MenuItem, TextField, Chip, CircularProgress } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import { updateMall } from 'store/reducers/apis'; 
import MapComponent from 'pages/MapComponent';

const cityOptions = {
    Pakistan: ["Karachi", "Islamabad", "Lahore", "Faisalabad", "Multan"],
    UAE: ["Dubai", "Al Ain", "Abu Dhabi", "Ajman", "Sharjah", "Fujairah"],
    Saudia: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"],
    Behrain: ["Muharraq", "Riffa", "Manama", "Hamad Town", "Isa Town"],
    Oman: ["Bahla", "Muscat", "Nizwa", "Salalah", "Khasab"],
};

const UpdateMallModal = ({ open, onClose, malls, mall }) => {
    const userId = localStorage.getItem('profileId');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [updatedMall, setUpdatedMall] = useState({
        shoppingMallName: '',
        country: '',
        city: '',
        coordinates: { lat: '', lon: '' },
        createdBy: userId,
        photo: '',
        outlets: [],
        foodCourts: []
    });

    useEffect(() => {
        console.log("mall", mall)
        if (mall) {
            setUpdatedMall({
                shoppingMallName: mall.shoppingMallName,
                country: mall.country,
                city: mall.city,
                coordinates: mall.coordinates,
                createdBy: mall.createdBy || userId,
                photo: mall.photo,
                outlets: mall.other.outlets || [],
                foodCourts: mall.other.foodCourts || [],
            });
        }
    }, [mall, open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedMall({ ...updatedMall, [name]: value });
    };

    const handleAddItem = (field, input) => {
        if (input) {
            setUpdatedMall((prevState) => ({
                ...prevState,
                [field]: [...prevState[field], input],
                [`${field}Input`]: ''
            }));
        }
    };

    const handleDeleteItem = (field, index) => {
        setUpdatedMall((prevState) => {
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
                setUpdatedMall({ ...updatedMall, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = ({ lat, lng }) => {
        setUpdatedMall((prevState) => ({
            ...prevState,
            coordinates: { lat, lon: lng }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setButtonLoading(true);
            const payload = {
                shoppingMallName: updatedMall.shoppingMallName,
                country: updatedMall.country,
                city: updatedMall.city,
                coordinates: {
                    lat: updatedMall.coordinates.lat,
                    lon: updatedMall.coordinates.lon,
                },
                createdBy: userId,
                photo: updatedMall.photo,
                other: {
                    outlets: updatedMall.outlets,
                    foodCourts: updatedMall.foodCourts
                }
            };
            await updateMall(mall._id, payload);
            malls();
            enqueueSnackbar('Shopping Mall updated successfully.', { variant: 'success' });
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('Error updating Shopping Mall', { variant: 'error' });
        } finally {
            setButtonLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setUpdatedMall({
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
                    title={<Typography variant="h3">Update Mall</Typography>}
                    sx={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Country"
                                select
                                fullWidth
                                value={updatedMall.country}
                                onChange={(e) => setUpdatedMall({ ...updatedMall, country: e.target.value, city: '' })}
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
                                value={updatedMall.city}
                                onChange={handleInputChange}
                                name="city"
                                sx={{ mt: 2 }}
                                disabled={!updatedMall.country}
                            >
                                <MenuItem value="" disabled>Select City</MenuItem>
                                {updatedMall.country && cityOptions[updatedMall.country]?.map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Mall Name"
                                fullWidth
                                name="shoppingMallName"
                                value={updatedMall.shoppingMallName}
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
                                            value={updatedMall[`${field}Input`] || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddItem(field, updatedMall[`${field}Input`])}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                                        {updatedMall[field].map((item, index) => (
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
                                {updatedMall.photo && (
                                    <img src={updatedMall.photo} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '20px' }} />
                                )}
                            </Stack>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="lat"
                                        label="Enter Latitude"
                                        fullWidth
                                        type='number'
                                        value={updatedMall.coordinates.lat}
                                        onChange={(e) =>
                                            setUpdatedMall({
                                                ...updatedMall,
                                                coordinates: {
                                                    ...updatedMall.coordinates,
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
                                        value={updatedMall.coordinates.lon}
                                        onChange={(e) =>
                                            setUpdatedMall({
                                                ...updatedMall,
                                                coordinates: {
                                                    ...updatedMall.coordinates,
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

export default UpdateMallModal;
