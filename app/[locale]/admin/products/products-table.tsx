"use client";

import ImageWithLoading from "@/components/ImageWithLoading";
import SortToggle from "@/components/SortToggle";
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
import type { Product } from "@prisma/client";
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

export default function ProductsTable(props: { products: Product[] }) {
  const { products: productsFromDb } = props;
  const { products, setProducts, updateProduct } = useAdminStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(products).length === 0) setProducts(productsFromDb);
  }, [productsFromDb]);

  const tableDefinition = useMemo(() => {
    if (Object.keys(products).length === 0) return { columns: [], data: [] };
    const columnHelper =
      createColumnHelper<
        Pick<Product, "id" | "name" | "price" | "quantity" | "image">
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
          columnStyle: "text-right",
        },
      }),
      columnHelper.accessor("price", {
        header: () => "Prix",
        cell: (props) => (
          <TableCell className="text-right">{cad(props.getValue())}</TableCell>
        ),
        enableSorting: true,
        meta: {
          columnStyle: "text-right",
        },
      }),
    ];

    const productsArray = Object.keys(products).map((productId) => ({
      image: products[productId].image,
      name: products[productId].name,
      price: products[productId].price,
      quantity: products[productId].quantity,
      id: productId,
    }));

    return { columns, data: productsArray };
  }, [products]);

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
              onClick={() => router.push(`/admin/products/${row.getValue("id")}`)}
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
