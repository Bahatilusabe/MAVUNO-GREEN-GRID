import { titleStatus } from "../shared/status";

/**
 * The API and the sample fixtures describe the same records with different
 * field names (`kg` vs `tons`, `createdAt` vs `joined`, lowercase vs title
 * case status). The console renders one shape, so every panel stays in step
 * when the live feed replaces the sample data.
 */
export function shapeUser(user) {
  const kg = user.kg ?? null;
  return {
    id: user.id,
    name: user.name || "Unnamed farmer",
    email: user.email || "",
    // The API returns every account on the platform; the farmer table only
    // shows farmers, and the partner accounts are offered as link targets.
    role: user.role || "farmer",
    county: user.county || "—",
    farms: Number(user.farms || 0),
    // The API reports expected crop in kilograms, the fixtures in tonnes.
    tons: kg != null ? Number(kg) / 1000 : Number(user.tons || 0),
    status: titleStatus(user.status || "pending"),
    joined: user.createdAt || user.joined || "—",
  };
}

export function shapePartner(partner) {
  return {
    id: partner.id,
    name: partner.name || "Unnamed partner",
    type: partner.type || "Partner",
    county: partner.county || "—",
    email: partner.userEmail || "",
    // The account that signs in for this partner. Without one the partner
    // cannot see the request inbox, so the console links them explicitly.
    userId: partner.userId ?? null,
    userEmail: partner.userEmail || "",
    status: titleStatus(partner.status || "pending"),
    requests: Number(partner.requests || 0),
    pendingRequests: Number(partner.pendingRequests || 0),
  };
}
