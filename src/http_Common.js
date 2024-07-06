import axios from "axios";

export const API_BASE_URL = 'http://192.168.0.38:7100';

export const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});