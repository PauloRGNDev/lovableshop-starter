// Deleza Joias - Authentication Page
import React, { useState, useEffect } from 'react';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to home
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-luxury-gold mb-2">
            Deleza Joias
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {authMode === 'signin' ? (
          <SignIn
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setAuthMode('signup')}
          />
        ) : (
          <SignUp
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setAuthMode('signin')}
          />
        )}

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <div className="text-luxury-gold font-heading font-semibold">
            Deleza Joias
          </div>
          <p>Elegância e sofisticação em cada detalhe</p>
        </div>
      </div>
    </div>
  );
}