import axios from "axios";
import { API, API_BASE_URL } from "../../../../../http_Common";

export const saveRunTimeCourse = async (payload) => {
    return await axios.post(`${API_BASE_URL}/coursesMaster/saveRunTimeCourse`, payload)
}

export const getRunTimeCourseList = async (page, size) => {
    const res = await axios.post(`${API_BASE_URL}/coursesMaster/runTimeCourseList`, {
        page,
        size
    })
    return res.data;
}

export const fetchRunTimeCourseData = async (id) => {
    const res = await axios.get(`${API_BASE_URL}/coursesMaster/getRunTimeCourseById/${id}`)
    return res.data;
}