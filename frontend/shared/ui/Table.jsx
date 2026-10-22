import { cn } from "../../src/lib/utils";

/**
 * Table primitives. The four portals each had their own table styling, which
 * made the admin tables and the farmer market tables look like different
 * products. These give one header, row and cell treatment.
 */
export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className={cn("w-full border-collapse text-left", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...props }) {
  return (
    <thead
      className={cn("border-b border-border bg-muted/60 text-[11px] font-bold uppercase tracking-wider text-muted-foreground", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TH({ className, align = "left", children, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 font-bold whitespace-nowrap first:pl-5 last:pr-5",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TBody({ className, children, ...props }) {
  return (
    <tbody className={cn("divide-y divide-border/70", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TR({ className, children, ...props }) {
  return (
    <tr
      className={cn("transition-colors duration-150 hover:bg-muted/50", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TD({ className, align = "left", children, ...props }) {
  return (
    <td
      className={cn(
        "px-4 py-3.5 text-sm text-foreground/90 first:pl-5 last:pr-5",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

/**
 * Column-driven table. `columns` is [{ key, header, align, render(row) }]
 * and `rows` is the data array.
 */
export function DataTable({ columns, rows, rowKey = (row, i) => row.id ?? i, empty, className }) {
  if (!rows?.length) {
    return empty ?? null;
  }
  return (
    <Table className={className}>
      <THead>
        <tr>
          {columns.map((c) => (
            <TH key={c.key} align={c.align}>
              {c.header}
            </TH>
          ))}
        </tr>
      </THead>
      <TBody>
        {rows.map((row, i) => (
          <TR key={rowKey(row, i)}>
            {columns.map((c) => (
              <TD key={c.key} align={c.align} className={c.cellClassName}>
                {c.render ? c.render(row, i) : row[c.key]}
              </TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}

export default Table;
