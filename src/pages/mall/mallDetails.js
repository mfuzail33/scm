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
import { Location, ShoppingBag, Alarm } from 'iconsax-react';
import { getMallById, addReview } from 'store/reducers/apis';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

const MallDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [mallName, setMallName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [outlets, setOutlets] = useState([]);
    const [foodCourts, setFoodCourts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState('');
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
            const data = await getMallById(id);

            if (data) {
                console.log('Fetched Mall data:', data);

                setData(data);
                setMallName(data.shoppingMallName)
                setCity(data.city)
                setCountry(data.country)
                setLat(data.coordinates.lat)
                setLon(data.coordinates.lon)
                setOutlets(data.other.outlets)
                setFoodCourts(data.other.foodCourts)
                setReviews(data.reviews)
                setPhoto(data.photo)
            } else {
                console.log('Mall data is null.');
            }
        } catch (error) {
            console.error('Error fetching mall data:', error);
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
                type: 'shopping',
            };

            await addReview(reviewData);
            setReviews([...reviews, reviewData]);
            setComment('');
            setRating(0);
            fetchData();
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
            <span key={index} style={{ color: index < rating ? '#FFD700' : '#C0C0C0' }}>
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
                        {mallName}
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
                                Outlets
                            </Typography>
                            <List>
                                {outlets && outlets.length > 0 ? (
                                    outlets.map((outlet, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <ShoppingBag style={{ color: '#005B68', marginRight: '15px' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={outlet} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No outlets available</Typography>
                                )}
                            </List>
                        </Grid>
                        <Grid item lg={3}>
                            <Typography variant="h4">Food Courts</Typography>
                            <List>
                                {foodCourts && foodCourts.length > 0 ? (
                                    foodCourts.map((foodCourt, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Alarm style={{ color: '#005B68', marginRight: '15px' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={foodCourt} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No Food Courts available</Typography>
                                )}
                            </List>

                        </Grid>
                    </Grid>

                    <Grid>
                        <iframe
                            title="Mall Location"
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

export default MallDetails;
