import axios from "axios";
import { API_BASE_URL } from '../../../../../http_Common';

export const fetchEmployeeDropDown = async () => {
    const res = await axios.get(`${API_BASE_URL}/training/getEmployeeDropDown`)
    return res.data
}
export const fetchCourseDropDown = async () => {
    const res = await axios.get(`${API_BASE_URL}/training/getCourseDropDown`)
    return res.data
}

export const getAssignTrainingList = async (listObj) => {
    const res = await axios.post(`${API_BASE_URL}/training/assignTrainingList`, listObj)
    return res.data
}

// export const unitDropDown = async () => {
//     return await mastersApi.get(`/units/dropdown`, {
//         headers: authHeader(),
//     });
// };
