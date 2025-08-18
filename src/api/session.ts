import api from 'axios';


export const createQuizSession = async (payload: {
  title: string;
  questions: any[];
  creatorId: string;
}) => {
  const res = await api.post('/create', payload);
  return res.data;
};

export const joinQuizSession = async (payload: {
  code: string;
  participantName: string;
}) => {
  const res = await api.post(`/join`, payload);
  return res.data;
};

export const getSessionInfo = async (code: string) => {
  const res = await api.get(`/${code}`);
  return res.data;
};

export const startQuizSession = async (sessionId: string) => {
  const res = await api.post(`/start/${sessionId}`);
  return res.data;
};
