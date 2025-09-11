'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { startQuizSession, getSessionById } from '@/api/session';

interface Participant {
  id: string;
  name: string;
  joinedAt: Date;
  score: number;
}

export default function WaitingRoom() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id;
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCode, setQuizCode] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [startingQuiz, setStartingQuiz] = useState(false);

  const { socket, isConnected, participantCount, joinRoom, startQuiz } = useSocket(sessionId as string);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const initializeRoom = async () => {
      try {
        // Check localStorage for role
        const storedIsCreator = localStorage.getItem('isCreator') === 'true';
        setIsCreator(storedIsCreator);

        // Fetch session data from API
        const response = await getSessionById(sessionId as string, storedIsCreator);
        
        if (response.success) {
          setQuizTitle(response.data.title);
          setQuizCode(response.data.code);
          
          // If creator, get participant list
          if (storedIsCreator && response.data.participants) {
            setParticipants(response.data.participants);
          }
        } else {
          console.error('Failed to get session info:', response.message);
          // Fall back to localStorage
          const storedTitle = localStorage.getItem('quizTitle');
          const storedCode = localStorage.getItem('quizCode');
          if (storedTitle) setQuizTitle(storedTitle);
          if (storedCode) setQuizCode(storedCode);
        }
      } catch (error) {
        console.error('Error initializing room:', error);
        // Fall back to localStorage
        const storedTitle = localStorage.getItem('quizTitle');
        const storedCode = localStorage.getItem('quizCode');
        if (storedTitle) setQuizTitle(storedTitle);
        if (storedCode) setQuizCode(storedCode);
      } finally {
        setLoading(false);
      }
    };

    initializeRoom();
  }, [sessionId]);

  // Handle socket room joining
  useEffect(() => {
    if (socket && sessionId && !loading) {
      const storedIsCreator = localStorage.getItem('isCreator') === 'true';
      const participantId = localStorage.getItem('participantId');
      const participantName = localStorage.getItem('participantName');
      
      joinRoom({
        sessionId: sessionId as string,
        participantId: participantId || undefined,
        participantName: participantName || undefined,
        isCreator: storedIsCreator,
      });
    }
  }, [socket, sessionId, loading, joinRoom]);

  // Listen for real-time updates
 useEffect(() => {
  if (!socket) return;

  const handleQuizStart = () => {
    router.push(`start`);
  };

  const handleParticipantJoined = (data: { participantId: string; participantName: string }) => {
    if (isCreator) {
      setParticipants(prev => {
        const alreadyExists = prev.some(p => p.id === data.participantId);
        if (alreadyExists) return prev; // don't add twice

        return [
          ...prev,
          {
            id: data.participantId,
            name: data.participantName,
            joinedAt: new Date(),
            score: 0
          }
        ];
      });
    }
  };

  const handleParticipantLeft = (data: { participantId: string }) => {
    if (isCreator) {
      setParticipants(prev => prev.filter(p => p.id !== data.participantId));
    }
  };

  socket.on('quiz-started', handleQuizStart);
  socket.on('participant-joined', handleParticipantJoined);
  socket.on('participant-left', handleParticipantLeft);

  return () => {
    socket.off('quiz-started', handleQuizStart);
    socket.off('participant-joined', handleParticipantJoined);
    socket.off('participant-left', handleParticipantLeft);
  };
}, [socket, sessionId, router, isCreator]);


  const handleStartQuiz = async () => {
    if (participantCount === 0 || startingQuiz) return;
    
    setStartingQuiz(true);
    try {
      await startQuizSession(sessionId as string);
      
      // Emit socket event to notify all participants
      if (socket && isConnected) {
        startQuiz(sessionId as string);
      } else {
        // Fallback: direct navigation if socket isn't working
        router.push(`/quiz/${sessionId}/start`);
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setStartingQuiz(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(quizCode);
      alert('Quiz code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {quizTitle || 'Quiz Session'}
            </h1>
            <p className="text-lg text-gray-600">
              {isCreator ? 'Waiting for participants to join...' : 'Waiting for quiz to start...'}
            </p>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isConnected ? 'Live Updates Active' : 'Basic Mode'}
              </span>
            </div>
          </div>

          {/* Quiz Code Display (Host Only) */}
          {isCreator && quizCode && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-center">Share this code:</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-6 py-3">
                  <span className="text-2xl font-mono font-bold tracking-wider">
                    {quizCode}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Participant Count */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{participantCount}</div>
              <div className="text-gray-600">
                {participantCount === 1 ? 'Participant' : 'Participants'} joined
              </div>
            </div>

            {/* Participant avatars */}
            {participantCount > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: Math.min(participantCount, 10) }).map((_, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    </div>
                  ))}
                  {participantCount > 10 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
                      +{participantCount - 10}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Host View - Participant Names */}
          {isCreator && participants.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Participants:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {participants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{participant.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center">
            {isCreator ? (
              <div className="space-y-4">
                <button
                  onClick={handleStartQuiz}
                  disabled={participantCount === 0 || startingQuiz}
                  className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                  {startingQuiz 
                    ? 'Starting Quiz...' 
                    : participantCount === 0 
                    ? 'Waiting for participants...' 
                    : `Start Quiz (${participantCount} participants)`
                  }
                </button>
                <p className="text-sm text-gray-500">
                  Quiz will start for all participants when you click start
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
                  <span className="text-yellow-800 font-medium">Waiting for host to start the quiz...</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  You're participant #{participantCount || '?'} in this quiz
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}