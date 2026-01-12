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

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return postData('/auth/login', data);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {email: string }) =>
      postData("/auth/reset-password-request", data),
  });
}

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: { token: string }) => {
      return postData('/auth/verify-email', data);
    },
  });
};

