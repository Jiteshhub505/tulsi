import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
  uniColor?: boolean;
}) => {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <img
        src="/tulsiveda-logo.webp"
        alt="Tulsiveda Logo"
        className={cn("h-8 w-auto object-contain", imgClassName)}
      />
    </div>
  );
};

export const LogoIcon = ({
  className,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <img
      src="/tulsiveda-logo.webp"
      alt="Tulsiveda LogoIcon"
      className={cn("h-6 w-auto object-contain", className)}
    />
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <img
      src="/tulsiveda-logo.webp"
      alt="Tulsiveda LogoStroke"
      className={cn("h-7 w-auto object-contain", className)}
    />
  );
};
