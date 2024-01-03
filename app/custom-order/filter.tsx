"use client";

import CheckButton from "@/components/CheckButton";
import { Radio, RadioGroup } from "@nextui-org/react";
import { ReactNode } from "react";
import { UnmountClosed as Collapse } from "react-collapse";

function CollapseRadioGroup(props: {
  filter: any;
  setFilter: (value: any) => void;
  isFilterEnabled: boolean;
  children: ReactNode;
}) {
  const { filter, setFilter, isFilterEnabled, children } = props;
  return (
    <Collapse isOpened={isFilterEnabled}>
      <RadioGroup size="md" value={filter} onValueChange={setFilter} className="mt-2 ml-2">
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
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) {
  const { filterName, enabled, setEnabled, currentValue, filterValues, setValue } = props;

  return (
    <div className="flex flex-col w-full">
      <CheckButton
        isChecked={enabled}
        onClick={() => {
          setEnabled(!enabled);
        }}
      >
        <p className="text-xl font-bold text-gray-300">{filterName}</p>
      </CheckButton>
      <CollapseRadioGroup filter={currentValue} isFilterEnabled={enabled} setFilter={setValue}>
        {filterValues.map((filter) => (
          <Radio key={filter.value} color="primary" value={filter.value}>
            {filter.label} {filter.amount !== undefined && `(${filter.amount})`}
          </Radio>
        ))}
      </CollapseRadioGroup>
    </div>
  );
}
