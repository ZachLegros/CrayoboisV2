"use client";

import ImageWithLoading from "@/components/ImageWithLoading";
import SortToggle from "@/components/SortToggle";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { cad } from "@/lib/currencyFormatter";
import { cn } from "@/lib/utils";
import type { Hardware } from "@prisma/client";
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
import useAdminStore from "../store";

export default function HardwaresTable(props: { hardwares: Hardware[] }) {
  const { hardwares: hardwaresFromDb } = props;
  const { hardwares, setHardwares, updateHardware } = useAdminStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(hardwares).length === 0) setHardwares(hardwaresFromDb);
  }, [hardwaresFromDb]);

  const tableDefinition = useMemo(() => {
    if (Object.keys(hardwares).length === 0) return { columns: [], data: [] };
    const columnHelper =
      createColumnHelper<
        Pick<
          Hardware,
          "id" | "name" | "price" | "quantity" | "enabled" | "image" | "color"
        >
      >();
    const columns = [
      columnHelper.accessor("id", {
        enableHiding: true,
      }),
      columnHelper.accessor("image", {
        header: () => "Image",
        cell: (props) => (
          <TableCell className="font-medium">
            <ImageWithLoading
              width={100}
              height={100}
              src={props.cell.getContext().row.getValue("image")}
              alt={props.cell.getContext().row.getValue("name")}
              className="rounded-md w-[75px] sm:w-[100px]"
            />
          </TableCell>
        ),
        meta: {
          columnStyle: "w-[75px] sm:w-[100px]",
        },
      }),
      columnHelper.accessor("name", {
        header: () => "Nom",
        cell: (props) => (
          <TableCell>
            <span className="line-clamp-3">{props.cell.renderValue()}</span>
          </TableCell>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("color", {
        header: () => "Couleur",
        cell: (props) => <TableCell>{props.cell.renderValue()}</TableCell>,
        enableSorting: true,
      }),
      columnHelper.accessor("price", {
        header: () => "Prix",
        cell: (props) => <TableCell>{cad(props.getValue())}</TableCell>,
        enableSorting: true,
      }),
      columnHelper.accessor("quantity", {
        header: () => "Quantité",
        cell: (props) => (
          <TableCell
            className={cn(
              "text-right font-semibold",
              props.getValue() > 0 ? "text-foreground" : "text-red-500",
            )}
          >
            {props.getValue()}
          </TableCell>
        ),
        enableSorting: true,
        meta: {
          columnStyle: "text-right max-w-[120px]",
        },
      }),
      columnHelper.accessor("enabled", {
        header: () => "Activé",
        cell: (props) => (
          <TableCell className="text-right">
            <Switch
              checked={props.getValue()}
              onCheckedChange={(checked) => {
                updateHardware(props.row.getValue("id"), "enabled", checked).then(
                  (success) => {
                    if (!success) {
                      toast({
                        title: "Une erreur est survenue",
                        variant: "destructive",
                      });
                    }
                  },
                );
              }}
              onClick={(e) => e.stopPropagation()}
              className="border"
            />
          </TableCell>
        ),
        enableSorting: true,
        meta: {
          columnStyle: "text-right",
        },
      }),
    ];

    const hardwaresArray = Object.keys(hardwares).map((materialId) => ({
      image: hardwares[materialId].image,
      name: hardwares[materialId].name,
      color: hardwares[materialId].color,
      price: hardwares[materialId].price,
      quantity: hardwares[materialId].quantity,
      enabled: hardwares[materialId].enabled,
      id: materialId,
    }));

    return { columns, data: hardwaresArray };
  }, [hardwares]);

  const table = useReactTable({
    columns: tableDefinition.columns,
    data: tableDefinition.data,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnVisibility: { id: false },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
                  <SortToggle sort={header.column.getIsSorted()} className="ml-1" />
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
              onClick={() => router.push(`/admin/hardwares/${row.getValue("id")}`)}
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
