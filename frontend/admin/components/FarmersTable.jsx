import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search, ShieldCheck, UserCheck, UserX, UsersRound } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import Field, { CONTROL } from "../../shared/ui/Field";
import { Table, THead, TH, TBody, TR, TD } from "../../shared/ui/Table";
import { userStatusTone } from "../../shared/status";
import { cn } from "../../src/lib/utils";

const STATUS_OPTIONS = ["Active", "Pending", "Suspended"];

/** The API stores lower-case statuses; the rows show them title-cased. */
const API_STATUS = { Active: "active", Pending: "pending", Suspended: "suspended" };

function SortToggle({ label, active, dir, onClick }) {
  const Icon = dir === 1 ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 uppercase tracking-wider transition-colors duration-150 hover:text-foreground"
      aria-label={`Sort by ${label}`}
    >
      {label}
      {active && <Icon size={13} aria-hidden="true" />}
    </button>
  );
}

export default function FarmersTable({ users, onStatus, busyId }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: "name", dir: 1 });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users
      .filter(
        (u) =>
          (status === "All" || u.status === status) &&
          (!term ||
            u.name.toLowerCase().includes(term) ||
            u.county.toLowerCase().includes(term)),
      )
      .sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        return (
          (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir
        );
      });
  }, [users, q, status, sort]);

  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <UsersRound size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle>Farmers management</CardTitle>
            <CardSubtitle>
              {users.length} accounts · approve, suspend or reactivate a farmer
            </CardSubtitle>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Search" id="admin-farmer-search" className="w-full sm:w-56">
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="admin-farmer-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name or county"
                className={cn(CONTROL, "pl-9")}
              />
            </div>
          </Field>

          <Field label="Status" id="admin-farmer-status" className="w-full sm:w-40">
            <select
              id="admin-farmer-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={cn(CONTROL, "cursor-pointer")}
            >
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </CardHeader>

      <CardBody className="p-0 sm:p-0">
        {rows.length ? (
          <Table>
            <THead>
              <tr>
                <TH>
                  <SortToggle
                    label="Farmer"
                    active={sort.key === "name"}
                    dir={sort.dir}
                    onClick={() => sortBy("name")}
                  />
                </TH>
                <TH>
                  <SortToggle
                    label="County"
                    active={sort.key === "county"}
                    dir={sort.dir}
                    onClick={() => sortBy("county")}
                  />
                </TH>
                <TH align="right">
                  <SortToggle
                    label="Farms"
                    active={sort.key === "farms"}
                    dir={sort.dir}
                    onClick={() => sortBy("farms")}
                  />
                </TH>
                <TH align="right">
                  <SortToggle
                    label="Harvest (t)"
                    active={sort.key === "tons"}
                    dir={sort.dir}
                    onClick={() => sortBy("tons")}
                  />
                </TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </tr>
            </THead>
            <TBody>
              {rows.map((u) => (
                <TR key={u.id}>
                  <TD>
                    <strong className="block truncate font-bold text-foreground">{u.name}</strong>
                    <small className="block truncate text-[11px] font-medium text-muted-foreground">
                      Joined {u.joined}
                    </small>
                  </TD>
                  <TD className="font-medium text-foreground/80">{u.county}</TD>
                  <TD align="right" className="font-semibold tabular">
                    {u.farms}
                  </TD>
                  <TD align="right" className="font-semibold tabular">
                    {u.tons.toFixed(1)}
                  </TD>
                  <TD>
                    <Badge tone={userStatusTone(u.status)} dot>
                      {u.status}
                    </Badge>
                  </TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-2">
                      {u.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={UserCheck}
                          loading={busyId === `user:${u.id}`}
                          onClick={() => onStatus(u, API_STATUS.Active)}
                        >
                          Approve
                        </Button>
                      )}
                      {u.status === "Active" && (
                        <Button
                          size="sm"
                          variant="danger"
                          icon={UserX}
                          loading={busyId === `user:${u.id}`}
                          onClick={() => onStatus(u, API_STATUS.Suspended)}
                        >
                          Suspend
                        </Button>
                      )}
                      {u.status === "Suspended" && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon={ShieldCheck}
                          loading={busyId === `user:${u.id}`}
                          onClick={() => onStatus(u, API_STATUS.Active)}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        ) : (
          <div className="p-5">
            <EmptyState
              compact
              icon={UsersRound}
              title="No farmers match your filters"
              text="Clear the search or pick a different status to see the rest of the accounts."
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
