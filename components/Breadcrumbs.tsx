"use client";

import { Breadcrumb, BreadcrumbItem } from "./ui/breadcrumbs";

export function Breadcrumbs(props: {
  steps: string[];
  currentStep: number;
  onAction?: (stepIndex: number) => void;
}) {
  const { steps } = props;

  return (
    <Breadcrumb

    // onAction={(key) => onAction?.(parseInt(key as string))}
    >
      {steps.map((step, index) => (
        <BreadcrumbItem key={index}>{step}</BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
