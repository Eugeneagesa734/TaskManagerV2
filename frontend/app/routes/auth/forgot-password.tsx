import type { z } from 'zod';
import { forgotPasswordSchema } from '@/lib/schema';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPasswordMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    // Remove this console.log or it will log multiple times during re-renders
    // console.log(data);
    
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
        toast.success('Password reset email sent successfully!');
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        console.error('Error:', error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-2xl font-bold'>Forgot Password</h1>
          <p className='text-muted-foreground text-center'>Enter your email to reset your password.</p>
        </div>
        <Card>
          <CardHeader>
            <Link to="/sign-in" className='flex items-center gap-2'>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Link>
          </CardHeader>
          <CardContent>
            {
              isSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                  <h1 className='text-2xl font-bold'>Password reset email sent</h1>
                  <p className='text-muted-foreground text-center'>Check your email for link to reset password</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      name='email'
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              placeholder="Enter your email" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type='submit' className='w-full' disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </Form>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;