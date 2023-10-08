import React from 'react';
import { NotificationProvider } from './NotificationContext';
import { AuthenticationProvider } from './AuthenticationContext';
import { ToursProvider } from './ToursContext';

type Props = {
  children: React.ReactNode;
};
export default function Providers({ children }: Props) {
  return (
    <NotificationProvider>
      <AuthenticationProvider>
        <ToursProvider>{children}</ToursProvider>
      </AuthenticationProvider>
    </NotificationProvider>
  );
}
