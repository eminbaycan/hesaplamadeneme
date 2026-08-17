import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { tools } from '../data/tools';
import { Tool } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRecentTools = (): Tool[] => {
  const recentIds = JSON.parse(localStorage.getItem('recentTools') || '[]');
  return recentIds
    .map((id: string) => tools.find(t => t.id === id))
    .filter((t: Tool | undefined): t is Tool => !!t);
};

export const addRecentTool = (toolId: string) => {
  const recentIds = JSON.parse(localStorage.getItem('recentTools') || '[]');
  const newIds = [toolId, ...recentIds.filter((id: string) => id !== toolId)].slice(0, 3);
  localStorage.setItem('recentTools', JSON.stringify(newIds));
};
