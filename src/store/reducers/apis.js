import axios from 'utils/axios.api'

export const createHospital = async (payload) => {
    try {
        const response = await axios.post(`/hospital`, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating hospital', error);
        throw error;
    }
};

export async function getAllHospitals() {
    try {
        const response = await axios.get('/hospital/all');
        return response.data.reverse();
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
    }
}

export async function deleteHospital(hospitalId) {
    try {
        await axios.delete(`/hospital/${hospitalId}`);
        console.log('Hospital deleted successfully.');
    } catch (error) {
        console.error('Error deleting hospital', error);
        throw error;
    }
}

export const updateHospital = async (hospitalId, payload) => {
    try {
        const response = await axios.put(`/hospital/${hospitalId}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating hospital', error);
        throw error;
    }
};

export const createMall = async (payload) => {
    try {
        const response = await axios.post(`/shopping-mall`, payload);
        return response.data;
    } catch (error) {
        console.error('Error adding shopping mall', error);
        throw error;
    }
};

export async function getAllMalls() {
    try {
        const response = await axios.get('/shopping-mall/all');
        return response.data.reverse();
    } catch (error) {
        console.error('Error fetching shopping malls', error);
        return [];
    }
}

export async function deleteMall(mallId) {
    try {
        await axios.delete(`/shopping-mall/${mallId}`);
        console.log('Shopping Mall deleted successfully.');
    } catch (error) {
        console.error('Error deleting Shopping Mall', error);
        throw error;
    }
}

export const updateMall = async (mallId, payload) => {
    try {
        const response = await axios.put(`/shopping-mall/${mallId}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating shopping mall', error);
        throw error;
    }
};

export async function getHospitalById(hospitalId) {
    try {
        const response = await axios.get(`/hospital/${hospitalId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching hospital by ID', error);
        throw error;
    }
}

export async function getMallById(mallId) {
    try {
        const response = await axios.get(`/shopping-mall/${mallId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shopping mall by ID', error);
        throw error;
    }
}

export const addReview = async (payload) => {
    try {
        const response = await axios.post(`/review`, payload);
        return response.data;
    } catch (error) {
        console.error('Error posting review', error);
        throw error;
    }
};

export const createInstitute = async (payload) => {
    try {
        const response = await axios.post(`/institute`, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating institute', error);
        throw error;
    }
};

export async function getAllInstitutes() {
    try {
        const response = await axios.get('/institute/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching Institutes:', error);
        return [];
    }
}

export async function deleteInstitute(instituteId) {
    try {
        await axios.delete(`/institute/${instituteId}`);
        console.log('Institute deleted successfully.');
    } catch (error) {
        console.error('Error deleting institute', error);
        throw error;
    }
}

export const updateInstitute = async (instituteId, payload) => {
    try {
        const response = await axios.put(`/institute/${instituteId}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating institute', error);
        throw error;
    }
};

export async function getInstituteById(instituteId) {
    try {
        const response = await axios.get(`/institute/${instituteId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching institute by ID', error);
        throw error;
    }
}