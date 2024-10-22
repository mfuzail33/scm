// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
import axios from 'axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    products: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setProducts(state, action) {
            state.products = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getAllProducts() {
    try {
        const response = await axiosServices.get(`/products`)
        return response.data.reverse();
    } catch (error) {
        console.error('Error fetching all Products:', error);
        throw error;
    }
}

export async function getLowQuantityProducts() {
    try {
        const response = await axiosServices.get(`/products/low-quantity`)
        return response.data;
    } catch (error) {
        console.error('Error fetching low quantity Products:', error);
        throw error;
    }
}

export async function createProduct(payload) {
    try {
        const response = await axiosServices.post('/products', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating Product', error);
        throw error;
    }
}

export async function deleteProduct(ProductId) {
    try {
        const response = await axiosServices.delete(`/products/${ProductId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Product', error);
        throw error;
    }
}

export const updateProduct = async (productId, payload) => {
    try {
        const response = await axiosServices.put(`/products/${productId}`, payload);
        return response;
    } catch (error) {
        console.error('Error updating product', error);
        throw error;
    }
};

export async function postImg(file) {
    const bodyFormData = new FormData();
    bodyFormData.append("files", file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    try {
        const response = await axios.post('https://uploads.padelmates.co/index.php', bodyFormData, config);
        return response?.data?.imageInfo?.completeUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
