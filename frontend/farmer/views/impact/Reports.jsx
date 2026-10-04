import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { REPORTS } from "./data";

export default function Reports() {
  return (
    <section className="card">
      <h3>Impact Certificates / Reports</h3>
      <div className="pg-reports">
        {REPORTS.map((r) => (
          <div key={r.id} className="pg-report">
            <div className="pg-cell">
              <span className="pg-mini"><FileText size={16} aria-hidden="true" /></span>
              <div><strong>{r.title}</strong><small>{r.sub}</small></div>
            </div>
            <small>{r.size}</small>
            <button className="btn btn-sm" onClick={() => toast.info("Sample report: connect the backend to generate PDFs")}>
              <Download size={14} aria-hidden="true" /> Download
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}