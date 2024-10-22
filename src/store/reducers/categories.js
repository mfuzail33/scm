// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    categories: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setCategories(state, action) {
            state.categories = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getAllCategories() {
    try {
        const response = await axiosServices.get(`/all/category`)
        return response.data;
    } catch (error) {
        console.error('Error fetching all categories:', error);
        throw error;
    }
}

export async function createCategory(payload) {
    try {
        const response = await axiosServices.post('/category', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating category', error);
        throw error;
    }
}

export async function deleteCategory(CategoryId) {
    try {
        const response = await axiosServices.delete(`/category/${CategoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category', error);
        throw error;
    }
}

export const updateCategory = async (CategoryId, payload) => {
    try {
        const response = await axiosServices.put(`/category/${CategoryId}`, payload);
        return response;
    } catch (error) {
        console.error('Error updating category', error);
        throw error;
    }
};

export async function getCategoryById(CategoryId) {
    try {
        const response = await axiosServices.get(`/category/${CategoryId}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching category by id:', error);
        throw error;
    }
}