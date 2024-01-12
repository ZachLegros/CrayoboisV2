"use client";

import { cn } from "@/lib/utils";
import { FaChevronRight as ChevronRight } from "react-icons/fa";

export function Breadcrumbs(props: {
  steps: string[];
  currentStep: number;
  onAction?: (stepIndex: number) => void;
  className?: string;
}) {
  const { steps, currentStep, onAction, className } = props;

  return (
    <ol
      className={cn(
        "bg-card border h-8 w-max px-3 flex items-center rounded-md",
        className
      )}
    >
      {steps.map((step, index) => (
        <li key={index}>
          <div className="relative flex items-center">
            {index !== 0 && (
              <div
                className="flex-shrink-0 w-9 rounded-full flex items-center justify-center bg-primary-600 text-foreground"
                aria-hidden="true"
              >
                <span className="mx-2 opacity-50">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div
                className="text-foreground text-sm font-medium data-[previous=true]:underline data-[previous=true]:cursor-pointer data-[next=true]:opacity-50 truncate"
                aria-current={index === currentStep ? "page" : undefined}
                data-previous={index < currentStep}
                data-next={index > currentStep}
                onClick={() => {
                  if (index < currentStep && onAction) {
                    onAction(index);
                  }
                }}
              >
                {step}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
