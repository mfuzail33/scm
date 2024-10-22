// third-party
import { createSlice } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  users: [],
  loading: false
};

// ==============================|| SLICE - CART ||============================== //
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

export async function getAllUsers() {
  try {
    const response = await axiosServices.get(`/auth/all-user`)
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

export async function getAttachedDocs(userId) {
  try {
    const response = await axiosServices.get(`/docs/user-docs-with-all-users/${userId}`)
    return response.data;
  } catch (error) {
    console.error('Error fetching users attached documents:', error);
    throw error;
  }
}

export const registerUser = async (email, password, firstName, lastName, role = 'user') => {
  const response = await axiosServices.post('/auth/signup', {
    email,
    password,
    firstName,
    lastName,
    role
  });
  console.log("user created: ", response)
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await axiosServices.post('/auth/change-password', {
    oldPassword,
    newPassword
  });
  console.log("Password changed successfully, ", response)
};

export const updateUser = async (userId, payload) => {
  try {
    const response = await axiosServices.post(`/auth/update-user/${userId}`, payload);
    return response;
  } catch (error) {
    console.error('Error updating user role', error);
    throw error;
  }
};
