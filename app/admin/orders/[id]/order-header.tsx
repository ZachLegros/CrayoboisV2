"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { ClientOrder, OrderStatus } from "@prisma/client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useMediaQuery } from "@/lib/hooks";
import { gtSm } from "@/lib/mediaQueries";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { setOrderStatusInDb } from "../actions";
import { toast } from "@/components/ui/use-toast";
import useAdminStore from "../../store";

export default function OrderHeader(props: { order: ClientOrder }) {
  const { order } = props;
  const router = useRouter();
  const { updateOrderStatus } = useAdminStore();

  const handleStatusChange = (status: OrderStatus) => {
    if (status === order.status) return;
    setOrderStatusInDb(order.id, status).then((success) => {
      if (success) {
        updateOrderStatus(order.id, status);
        toast({
          title: `Statut de la commande #${order.order_no} mis à jour.`,
        });
      } else {
        toast({
          title: "Erreur lors de la mise à jour du statut de la commande.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex justify-between">
      <Button onClick={() => router.push("/admin/orders")}>
        <FaChevronLeft className="mr-1" />
        Commandes
      </Button>
      <div className="flex items-center gap-3">
        Statut:
        <ComboBoxResponsive
          defaultValue={order.status}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}

const statuses = {
  [OrderStatus.pending]: "En attente",
  [OrderStatus.shipped]: "Livrée",
  [OrderStatus.cancelled]: "Annulée",
};

export function ComboBoxResponsive(props: {
  defaultValue: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
}) {
  const { defaultValue, onStatusChange } = props;
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery(gtSm);
  const [selectedStatus, setSelectedStatus] = useState(defaultValue);

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

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
            {statuses[selectedStatus]}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0" align="end">
          <StatusList
            setOpen={setOpen}
            setSelectedStatus={handleStatusChange}
            selectedStatus={selectedStatus}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[130px] justify-between"
        >
          {statuses[selectedStatus]}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t p-3">
          <StatusList
            setOpen={setOpen}
            setSelectedStatus={handleStatusChange}
            selectedStatus={selectedStatus}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
  selectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: OrderStatus) => void;
  selectedStatus: OrderStatus;
}) {
  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {Object.keys(statuses).map((status) => (
            <CommandItem
              key={status}
              value={status}
              onSelect={(value) => {
                setSelectedStatus(value as OrderStatus);
                setOpen(false);
              }}
            >
              {statuses[status as OrderStatus]}
              <CheckIcon
                className={cn(
                  "ml-auto h-4 w-4",
                  status === selectedStatus ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
