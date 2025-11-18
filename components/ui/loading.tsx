"use client";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Loading({ 
  text, 
  fullScreen = true, 
  size = "md" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const containerClasses = fullScreen 
    ? "flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div 
          className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-900 dark:border-gray-100 border-t-transparent mx-auto mb-4`}
          role="status"
          aria-label="Loading"
        ></div>
        {text && (
          <p className="text-muted-foreground text-sm">{text}</p>
        )}
      </div>
    </div>
  );
}
