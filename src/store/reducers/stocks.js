// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';
// ----------------------------------------------------------------------

const initialState = {
    error: null,
    stocks: [],
    loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        setStocks(state, action) {
            state.stocks = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export async function getStockInLogs() {
    try {
        const response = await axiosServices.get(`/stock/all`);
        const stockInLogs = response.data
            .filter(log => log.type === "in")
            .reverse();
        return stockInLogs;
    } catch (error) {
        console.error('Error fetching logs of stock in:', error);
        throw error;
    }
}

export async function getStockOutLogs() {
    try {
        const response = await axiosServices.get(`/stock/all`);
        const stockOutLogs = response.data
            .filter(log => log.type === "out")
            .reverse();
        return stockOutLogs;
    } catch (error) {
        console.error('Error fetching logs of stock out:', error);
        throw error;
    }
}

export async function createStockIn(payload) {
    try {
        const response = await axiosServices.post('/stock-in', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating log of stock in', error);
        throw error;
    }
}

export async function createStockOut(payload) {
    try {
        const response = await axiosServices.post('/stock-out', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating log of stock out', error);
        throw error;
    }
}

export async function deleteStockLog(stockId) {
    try {
        const response = await axiosServices.delete(`/stock/${stockId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting stock log', error);
        throw error;
    }
}