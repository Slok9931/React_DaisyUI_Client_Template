import React from "react";
import { Infinity } from "lucide-react";

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
        <Infinity size={size} className={`${className}text-primary`} />
      </div>
      <Infinity size={size} className={`${className}relative text-primary drop-shadow-2xl`} />
    </>
  );
};
