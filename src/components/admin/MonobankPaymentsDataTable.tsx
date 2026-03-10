"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCheck,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  X,
} from "lucide-react";
import * as React from "react";

import { MonobankPaymentDetailsPopover } from "@/components/admin/MonobankPaymentDetailsPopover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface StatementItem {
  invoiceId?: string;
  status?: string;
  maskedPan?: string;
  date?: string;
  amount?: number;
  profitAmount?: number;
  ccy?: number;
  reference?: string;
  destination?: string;
}

function formatMoney(minorUnits?: number, ccy?: number) {
  if (typeof minorUnits !== "number") {
    return "-";
  }

  const currency = ccy === 980 ? "UAH" : ccy === 840 ? "USD" : String(ccy);
  return `${(minorUnits / 100).toFixed(2)} ${currency}`;
}

function formatShortDate(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

async function copyToClipboard(value: string) {
  if (!navigator.clipboard) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

function RowActions({ payment }: { payment: StatementItem }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <Popover open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverAnchor asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
        </PopoverAnchor>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => void copyToClipboard(payment.invoiceId ?? "")}
            >
              Copy payment ID
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setMenuOpen(false);
                setDetailsOpen(true);
              }}
            >
              View payment details
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <MonobankPaymentDetailsPopover
        invoiceId={payment.invoiceId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        hideTrigger
      />
    </Popover>
  );
}

const columns: ColumnDef<StatementItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-xs capitalize sm:text-sm">
        {row.getValue("status") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "search",
    accessorFn: (row) =>
      [
        row.invoiceId,
        row.status,
        row.maskedPan,
        row.reference,
        row.destination,
        row.date,
      ]
        .filter(Boolean)
        .join(" "),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.date;
      if (!value) {
        return <div>-</div>;
      }

      return <div className="text-xs sm:text-sm">{formatShortDate(value)}</div>;
    },
  },
  {
    accessorKey: "destination",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[8.5rem] truncate text-xs sm:max-w-72 sm:text-sm">
        {row.original.destination ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "maskedPan",
    header: "Card",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">{row.original.maskedPan ?? "-"}</div>
    ),
  },
  {
    accessorKey: "reference",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reference
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[7rem] truncate font-mono text-[11px] sm:max-w-none sm:text-xs">
        {row.original.reference ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right text-xs font-medium sm:text-sm">
        {formatMoney(row.original.amount, row.original.ccy)}
      </div>
    ),
  },
  {
    accessorKey: "profitAmount",
    header: () => <div className="text-right">Profit</div>,
    cell: ({ row }) => (
      <div className="text-right text-xs font-medium sm:text-sm">
        {formatMoney(row.original.profitAmount, row.original.ccy)}
      </div>
    ),
  },
  {
    accessorKey: "invoiceId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice ID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[7rem] truncate font-mono text-[11px] sm:max-w-none sm:text-xs">
        {row.original.invoiceId ?? "-"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return <RowActions payment={payment} />;
    },
  },
];

export function MonobankPaymentsDataTable({
  data,
  isLoading,
  onRefresh,
}: {
  data: StatementItem[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      search: false,
      profitAmount: false,
      invoiceId: false,
    });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  const filteredData = React.useMemo(() => {
    if (selectedStatuses.length === 0) {
      return data;
    }

    return data.filter(
      (row) => row.status && selectedStatuses.includes(row.status),
    );
  }, [data, selectedStatuses]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const statusOptions = React.useMemo(
    () =>
      [
        ...new Set(data.map((item) => item.status).filter(Boolean)),
      ].sort() as string[],
    [data],
  );

  const hasActiveState =
    selectedStatuses.length > 0 ||
    columnFilters.length > 0 ||
    sorting.length > 0 ||
    table.getSelectedRowModel().rows.length > 0;

  const selectedInvoiceIds = React.useMemo(
    () =>
      table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original.invoiceId)
        .filter((value): value is string => Boolean(value)),
    [table],
  );

  const successfulCount = React.useMemo(
    () => data.filter((item) => item.status === "success").length,
    [data],
  );

  const resetTable = React.useCallback(() => {
    setSorting([]);
    setColumnFilters([]);
    setSelectedStatuses([]);
    setRowSelection({});
    table.getColumn("search")?.setFilterValue("");
  }, [table]);

  return (
    <Card>
      <CardHeader className="px-3 pb-2 sm:px-6">
        <CardTitle>Payments history</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="w-full">
          <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center">
            <Input
              placeholder="Search payments..."
              value={
                (table.getColumn("search")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("search")?.setFilterValue(event.target.value)
              }
              className="h-9 md:max-w-sm"
            />

            <div className="flex flex-wrap items-center gap-1.5 md:ml-auto">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 px-3">
                      <CheckCheck />
                      Actions
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Bulk actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          void copyToClipboard(selectedInvoiceIds.join("\n"))
                        }
                      >
                        Copy selected payment IDs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRowSelection({})}>
                        Clear selection
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    Status
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Filter status</DropdownMenuLabel>
                    {statusOptions.map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        className="capitalize"
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={(value) =>
                          setSelectedStatuses((current) =>
                            value
                              ? [...new Set([...current, status])]
                              : current.filter((item) => item !== status),
                          )
                        }
                      >
                        {status}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    {table
                      .getAllColumns()
                      .filter(
                        (column) =>
                          column.getCanHide() && column.id !== "search",
                      )
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id === "profitAmount"
                              ? "profit"
                              : column.id === "maskedPan"
                                ? "card"
                                : column.id === "invoiceId"
                                  ? "invoice id"
                                  : column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-9 w-20">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={isLoading ? "animate-spin" : undefined} />
                Refresh
              </Button>

              {hasActiveState && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3"
                  onClick={resetTable}
                >
                  <X />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
            <div>Total: {data.length}</div>
            <div>Successful: {successfulCount}</div>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table className="text-xs sm:text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="h-9 px-1.5 sm:px-2"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-1.5 py-2 sm:px-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex-1 text-xs text-muted-foreground sm:text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex gap-2 self-end">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
