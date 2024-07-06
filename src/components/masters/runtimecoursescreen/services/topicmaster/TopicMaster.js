import axios from "axios";
import { API_BASE_URL } from "../../../../../http_Common";

export const newTopicCreate = async () => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/saveTopics`);
    console.log(res);
}

export const fetchAllTopicList = async (searchString, page, size) => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/getTopicList`, {
        searchString,
        page,
        size
    });
    return res.data;
};

export const fetchEditTopicData = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getTopicById/${id}`);
    return res.data;
}

export const fetchEditTopicFilePath = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getTopicDocument/${id}`);
    return res.data;
}

export const deleteTopic = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/coursesMaster/deleteTopicById/${id}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
    }
};
