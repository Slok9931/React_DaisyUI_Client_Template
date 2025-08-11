import React from 'react';
import {
  LayoutDashboard,
  ShieldUser,
  GitFork,
  Users,
  Cable,
  FolderLock,
  Layers,
  Network,
  Waypoints,
  Settings,
  Home,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const iconMap: Record<string, React.ComponentType<{ size: number }>> = {
  LayoutDashboard: LayoutDashboard,
  ShieldUser: ShieldUser,
  GitFork: GitFork,
  Users: Users,
  Cable: Cable,
  FolderLock: FolderLock,
  Layers: Layers,
  Network: Network,
  Waypoints: Waypoints,
  Settings: Settings,
  Home: Home,
  FileText: FileText,
  HelpCircle: HelpCircle,
};

export const getIconComponent = (iconName: keyof typeof iconMap, size: number) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? React.createElement(IconComponent, { size }) : null;
};