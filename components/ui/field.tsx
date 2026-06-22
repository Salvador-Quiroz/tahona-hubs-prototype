import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FieldProps = InputProps & {
  label: string;
  helper?: string;
  error?: string;
};

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, helper, error, className, required, ...props }, ref) => {
    const reactId = React.useId();
    const fieldId = id ?? reactId;
    const helperId = `${fieldId}-helper`;
    const errorId = `${fieldId}-error`;

    return (
      <div className="space-y-2">
        <label htmlFor={fieldId} className="block text-sm font-semibold text-foreground">
          {label}
          {required ? <span className="text-danger" aria-hidden> *</span> : null}
        </label>
        <Input
          id={fieldId}
          ref={ref}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helper ? helperId : undefined}
          className={cn(error && "border-danger", className)}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-sm font-medium leading-5 text-danger">
            {error}
          </p>
        ) : helper ? (
          <p id={helperId} className="text-sm leading-5 text-muted-foreground">
            {helper}
          </p>
        ) : null}
      </div>
    );
  }
);
Field.displayName = "Field";
