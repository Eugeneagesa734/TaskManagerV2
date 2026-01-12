import { resetPasswordSchema } from '@/lib/schema';
import { z } from 'zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log(data);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-2xl font-bold'>Reset Password</h1>
          <p className='text-muted-foreground text-center'>Enter your new password below.</p>
        </div>
        <Card>
          <CardHeader>
            <Link to="/sign-in" className='flex items-center gap-2'>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
            </Link>

          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default ResetPassword;
