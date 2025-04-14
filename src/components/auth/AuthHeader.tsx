
import React from "react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold gradient-text">Tuneator</h1>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
};
