// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    orders: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setOrders(state, action) {
            state.orders = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getAllOrders() {
    try {
        const response = await axiosServices.get(`/all/orders`)
        return response.data;
    } catch (error) {
        console.error('Error fetching all Order:', error);
        throw error;
    }
}

export async function deleteOrder(orderId) {
    try {
        const response = await axiosServices.delete(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Order', error);
        throw error;
    }
}

export const updateOrder = async (orderId, payload) => {
    try {
        const response = await axiosServices.put(`/order/${orderId}`, payload);
        return response;
    } catch (error) {
        console.error('Error updating Order', error);
        throw error;
    }
};

export async function getOrderById(orderId) {
    try {
        const response = await axiosServices.get(`/order/${orderId}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
    }
}