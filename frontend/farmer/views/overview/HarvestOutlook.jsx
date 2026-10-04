import { TrendingUp } from "lucide-react";
import { HarvestChart } from "../../../shared/charts";
import { OUTLOOK } from "./data";

export default function HarvestOutlook() {
  return (
    <section className="card">
      <h3 className="ov-title"><TrendingUp aria-hidden="true" size={18} /> Harvest Outlook</h3>
      <HarvestChart {...OUTLOOK} height={210} />
    </section>
  );
}