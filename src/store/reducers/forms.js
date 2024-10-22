// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    forms: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setForms(state, action) {
            state.forms = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getAllForms() {
    try {
        const response = await axiosServices.get(`/all/forms`)
        return response.data;
    } catch (error) {
        console.error('Error fetching all forms:', error);
        throw error;
    }
}

export async function deleteForm(formId) {
    try {
        const response = await axiosServices.delete(`/form/${formId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting form', error);
        throw error;
    }
}

export const updateForm = async (formId, payload) => {
    try {
        const response = await axiosServices.put(`/form/${formId}`, payload);
        return response;
    } catch (error) {
        console.error('Error updating form', error);
        throw error;
    }
};

