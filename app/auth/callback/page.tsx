'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '../../../src/lib/supabase';
import { Compass, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Validates the redirect destination to prevent open-redirect vulnerabilities.
 * Only allows safe relative paths within the YogaConnect India application.
 */
function getSafeRedirectUrl(target: string | null): string {
  if (!target) return '/';
  
  const trimmed = target.trim();
  // Must start with a single slash and must NOT start with '//' (protocol-relative) or contain schemes
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('://')) {
    return '/';
  }

  // Reject URLs containing backslashes or encoded slashes that could trick parsers
  if (trimmed.includes('\\') || trimmed.toLowerCase().includes('%2f%2f')) {
    return '/';
  }

  try {
    const dummy = new URL(trimmed, 'http://localhost');
    if (dummy.origin !== 'http://localhost') return '/';
    return dummy.pathname + dummy.search + dummy.hash;
  } catch {
    return '/';
  }
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      // 1. Check for provider-level errors (e.g. user cancelled on Google consent screen)
      const errorParam = searchParams.get('error');
      const errorDesc = searchParams.get('error_description');

      if (errorParam) {
        if (!isMounted) return;
        setStatus('error');
        if (errorParam === 'access_denied') {
          setErrorMessage('Google sign-in was cancelled or access was denied. You may try again whenever you are ready.');
        } else {
          setErrorMessage(errorDesc || `Authentication error: ${errorParam}`);
        }
        return;
      }

      // 2. Extract authorization code for PKCE exchange
      const code = searchParams.get('code');
      const nextParam = searchParams.get('next');
      const targetDestination = getSafeRedirectUrl(nextParam);

      if (code) {
        if (!isSupabaseConfigured) {
          if (!isMounted) return;
          setStatus('error');
          setErrorMessage('Supabase is not configured yet with a valid anon key in .env.local.');
          return;
        }

        try {
          // Exchange code for session using official Supabase Auth PKCE flow
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            if (!isMounted) return;
            setStatus('error');
            setErrorMessage(exchangeError.message || 'The authentication code has expired or is invalid. Please sign in again.');
            return;
          }

          if (!isMounted) return;
          setStatus('success');

          // Clean up URL to remove one-time code from browser history
          if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          // Small delay for smooth visual transition, then redirect
          setTimeout(() => {
            router.replace(targetDestination);
          }, 800);
        } catch (err: any) {
          if (!isMounted) return;
          setStatus('error');
          setErrorMessage(err.message || 'Failed to exchange authorization code.');
        }
        return;
      }

      // 3. Fallback: check if an active session already exists or implicit hash was handled
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!isMounted) return;
          setStatus('success');
          setTimeout(() => {
            router.replace(targetDestination);
          }, 600);
          return;
        }
      } catch {
        // Continue to error fallback below
      }

      // 4. No code, no error, and no active session
      if (!isMounted) return;
      setStatus('error');
      setErrorMessage('No valid authentication code was detected. Please initiate sign in from the login button.');
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E5DD] shadow-xl p-8 text-center space-y-6 animate-in fade-in duration-300">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E6EDE2] text-[#263D32] flex items-center justify-center border border-[#A5B89A]/40 shadow-xs">
          <Compass className="w-8 h-8 text-[#536B50]" />
        </div>

        {/* State: Loading */}
        {status === 'loading' && (
          <div className="space-y-3">
            <div className="w-8 h-8 border-3 border-[#536B50]/20 border-t-[#536B50] rounded-full animate-spin mx-auto" />
            <h1 className="font-serif font-bold text-2xl text-[#263D32]">
              Verifying Google Sign-In
            </h1>
            <p className="text-xs text-[#59665C] max-w-xs mx-auto leading-relaxed">
              Completing your secure authentication with YogaConnect India. Connecting to your sanctuary profile...
            </p>
          </div>
        )}

        {/* State: Success */}
        {status === 'success' && (
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E6EDE2] text-[#286749] flex items-center justify-center mx-auto border border-[#286749]/30">
              <CheckCircle2 className="w-6 h-6 text-[#286749]" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#263D32]">
              Welcome to YogaConnect
            </h1>
            <p className="text-xs text-[#59665C] max-w-xs mx-auto">
              Your session is active. Redirecting you to your destination now...
            </p>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#FEF3F2] text-[#B42318] flex items-center justify-center mx-auto border border-[#FECDCA]">
              <AlertCircle className="w-6 h-6 text-[#B42318]" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-[#263D32]">
                Authentication Incomplete
              </h1>
              <p className="text-xs text-[#59665C] mt-1.5 leading-relaxed bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD] text-left">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => router.replace('/login')}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>Try Signing In Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => router.replace('/')}
                className="w-full bg-white hover:bg-[#F7F5EE] text-[#59665C] hover:text-[#263D32] border border-[#E2E5DD] font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="pt-4 border-t border-[#E2E5DD] text-[11px] text-[#8E9B91] flex items-center justify-center space-x-1.5">
          <span>Protected by Supabase Auth &amp; Google OAuth</span>
        </div>

      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-[#536B50]/20 border-t-[#536B50] rounded-full animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
