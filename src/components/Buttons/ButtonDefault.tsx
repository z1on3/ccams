import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  link?: string;
  customClasses?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const ButtonDefault: React.FC<ButtonPropTypes> = ({
  label,
  link,
  customClasses = "",
  children,
  onClick,
}) => {
  // Conditional rendering: if `link` is provided, use `<Link>`, otherwise use `<button>`
  if (link) {
    return (
      <Link
        href={link}
        className={`inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 ${customClasses}`}
      >
        {children}
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 ${customClasses}`}
    >
      {children}
      {label}
    </button>
  );
};

export default ButtonDefault;
