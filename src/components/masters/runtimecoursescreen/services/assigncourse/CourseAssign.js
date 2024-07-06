import axios from "axios";
import { API_BASE_URL } from "../../../../../http_Common";

export const AssignCourse = async (id) => {
  const res = await axios.get(
    `${API_BASE_URL}/training/getAssignCourses/${id}`
  );
  return res.data;
};

export const fetchAllModules = async (id) => {
  const res = await axios.get(
    `${API_BASE_URL}/training/getCourseModuleDataForTraining/${id}`
  );
  return res.data;
};
//http://192.168.0.43:7100/training/getAssessment?assignTrainingId=22&assessmentId=35
export const getPreAssesmentList = async (assignTrainingId, assessmentId) => {
  const res = await axios.get(
    `${API_BASE_URL}/training/getAssessment?assignTrainingId=${assignTrainingId}&assessmentId=${assessmentId}`
  );
  return res.data;
};
//`http://192.168.0.43:7100/training/moduleStartAndEndTime/${modules.assignTrainingId}/${modules.courseId}/${moduleId}/0`

export const getModuleStartAndEndTime = async (
  assignTrainingId,
  courseId,
  moduleId,
  startEndKey
) => {
  const res = await axios.get(
    `${API_BASE_URL}/training/moduleStartAndEndTime/${assignTrainingId}/${courseId}/${moduleId}/${startEndKey}`
  );
  return res.data;
};

export const saveCoursePreAssessment = async (listObj) => {
  const res = await axios.post(
    `${API_BASE_URL}/training/saveAssessmentScore`,
    listObj
  );
  return res.data;
};
