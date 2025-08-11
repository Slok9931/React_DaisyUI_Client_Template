import { getIconComponent } from "@/utils/utilityFunction";
import React from "react";

interface InfinityLogoProps {
  size?: number;
  className?: string;
}

export const InfinityLogo: React.FC<InfinityLogoProps> = ({
  size = 120,
  className = "",
}) => {

  return (
    <>
      <div className="absolute inset-0 blur-2xl opacity-30">
        {getIconComponent("Infinity", size, `${className}text-primary`)}

      </div>
      {getIconComponent("Infinity", size, `${className}relative text-primary drop-shadow-2xl`)}
    </>
  );
};
