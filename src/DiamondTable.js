import { flexRender } from "@tanstack/react-table";

function DiamondTablePagination({ table }) {
  return (
    <div className="pagination">
      <button
        className="border p-2"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Prev Page
      </button>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
      <button
        onClick={() => table.nextPage()}
        className="border p-2"
        disabled={!table.getCanNextPage()}
      >
        Next Page
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(e.target.value)}
      >
        {[10, 20, 30, 40, 50].map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );
}

const headerSortClick = (value, sorting, setSorting) => {
  if (value === "Video") return;
  const currentSort = sorting[0].id;
  const currentDesc = sorting[0].desc;
  if (currentSort === value) {
    setSorting([
      {
        id: value,
        desc: !currentDesc,
      },
    ]);
  } else {
    setSorting([
      {
        id: value,
        desc: false,
      },
    ]);
  }
};

export default function DiamondTable({ table, sorting }) {
  return (
    <div>
      <table style={{ marginTop: "40px" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={() => {
                    headerSortClick(header.id, sorting, table.setSorting);
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <DiamondTablePagination table={table} />
    </div>
  );
}
