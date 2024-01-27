"use client";

import type { ClientOrder, OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { updateOrderStatusInDb } from "../actions";
import { toast } from "@/components/ui/use-toast";
import { ComboBoxResponsive } from "@/components/ComboBoxResponsive";
import useAdminStore from "../../store";

export default function OrderHeader(props: { order: ClientOrder }) {
  const { order } = props;
  const router = useRouter();
  const { updateOrderStatus } = useAdminStore();

  const handleValueChange = (value: string) => {
    const status = value as OrderStatus;
    if (status === order.status) return;
    updateOrderStatusInDb(order.id, status).then((success) => {
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
          defaultKey={order.status}
          onValueChange={handleValueChange}
          items={statuses}
        />
      </div>
    </div>
  );
}

const statuses: { [K in OrderStatus]: string } = {
  pending: "En attente",
  shipped: "Livrée",
  cancelled: "Annulée",
};
