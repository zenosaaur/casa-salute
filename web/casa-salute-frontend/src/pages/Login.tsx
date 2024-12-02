import React from 'react';
import { ProfileForm } from '@/components/form/login-form';
import { Toaster } from "@/components/ui/toaster";
const LoginPage: React.FC = () => {
  return (
    <div className='absolute top-0 left-0 w-full'>
      <div className='min-h-screen w-full flex justify-center items-center'>
        <ProfileForm />
        <Toaster />
      </div>
    </div>
  );
}

export default LoginPage;
