import { Handshake } from "lucide-react";

export default function PartnersCard({ partners, onDecide }) {
  return (
    <section className="ad-card">
      <h3><Handshake aria-hidden="true" size={18} /> Partners</h3>
      {partners.map((p) => (
        <div key={p.id} className="ad-row ad-line">
          <div className="grow"><strong>{p.name}</strong><small>{p.type} • {p.county}</small></div>
          {p.status === "Pending" ? (
            <>
              <button className="ad-btn sm" onClick={() => onDecide(p.id, "Approved")}>Approve</button>
              <button className="ad-btn sm ghost" onClick={() => onDecide(p.id, "Rejected")}>Reject</button>
            </>
          ) : (
            <span className={`ad-pill ${p.status.toLowerCase()}`}>{p.status}</span>
          )}
        </div>
      ))}
    </section>
  );
}