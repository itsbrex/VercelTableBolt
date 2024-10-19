import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIIcon } from './ai-icon';
import { useToast } from '@/hooks/use-toast';
import { getApiKey } from '@/lib/api-key-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InsightsEditor } from './insights-editor';

type DataItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  insights: string;
};

const initialData: DataItem[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer', insights: '' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', insights: '' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', insights: '' },
];

export function DataTable() {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedContact, setSelectedContact] = useState<DataItem | null>(null);
  const { toast } = useToast();

  const columns: ColumnDef<DataItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => setSelectedContact(row.original)}>
              <AIIcon className="mr-2 h-4 w-4" />
              View Insights
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] w-[90vw]">
            <DialogHeader>
              <DialogTitle>Insights for {row.getValue('name')}</DialogTitle>
            </DialogHeader>
            <InsightsEditor
              contact={row.original}
              onSave={(updatedInsights) => handleSaveInsights(row.original.id, updatedInsights)}
            />
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleSaveInsights = (contactId: string, updatedInsights: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === contactId ? { ...item, insights: updatedInsights } : item
      )
    );
    toast({
      title: "Insights Saved",
      description: "The contact's insights have been updated successfully.",
    });
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}