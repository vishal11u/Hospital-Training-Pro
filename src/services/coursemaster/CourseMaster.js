import axios from 'axios';
import { API_BASE_URL } from '../../http_Common';

export const fetchAllCourseList = async (searchString, page, size) => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/getCourseList`, {
        searchString,
        page,
        size
    });
    return res.data;
};

export const saveCourseApi = async () => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/saveCourse`)
    return res.data
}

export const deleteCourse = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/coursesMaster/deleteCourseById/${id}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
    }
};

export const getDepartmentDropDown = async () => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getDepartmentDropDown`)
    return res.data
}

export const getModuleDropDown = async () => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getModuleDropDown`)
    return res.data
}

export const fetchCourseEdit = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getCourseById/${id}`)
    return res.data
}