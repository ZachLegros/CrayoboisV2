"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cad } from "@/lib/currencyFormatter";
import { cn, dayjs, orderStatus } from "@/lib/utils";
import type { ClientOrder, OrderStatus } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from "react-icons/ti";
import useAdminStore from "../store";

export default function OrdersTable(props: { orders: ClientOrder[] }) {
  const { orders: ordersFromDb } = props;
  const router = useRouter();
  const { orders, setOrders } = useAdminStore();

  const tableDefinition = useMemo(() => {
    if (Object.keys(orders).length === 0) return { columns: [], data: [] };
    const columnHelper =
      createColumnHelper<
        Pick<
          ClientOrder,
          "order_no" | "created_at" | "payer_name" | "amount" | "status"
        >
      >();
    const columns = [
      columnHelper.accessor("order_no", {
        header: () => "#",
        cell: (props) => (
          <TableCell className="font-medium">#{props.cell.renderValue()}</TableCell>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("created_at", {
        header: () => "Date",
        cell: (props) => (
          <TableCell>
            <span className="line-clamp-2">
              {dayjs(props.cell.renderValue()).format("D MMM YYYY")}
            </span>
          </TableCell>
        ),
      }),
      columnHelper.accessor("payer_name", {
        header: () => "Nom",
        cell: (props) => (
          <TableCell className="capitalize">
            <span className="line-clamp-2">{props.getValue()}</span>
          </TableCell>
        ),
      }),
      columnHelper.accessor("amount", {
        header: () => "Total",
        cell: (props) => <TableCell>{cad(props.getValue())}</TableCell>,
        enableSorting: true,
      }),
      columnHelper.accessor("status", {
        header: () => "Statut",
        cell: (props) => (
          <TableCell className="text-right">
            {orderStatus(props.cell.renderValue() as OrderStatus)}
          </TableCell>
        ),
        meta: {
          columnStyle: "text-right",
        },
      }),
    ];

    const ordersArray = Object.keys(orders).map((orderId) => ({
      order_no: orders[orderId].order_no,
      created_at: orders[orderId].created_at,
      payer_name: orders[orderId].payer_name,
      amount: orders[orderId].amount,
      status: orders[orderId].status,
    }));

    return { columns, data: ordersArray };
  }, [orders]);

  const table = useReactTable({
    columns: tableDefinition.columns,
    data: tableDefinition.data,
    initialState: {
      sorting: [{ id: "order_no", desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (Object.keys(orders).length === 0) setOrders(ordersFromDb);
  }, [ordersFromDb]);

  if (Object.keys(orders).length === 0)
    return <Spinner className="text-primary w-10 h-10" />;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={cn(
                  header.column.columnDef.meta?.columnStyle,
                  header.column.columnDef.enableSorting ? "cursor-pointer" : null,
                )}
                onClick={(e) =>
                  header.column.columnDef.enableSorting &&
                  header.column.getToggleSortingHandler()?.(e)
                }
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.columnDef.enableSorting && (
                  <span className="ml-1">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TiArrowSortedDown className="inline-block" />
                      ) : (
                        <TiArrowSortedUp className="inline-block" />
                      )
                    ) : (
                      <TiArrowUnsorted className="inline-block" />
                    )}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow
              className="h-12 cursor-pointer"
              key={row.id}
              onClick={() => router.push(`/admin/orders/${row.id}`)}
            >
              {row
                .getVisibleCells()
                .map((cell) =>
                  flexRender(cell.column.columnDef.cell, cell.getContext()),
                )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
