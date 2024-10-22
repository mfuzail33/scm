// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    profiles: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setProfiles(state, action) {
            state.profiles = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getProfileById(userId) {
    try {
        const response = await axiosServices.get(`/profile/${userId}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching user by id:', error);
        throw error;
    }
}