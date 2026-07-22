import React from 'react';
import Preloader from './Preloader';

interface GlobalLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading, onComplete }) => {
  if (!isLoading) return null;

  return <Preloader onComplete={onComplete} />;
};

export { default as Preloader } from './Preloader';

