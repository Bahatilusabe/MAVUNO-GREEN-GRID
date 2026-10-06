import { FileText, Download, Award } from "lucide-react";
import { toast } from "sonner";
import { REPORTS } from "./data";

export default function Reports() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Award className="text-green-600" aria-hidden="true" size={20} /> 
          Impact Certificates / Reports
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Verified Assets
        </span>
      </div>

      {/* Reports List */}
      <div className="divide-y divide-gray-100 flex-grow">
        {REPORTS.map((r) => (
          <div key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
            {/* Title & Subtitle */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 mt-0.5">
                <FileText size={18} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <strong className="text-sm font-bold text-gray-900 block truncate">{r.title}</strong>
                <small className="text-xs text-gray-500 block mt-0.5">{r.sub}</small>
              </div>
            </div>

            {/* Size & Download Action */}
            <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                {r.size}
              </span>
              <button 
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors shadow-sm" 
                onClick={() => toast.info("Sample report: connect the backend to generate PDFs")}
              >
                <Download size={14} aria-hidden="true" /> Download
              </button>
            </div>
          </div>
        ))}

        {REPORTS.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No impact certificates or reports available.
          </div>
        )}
      </div>
    </section>
  );
}