import axios from 'axios';
import { API_BASE_URL } from '../../http_Common';

export const fetchAllAssesList = async (searchString, page, size) => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/getAssessmentList`, {
        searchString,
        page,
        size
    });
    return res.data;
};

export const deleteAssessment = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/coursesMaster/deleteAssessment/${id}`);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
    }
};

export const fetchEditAssesmentData = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getAssessmentById/${id}`);
    return res.data;
}

export const fetchAssesmentDataEdit = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getAssessmentById/${id}`)
    return res.data;
}
