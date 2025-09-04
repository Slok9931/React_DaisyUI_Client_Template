import * as LucideIcons from "lucide-react";
import React from "react";

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getIconComponent = (
  iconName: string,
  size: number = 20,
  className?: string
) => {
  const Icon = (LucideIcons as any)[iconName];
  const IconComponent = Icon as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return React.createElement(IconComponent, { size, className });
};

export const getAllIcons = () => {
  return Object.entries(LucideIcons).filter(
    ([name, icon]) =>
      typeof icon === "object" &&
      icon !== null &&
      "displayName" in icon &&
      typeof (icon as any).displayName === "string" &&
      name !== "createLucideIcon" &&
      name !== "Icon"
  ) as Array<[string, any]>;
};
