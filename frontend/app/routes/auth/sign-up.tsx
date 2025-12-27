import { signUpSchema } from '@/lib/schema';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useSignUpMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

export type SignupFormData = z.infer<typeof signUpSchema>

// CRITICAL: This prevents server-side rendering
export const clientLoader = async () => {
  return null;
};

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignupFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Email verification required", {
          description: "Please check your email to verify your account before signing in.",
        });
        form.reset();
        navigate("/sign-in");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Create an account to continue</CardDescription>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel> 
                    <FormControl>
                      <input type="text" placeholder="Eugene Doe" {...field} />            
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
                    <FormLabel>Password</FormLabel> 
                    <FormControl>
                      <input type="password" placeholder="********" {...field} />            
                    </FormControl> 
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel> 
                    <FormControl>
                      <input type="password" placeholder="********" {...field} />            
                    </FormControl> 
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className='flex items-center justify-center mt-6 w-full'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{" "}
              <Link to="/sign-in" className='text-blue-600 hover:underline'>
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp;