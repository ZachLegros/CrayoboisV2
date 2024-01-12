"use client";

import CheckButton from "@/components/CheckButton";
import { ReactNode } from "react";
import { UnmountClosed as Collapse } from "react-collapse";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

function CollapseRadioGroup(props: {
  filter: any;
  setFilter: (value: any) => void;
  isFilterEnabled: boolean;
  children: ReactNode;
  className?: string;
}) {
  const { filter, setFilter, isFilterEnabled, children, className } = props;
  return (
    <Collapse isOpened={isFilterEnabled}>
      <RadioGroup value={filter} onValueChange={setFilter} className={className}>
        {children}
      </RadioGroup>
    </Collapse>
  );
}

export type FilterValue = {
  value: string;
  label: string;
  amount?: number;
};

export default function Filter(props: {
  filterName: string;
  filterValues: FilterValue[];
  currentValue: string;
  setValue: (value: string) => void;
  filterEnabled: boolean;
  setFilterEnabled: (enabled: boolean) => void;
  isDisabled?: boolean;
}) {
  const {
    filterName,
    filterEnabled,
    setFilterEnabled,
    currentValue,
    filterValues,
    setValue,
    isDisabled,
  } = props;

  return (
    <div className="flex flex-col w-full bg-background border rounded-lg">
      <CheckButton
        isChecked={filterEnabled && !isDisabled}
        onClick={() => {
          setFilterEnabled(!filterEnabled);
        }}
        isDisabled={isDisabled}
      >
        {filterName}
      </CheckButton>
      <CollapseRadioGroup
        filter={currentValue}
        isFilterEnabled={filterEnabled && !isDisabled}
        setFilter={setValue}
        className="p-3"
      >
        {filterValues.map((filter, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <RadioGroupItem value={filter.value} id={filter.value} />
            <Label htmlFor={filter.value} className="cursor-pointer text-md">
              {filter.label} {filter.amount !== undefined && `(${filter.amount})`}
            </Label>
          </div>
        ))}
      </CollapseRadioGroup>
    </div>
  );
}
