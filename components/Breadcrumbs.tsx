"use client";

import { Fragment } from "react";
import { FaChevronRight as ChevronRight } from "react-icons/fa";

export function Breadcrumbs(props: {
  steps: string[];
  currentStep: number;
  onAction?: (stepIndex: number) => void;
  className?: string;
}) {
  const { steps, currentStep, onAction, className } = props;

  return (
    <ol className={className}>
      {steps.map((step, index) => {
        const separator = index !== 0 && (
          <li className="mx-2 opacity-50">
            <ChevronRight className="h-4 w-4" />
          </li>
        );
        return (
          <Fragment key={step}>
            {separator}
            <li
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
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
