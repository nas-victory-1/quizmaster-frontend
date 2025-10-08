import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit?: number;
}

export const useSocket = (sessionId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    const socketInstance = io(SOCKET_URL, {
      timeout: 5000,
      reconnection: false, // Don't keep retrying if server is down
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (error) => {
      console.log("Socket connection failed - running in offline mode");
      setIsConnected(false);
      console.error(error);
      // Don't spam with reconnection attempts
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for participant count updates
    socketInstance.on(
      "participant-count-update",
      (data: { participantCount: number }) => {
        setParticipantCount(data.participantCount);
      }
    );

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
      socket.emit("join-quiz-room", data);
    }
  };

  const startQuiz = (sessionId: string) => {
    if (socket) {
      socket.emit("start-quiz", { sessionId });
    }
  };

  const nextQuestion = (data: {
    sessionId: string;
    question: QuestionData;
    questionIndex: number;
    timeLimit: number;
  }) => {
    if (socket) {
      socket.emit("next-question", data);
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

// Add default export
export default useSocket;
