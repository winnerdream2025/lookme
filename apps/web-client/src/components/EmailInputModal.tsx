'use client';

import { useState } from 'react';

interface EmailInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  platformName: string;
}

/**
 * Email Input Modal for Review Tasks
 * 
 * Prompts worker to enter the email account they'll use for the review.
 * Required for anti-fraud: prevents same email from reviewing same business twice.
 */
export function EmailInputModal({ isOpen, onClose, onSubmit, platformName }: EmailInputModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Check if it looks like a real email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    onSubmit(email);
    setEmail('');
    setError('');
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-lg font-bold mb-2">Email Account Required</h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Enter the email account you will use to post this review on <strong>{platformName}</strong>.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800">
            <strong>Why we need this:</strong> This prevents duplicate reviews from the same email account.
            {platformName.toLowerCase().includes('google') && ' Google tracks email accounts and will delete duplicate reviews.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="your.email@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}
          
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
