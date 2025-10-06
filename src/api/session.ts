import api from './axios';

export const createQuizSession = async (payload: {
  title: string;
  questions: any[];
  creatorId: string;
}) => {
  const res = await api.post('/session/create', payload);
  return res.data;
};

export const joinQuizSession = async (payload: {
  code: string;
  participantName: string;
}) => {
  const res = await api.post(`/session/join-quiz`, payload);
  return res.data;
};

export const getSessionInfo = async (code: string) => {
  const res = await api.get(`/session/${code}`);
  return res.data;
};

// Get session by ID (for waiting room)
export const getSessionById = async (sessionId: string, isCreator: boolean = false) => {
  const res = await api.get(`/session/session/${sessionId}?isCreator=${isCreator}`);
  return res.data;
};

export const startQuizSession = async (sessionId: string) => {
  const res = await api.post(`/session/start/${sessionId}`);
  return res.data;
};

export const updateParticipantScore = async (sessionId: string, participantId: string, finalScore: number) => {
  const res = await api.post(`/session/${sessionId}/update-score`, {
    participantId,
    finalScore
  });
  return res.data;
};