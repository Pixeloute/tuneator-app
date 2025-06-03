import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle } from "lucide-react";

const SpotifyCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Spotify authorization...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Spotify authorization failed: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        // Send success message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'SPOTIFY_OAUTH_SUCCESS',
            code,
            state
          }, window.location.origin);
          
          setStatus('success');
          setMessage('Authorization successful! You can close this window.');
          
          // Auto-close after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          throw new Error('No parent window found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'SPOTIFY_OAUTH_ERROR',
            error: errorMessage
          }, window.location.origin);
        }
        
        setStatus('error');
        setMessage(errorMessage);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'processing' && <Spinner className="h-5 w-5" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            Spotify Authorization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{message}</p>
          {status === 'error' && (
            <div className="mt-4">
              <button 
                onClick={() => window.close()} 
                className="text-sm text-primary hover:underline"
              >
                Close window
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotifyCallback; 