import axios from "axios";
import { API_BASE_URL } from "../../http_Common";

//http://192.168.0.43:7100/training/getAssessment?assignTrainingId=21&assessmentId=21

export const fetchAllAssesmentQue = async (id) => {
  const res = await axios.get(
    `${API_BASE_URL}/training/getAssessment?assignTrainingId=${id}&assessmentId${null}`
  );
  return res.data;
};
