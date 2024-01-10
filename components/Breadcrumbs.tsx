"use client";

import { Breadcrumbs as BreadcrumbsWrapper, BreadcrumbItem } from "@nextui-org/react";

export function Breadcrumbs(props: {
  steps: string[];
  currentStep: number;
  onAction?: (stepIndex: number) => void;
}) {
  const { steps, currentStep, onAction } = props;

  return (
    <BreadcrumbsWrapper
      size="lg"
      variant="solid"
      radius="md"
      color="foreground"
      classNames={{
        list: "border bg-background dark:bg-slate-800 dark:border-none",
      }}
      onAction={(key) => onAction?.(parseInt(key as string))}
    >
      {steps.map((step, index) => {
        const isCurrent = currentStep === index;
        const isDisabled = index > currentStep;
        return (
          <BreadcrumbItem
            key={index}
            isCurrent={isCurrent}
            underline={!isCurrent && !isDisabled ? "always" : "none"}
            isDisabled={index > currentStep}
          >
            {step}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbsWrapper>
  );
}
