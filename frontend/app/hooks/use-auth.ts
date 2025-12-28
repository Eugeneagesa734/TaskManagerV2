import { useMutation } from '@tanstack/react-query';
import { postData } from '../lib/fetch-util';
import type { SignupFormData } from '../routes/auth/sign-up';

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { confirmPassword, ...signupData } = data;
      return postData('/auth/register', signupData);
    },
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return postData('/auth/login', data);
    },
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: { token: string }) => {
      return postData('/auth/verify-email', data);
    },
  });
};