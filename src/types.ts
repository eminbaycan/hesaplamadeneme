import React from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  keywords: string[];
  icon?: string; // Using string to map to Lucide icons later, or React component
  path: string;
  component?: React.LazyExoticComponent<React.FC> | React.FC;
  addedAt?: string;
  updatedAt?: string;
  version?: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}
