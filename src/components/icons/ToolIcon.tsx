import React from 'react';
import { 
  Calculator, 
  Percent, 
  Divide, 
  Plus, 
  Minus, 
  LandPlot,
  Circle,
  Coins,
  Banknote,
  Wallet,
  Car,
  Home,
  GraduationCap,
  Award,
  ScrollText,
  HeartPulse,
  Activity,
  Scale,
  Hash,
  Sigma,
  PieChart
} from 'lucide-react';

interface ToolIconProps {
  name?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className, size = 24, strokeWidth = 2 }) => {
  const icons: Record<string, React.ElementType> = {
    'toplama': Plus,
    'cikarma': Minus,
    'alan': LandPlot,
    'altin-oran': Hash,
    'asal': Sigma,
    'faiz': PieChart,
    'ihtiyac': Wallet,
    'konut': Home,
    'tasit': Car,
    'kdv': Coins,
    'maas': Banknote,
    'sinav': ScrollText,
    'takdir': Award,
    'not': GraduationCap,
    'vki': Scale,
    'kalori': Activity,
    'hesap-makinesi': Calculator,
    'yuzde': Percent,
    'bolme': Divide,
  };

  const IconComponent = name && icons[name] ? icons[name] : Calculator; // Varsayılan ikon: Calculator

  return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />;
};
