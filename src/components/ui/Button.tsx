import React from "react";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Canonical button. Variants and treatment live in ./buttonStyles. */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "standard", size = "sm", className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={buttonClasses(variant, size, className)}
        {...rest}
      />
    );
  },
);

export default Button;
