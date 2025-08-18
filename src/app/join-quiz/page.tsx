'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinQuizSession } from '@/api/session';

export default function JoinQuiz() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoinQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !name.trim()) {
      setError('Please enter both quiz code and your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await joinQuizSession({
        code: code.trim().toUpperCase(),
        participantName: name.trim()
      });

      if (response.success) {
        // Store participant info in localStorage
        localStorage.setItem('participantId', response.data.participantId);
        localStorage.setItem('sessionId', response.data.sessionId);
        localStorage.setItem('participantName', name.trim());
        localStorage.setItem('quizTitle', response.data.quizTitle);
        
        // Redirect to waiting room
        router.push(`/quiz/${response.data.sessionId}/waiting`);
      } else {
        setError(response.error || 'Failed to join quiz');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Quiz</h1>
          <p className="text-gray-600">Enter the quiz code to participate</p>
        </div>

        <form onSubmit={handleJoinQuiz} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono"
              placeholder="ABCD123"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Joining...' : 'Join Quiz'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have a code?{' '}
            <button
              onClick={() => router.push('/create')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Create your own quiz
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}