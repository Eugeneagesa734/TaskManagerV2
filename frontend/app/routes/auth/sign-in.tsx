import { signInSchema } from '@/lib/schema';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useLoginMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type SigninFormData = z.infer<typeof signInSchema>

const SignIn = () => {
  const navigate = useNavigate();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();

  const handleOnSubmit = (values: SigninFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        console.log(data);
        toast.success('Login successful!');
        navigate("/dashboard");
      },
      onError: (error:any) => {
        const errorMessage =  error.response?.data?.message || 'An error occurred during login.';
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Sign In To your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel> 
                    <FormControl>
                      <input type="email" placeholder="email@example.com" {...field} />            
                    </FormControl> 
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel> 
                      <Link to="/forgot-password" className="text-sm text-blue-600 float-right hover:underline">Forgot password?</Link>
                    </div>
                    <FormControl>
                      <input type="password" placeholder="********" {...field} />            
                    </FormControl> 
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2" /> : "Sign In"}
              </Button>
            </form>
          </Form>
          <CardFooter className="flex items-center justify-center mt-6">
            <div className='flex items-center justify-canter'>
              <p className='text-sm text-muted-foreground' >
                Don&apos;t have an account?{" "}
                <Link to="/sign-up" className='text-blue-600'>Sign up</Link>
              </p>

            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn;