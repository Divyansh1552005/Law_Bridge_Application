import api from './axiosClient';

export const getLawyersData = async (backendUrl) => {
  return api.get(`${backendUrl}/api/lawyer/list`);
};

