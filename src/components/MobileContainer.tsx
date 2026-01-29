import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="mx-auto max-w-md min-h-screen bg-background">
      {children}
    </div>
  );
}
