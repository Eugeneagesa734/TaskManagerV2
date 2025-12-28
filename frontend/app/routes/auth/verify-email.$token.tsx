import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { CheckCircle, Loader, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerifyEmailMutation } from '@/hooks/use-auth';

const VerifyEmail = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { mutate, isPending } = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      return;
    }

    mutate(
      { token },
      {
        onSuccess: () => {
          setVerificationStatus('success');
        },
        onError: (error) => {
          setVerificationStatus('error');
          console.error('Verification error:', error);
        },
      }
    );
  }, [token, mutate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Verify Email</h1>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            {verificationStatus === 'loading' ? (
              <>
                <Loader className="w-12 h-12 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500 text-center">
                  Please wait while we verify your email address.
                </p>
              </>
            ) : verificationStatus === 'success' ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500 text-center">
                  Your email has been verified successfully!
                </p>
                <Link to="/sign-in" className="mt-4">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500" />
                <h3 className="text-lg font-semibold">Verification Failed</h3>
                <p className="text-sm text-gray-500 text-center">
                  Email verification failed. Please try again.
                </p>
                <Link to="/sign-in" className="mt-4">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;