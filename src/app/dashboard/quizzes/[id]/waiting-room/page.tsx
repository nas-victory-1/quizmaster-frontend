'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { getSessionInfo, startQuizSession } from '@/api/session';

export default function WaitingRoom() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId;
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCode, setQuizCode] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  const { socket, isConnected, participantCount, joinRoom, startQuiz } = useSocket(sessionId as string);

  useEffect(() => {
    if (!sessionId) return;

    // Get session details and determine if user is creator
    const initializeRoom = async () => {
      try {
        // Check localStorage for role
        const storedIsCreator = localStorage.getItem('isCreator') === 'true';
        const participantId = localStorage.getItem('participantId');
        const participantName = localStorage.getItem('participantName');
        const storedQuizTitle = localStorage.getItem('quizTitle');

        setIsCreator(storedIsCreator);

        if (storedQuizTitle) {
          setQuizTitle(storedQuizTitle);
        }

        // Get session info including code
        const response = await getSessionInfo(
          storedIsCreator ? localStorage.getItem('quizCode') || '' : ''
        );

        if (response.success) {
          setQuizTitle(response.data.title);
          setQuizCode(response.data.code);
        }

        // Join socket room
        if (socket && sessionId) {
          joinRoom({
            sessionId: sessionId as string,
            participantId: participantId || undefined,
            participantName: participantName || undefined,
            isCreator: storedIsCreator,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing room:', error);
        setLoading(false);
      }
    };

    initializeRoom();
  }, [sessionId, socket, joinRoom]);

  // Listen for quiz start
  useEffect(() => {
    if (!socket) return;

    const handleQuizStart = () => {
      router.push(`/quiz/${sessionId}/play`);
    };

    socket.on('quiz-started', handleQuizStart);

    return () => {
      socket.off('quiz-started', handleQuizStart);
    };
  }, [socket, sessionId, router]);

  const handleStartQuiz = async () => {
    if (socket && participantCount > 0) {
      try {
        await startQuizSession(sessionId as string);
        // The socket will handle notifying participants
        startQuiz(sessionId as string);
      } catch (error) {
        console.error('Failed to start quiz:', error);
      }
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quizTitle}</h1>
            <p className="text-lg text-gray-600">
              {isCreator ? 'Waiting for participants to join...' : 'Waiting for quiz to start...'}
            </p>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>

          {/* Quiz Code Display */}
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Copy Code
                </button>
              </div>
            </div>
          )}

          {/* Participant Count */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{participantCount}</div>
              <div className="text-gray-600">
                {participantCount === 1 ? 'Participant' : 'Participants'} joined
              </div>
            </div>

            {/* Visual representation of participants */}
            {participantCount > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: Math.min(participantCount, 10) }).map((_, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
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

          {/* Action Buttons */}
          <div className="text-center">
            {isCreator ? (
              <div className="space-y-4">
                <button
                  onClick={handleStartQuiz}
                  disabled={participantCount === 0 || !isConnected}
                  className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                  {participantCount === 0 
                    ? 'Waiting for participants...' 
                    : `Start Quiz (${participantCount} participants)`
                  }
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Quiz will start for all participants when you click start
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
                  <span className="text-yellow-800 font-medium">Waiting for host to start the quiz...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}