import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  uniColor = true,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("text-foreground h-5 w-full", className)}
      viewBox="0 0 512 822"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="562.166"
        height="160.619"
        rx="80.3094"
        transform="matrix(0.707106 -0.707107 0.707106 0.707107 0 397.512)"
        fill={uniColor ? "currentColor" : "url(#paint_vector_1)"}
      />
      <rect
        width="562.166"
        height="160.619"
        rx="80.3094"
        transform="matrix(0.707106 -0.707107 0.707106 0.707107 0.914062 707.826)"
        fill={uniColor ? "currentColor" : "url(#paint_vector_2)"}
      />
      <defs>
        <linearGradient
          id="paint_vector_1"
          x1="281.083"
          y1="0"
          x2="281.083"
          y2="160.619"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
        <linearGradient
          id="paint_vector_2"
          x1="281.083"
          y1="0"
          x2="281.083"
          y2="160.619"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoIcon = ({
  className,
  uniColor = true,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 512 822"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="562.166"
        height="160.619"
        rx="80.3094"
        transform="matrix(0.707106 -0.707107 0.707106 0.707107 0 397.512)"
        fill={uniColor ? "currentColor" : "url(#paint_vector_icon_1)"}
      />
      <rect
        width="562.166"
        height="160.619"
        rx="80.3094"
        transform="matrix(0.707106 -0.707107 0.707106 0.707107 0.914062 707.826)"
        fill={uniColor ? "currentColor" : "url(#paint_vector_icon_2)"}
      />
      <defs>
        <linearGradient
          id="paint_vector_icon_1"
          x1="281.083"
          y1="0"
          x2="281.083"
          y2="160.619"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
        <linearGradient
          id="paint_vector_icon_2"
          x1="281.083"
          y1="0"
          x2="281.083"
          y2="160.619"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};
