"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { gtSm } from "@/lib/mediaQueries";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";

export function ComboBoxResponsive(props: {
  items: { [key: string]: string };
  defaultKey?: string;
  onValueChange?: (value: string) => void;
}) {
  const { items, defaultKey, onValueChange } = props;
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery(gtSm);
  const [selectedKey, setSelectedKey] = useState(
    defaultKey ?? Object.keys(items)[0],
  );

  const itemsList = useMemo(() => {
    const handleValueChange = (value: string) => {
      setSelectedKey(value);
      onValueChange?.(value);
    };
    return Object.keys(items).map((key) => (
      <CommandItem
        key={key}
        value={key}
        onSelect={(value) => {
          handleValueChange(value);
          setOpen(false);
        }}
      >
        {items[key]}
        <CheckIcon
          className={cn(
            "ml-auto h-4 w-4",
            key === selectedKey ? "opacity-100" : "opacity-0",
          )}
        />
      </CommandItem>
    ));
  }, [items, onValueChange, selectedKey]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[130px] justify-between"
          >
            {items[selectedKey]}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0" align="end">
          <Command>
            <CommandList>
              <CommandGroup>{itemsList}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          {items[selectedKey]}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t p-3">
          <Command>
            <CommandList>
              <CommandGroup>{itemsList}</CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
