import { RiCloseLine } from "@remixicon/react";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Input } from "./input";

export interface ClearableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const ClearableInput = forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          value={value}
          className={cn("pr-8", className)}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <RiCloseLine className="h-8 w-8 opacity-30" />
            <span className="sr-only">Clear input</span>
          </button>
        )}
      </div>
    );
  }
);
ClearableInput.displayName = "ClearableInput";

export { ClearableInput };
