import { FC } from "react";

export const NoBackground: FC<{ color?: string }> = ({ color = "#555555" }) => (
  <svg
    className="no-background-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
  >
    <path
      d="M 0 24 l 24 -24"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
