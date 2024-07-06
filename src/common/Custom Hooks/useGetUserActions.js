import authHeader from "../../authentication/authservices/auth-header";
import {userServiceApi} from "../../http-common";

export const useGetUserActions = async (menuId) => {
  return await userServiceApi
    .get(`/auth/getUserActions/${menuId}`, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data.result;
    })
    .catch((err) => {
      return [];
    });
};