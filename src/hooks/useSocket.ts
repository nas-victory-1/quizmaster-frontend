import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const useSocket = (sessionId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('participant-joined', (data) => {
      setParticipantCount(data.participantCount);
    });

    socketInstance.on('participant-count-update', (data) => {
      setParticipantCount(data.participantCount);
    });

    socketInstance.on('participant-left', (data) => {
      setParticipantCount(data.participantCount);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [sessionId]);

  const joinRoom = (data: {
    sessionId: string;
    participantId?: string;
    participantName?: string;
    isCreator?: boolean;
  }) => {
    if (socket) {
      socket.emit('join-quiz-room', data);
    }
  };

  const startQuiz = (sessionId: string) => {
    if (socket) {
      socket.emit('start-quiz', { sessionId });
    }
  };

  const nextQuestion = (data: {
    sessionId: string;
    question: any;
    questionIndex: number;
    timeLimit: number;
  }) => {
    if (socket) {
      socket.emit('next-question', data);
    }
  };

  return {
    socket,
    isConnected,
    participantCount,
    joinRoom,
    startQuiz,
    nextQuestion,
  };
};