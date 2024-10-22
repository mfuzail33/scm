import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Grid,
    ListItemText,
    ListItem,
    List,
    ListItemIcon,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';
import { Location, Hospital, Teacher } from 'iconsax-react';
import { getInstituteById, addReview } from 'store/reducers/apis';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

const EducationDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [instituteName, setInstituteName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [photo, setPhoto] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [departments, setDepartments] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);

    const userId = localStorage.getItem('profileId');
    const role = localStorage.getItem('role');
    const isUser = role === 'user';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setCardLoading(true);
        try {
            const data = await getInstituteById(id);

            if (data) {
                console.log('Fetched institute data:', data);

                setData(data);
                setInstituteName(data.institutionName)
                setCity(data.city)
                setCountry(data.country)
                setLat(data.coordinates.lat)
                setLon(data.coordinates.lon)
                setDepartments(data.other.departments);
                setFaculty(data.other.faculty);
                setReviews(data.reviews);
                setPhoto(data.photo);
                fetchData();
            } else {
                console.log('institute data is null.');
            }
        } catch (error) {
            console.error('Error fetching institute data:', error);
        } finally {
            setCardLoading(false);
        }
    };

    const handleAddReview = async () => {
        setLoading(true);
        try {
            const reviewData = {
                user: userId,
                comment: comment,
                rating: rating,
                id: id,
                type: 'institute',
            };

            await addReview(reviewData);
            setReviews([...reviews, reviewData]);
            setComment('');
            setRating(0);
            enqueueSnackbar('Review added successfully', {
                variant: 'success',
                persist: false,
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' }
            });

        } catch (error) {
            console.error('Error adding review:', error);
            enqueueSnackbar("You have already submitted review.", {
                variant: 'error',
                persist: false,
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' }
            });
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ rating }) => {
        const stars = Array.from({ length: 5 }, (_, index) => (
            <span key={index} style={{ color: index < rating ? '#FFD700' : '#C0C0C0', fontSize: '30px' }}>
                ★
            </span>
        ));

        return <>{stars}</>;
    };

    const AddReviewStarRating = ({ ratingValue, onClick }) => {
        const stars = Array.from({ length: 5 }, (_, index) => (
            <span key={index} onClick={() => onClick(index + 1)} style={{ color: index < ratingValue ? '#FFD700' : '#C0C0C0', cursor: 'pointer', fontSize: '35px' }}>
                ★
            </span>
        ));

        return <>{stars}</>;
    };

    return (
        <Card >
            {cardLoading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <CardContent>
                    <Typography variant="h2" component="div" gutterBottom textAlign={'center'}>
                        {instituteName}
                    </Typography>
                    <Stack direction={'row'} spacing={1} justifyContent='center' marginTop={2} marginBottom={2}>
                        <Location size={20} />
                        <Typography>{`${city}, ${country}`}</Typography>
                    </Stack>

                    <Grid container spacing={6} mt={3} mb={3}>
                        {/* Map Container */}
                        <Grid item lg={6}>
                            <img
                                src={photo}
                                alt='institute image'
                                style={{
                                    width: '100%',
                                    height: "400px"
                                }}
                            />
                        </Grid>
                        <Grid item lg={3}>
                            <Typography variant="h4">
                                Departments
                            </Typography>
                            <List>
                                {departments && departments.length > 0 ? (
                                    departments.map((department, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Hospital style={{ color: '#005B68', marginRight: '15px' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={department} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No departments available</Typography>
                                )}
                            </List>
                        </Grid>

                        <Grid item lg={3}>
                            <Typography variant="h4">
                                Faculty Members
                            </Typography>
                            <List>
                                {faculty && faculty.length > 0 ? (
                                    faculty.map((fac, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Teacher style={{ color: '#005B68', marginRight: '15px' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={fac} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No faculty members available</Typography>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                    <Grid>
                        <iframe
                            title="Institute Location"
                            width="100%"
                            height="400px"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCBp3WARK3OlnKYeOquzYqvVjpcqXhnbcw&q=${lat},${lon}&zoom=13`}
                            allowFullScreen
                        ></iframe>
                    </Grid>
                    {isUser && (
                        <>
                            <Grid container mt={3}>
                                <Typography variant="h4" mb={2}>
                                    Add Review
                                </Typography>

                                <Grid item lg={12}>
                                    <AddReviewStarRating ratingValue={rating} onClick={(value) => setRating(value)} />
                                </Grid>

                                <Grid item lg={6}>
                                    <TextField
                                        label="Add Comment"
                                        multiline
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <Button variant="contained" color="primary" onClick={handleAddReview} disabled={!comment || rating === 0}>
                                {loading ? <CircularProgress size={20} style={{ color: '#fff' }} /> : 'Add Review'}
                            </Button>
                        </>

                    )}

                    <Typography variant="h4" mb={1} mt={3}>
                        Reviews
                    </Typography>
                    {data && data.reviews && data.reviews.length > 0 && (
                        <>
                            {data.reviews.map((review) => (
                                <div key={review._id} style={{ marginBottom: '10px' }}>
                                    <Typography color="textSecondary">
                                        <b>User:</b> {`${review.user.firstname} ${review.user.lastname}`}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <b>Comment:</b> {`${review.comment}`}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <StarRating rating={review.rating} />
                                    </Typography>
                                </div>
                            ))}
                        </>
                    )}
                    {!data || !data.reviews || data.reviews.length === 0 && (
                        <Typography>No reviews available</Typography>
                    )}

                </CardContent>
            )}
        </Card>
    );
};

export default EducationDetails;
