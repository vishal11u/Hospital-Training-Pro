import axios from 'axios';
import { API_BASE_URL } from '../../../../../http_Common';

export const fetchAllModuleList = async (searchString, page, size) => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/getModuleList`, {
        searchString,
        page,
        size
    });
    return res.data;
};

export const fetchTopicDropdown = async () => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getTopicDropDown`);
    return res.data;
}

export const fetchPreAssessDropdown = async () => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getPreAssessmentDropDown`);
    return res.data;
}

export const fetchPostAssessDropdown = async () => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getPostAssessmentDropDown`);
    return res.data;
}

export const saveModuleApi = async () => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/saveModule`)
    return res.data
}

export const deleteModule = async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/coursesMaster/deleteModuleById/${id}`)
    return res.data
}

export const fetchEditModuleData = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getModuleById/${id}`)
    return res.data;
}