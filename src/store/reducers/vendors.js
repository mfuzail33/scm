// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    vendors: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setVendors(state, action) {
            state.vendors = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getAllVendors() {
    try {
        const response = await axiosServices.get(`/vendors`)
        return response.data;
    } catch (error) {
        console.error('Error fetching all vendor:', error);
        throw error;
    }
}

export async function createVendor(payload) {
    try {
        const response = await axiosServices.post('/vendors', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating vendor', error);
        throw error;
    }
}

export async function deleteVendor(VendorId) {
    try {
        const response = await axiosServices.delete(`/vendors/${VendorId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting vendor', error);
        throw error;
    }
}

export const updateVendor = async (VendorId, payload) => {
    try {
        const response = await axiosServices.put(`/vendors/${VendorId}`, payload);
        return response;
    } catch (error) {
        console.error('Error updating vendor', error);
        throw error;
    }
};
