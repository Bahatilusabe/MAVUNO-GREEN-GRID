import React, { useState } from "react";
import OfferNegotiationCard from "./OfferNegotiationCard";
import { RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";

const DEMO_SURPLUS_RATIO = 0.22;
const BASE_MODAL_PRICE = 26;
const modalPrice = Math.round(BASE_MODAL_PRICE * (1 - DEMO_SURPLUS_RATIO * 0.45));

const forecast = {
  minPrice: Math.round(modalPrice * 0.78),
  modalPrice: modalPrice,
  maxPrice: Math.round(modalPrice * 1.25),
  recommendedCounter: modalPrice + 1,
  spoilageHours: 68,
  unit: "kg",
  crop: "Tomatoes (Kirinyaga Cohort)",
};

const INITIAL_DEAL = {
  id: "DEAL-MWEA-882",
  crop: "Tomatoes",
  quantityKg: 900,
  currentOfferPrice: 20,
  lastActionBy: "buyer",
  status: "negotiating",
  buyerName: "Nairobi Fresh Grocers",
  farmerName: "Samuel Kamau",
  history: [
    { by: "buyer", text: "Initial purchase order sent at KES 20/kg", time: "10:14 AM" }
  ]
};

export default function JudgeModeDemo() {
  const [deal, setDeal] = useState(INITIAL_DEAL);
  const [buyerInputPrice, setBuyerInputPrice] = useState(21);

  const resetDemo = () => {
    setDeal(INITIAL_DEAL);
    setBuyerInputPrice(21);
  };

  const handleFarmerAccept = (price) => {
    setDeal((prev) => ({
      ...prev,
      currentOfferPrice: price,
      status: "agreed",
      lastActionBy: "farmer",
      history: [
        ...prev.history,
        { by: "farmer", text: `Accepted offer at KES ${price}/kg`, time: "Just now" }
      ]
    }));
  };

  const handleFarmerCounter = (newPrice) => {
    setDeal((prev) => ({
      ...prev,
      currentOfferPrice: newPrice,
      lastActionBy: "farmer",
      history: [
        ...prev.history,
        { by: "farmer", text: `Countered with KES ${newPrice}/kg via AI Advisor`, time: "Just now" }
      ]
    }));
  };

  const handleFarmerDecline = () => {
    setDeal((prev) => ({
      ...prev,
      status: "declined",
      lastActionBy: "farmer",
      history: [...prev.history, { by: "farmer", text: "Declined the batch offer", time: "Just now" }]
    }));
  };

  const handleBuyerCounter = () => {
    setDeal((prev) => ({
      ...prev,
      currentOfferPrice: Number(buyerInputPrice),
      lastActionBy: "buyer",
      history: [
        ...prev.history,
        { by: "buyer", text: `Submitted revised bid: KES ${buyerInputPrice}/kg`, time: "Just now" }
      ]
    }));
  };

  const handleBuyerAccept = () => {
    setDeal((prev) => ({
      ...prev,
      status: "agreed",
      lastActionBy: "buyer",
      history: [
        ...prev.history,
        { by: "buyer", text: `Accepted counter at KES ${prev.currentOfferPrice}/kg`, time: "Just now" }
      ]
    }));
  };

  const totalDealValue = deal.currentOfferPrice * deal.quantityKg;
  const kgSaved = deal.status === "agreed" ? deal.quantityKg : 0;
  const co2AvoidedKg = Math.round(kgSaved * 1.9);

  return (
    <div style={demoStyles.container}>
      <div style={demoStyles.topBar}>
        <div>
          <span style={demoStyles.stageTag}>LIVE JUDGE DEMO MODE</span>
          <span style={{ fontSize: "14px", color: "#64748b", marginLeft: "12px" }}>
            Mavuno Green Grid: Kirinyaga East Cohort
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={demoStyles.surplusPill}>
            <AlertTriangle size={14} color="#b45309" />
            <span>Regional Surplus: <strong>22.0%</strong></span>
          </div>
          <button onClick={resetDemo} style={demoStyles.resetButton}>
            <RotateCcw size={14} /> Reset Demo Data
          </button>
        </div>
      </div>

      <div style={demoStyles.tickerBar}>
        <div style={demoStyles.tickerItem}>
          <span style={demoStyles.tickerLabel}>DEAL STATUS</span>
          <span style={{ ...demoStyles.tickerValue, color: deal.status === "agreed" ? "#16a34a" : "#0284c7" }}>
            {deal.status.toUpperCase()}
          </span>
        </div>
        <div style={demoStyles.tickerItem}>
          <span style={demoStyles.tickerLabel}>TOTAL VALUE</span>
          <span style={demoStyles.tickerValue}>KES {totalDealValue.toLocaleString()}</span>
        </div>
        <div style={demoStyles.tickerItem}>
          <span style={demoStyles.tickerLabel}>POST-HARVEST LOSS RESCUED</span>
          <span style={demoStyles.tickerValue}>{kgSaved} kg</span>
        </div>
        <div style={demoStyles.tickerItem}>
          <span style={demoStyles.tickerLabel}>EMISSIONS AVOIDED</span>
          <span style={{ ...demoStyles.tickerValue, color: "#16a34a" }}>
            {co2AvoidedKg} kg CO₂e
          </span>
        </div>
      </div>

      <div style={demoStyles.splitGrid}>
        <div style={demoStyles.screenColumn}>
          <div style={demoStyles.columnHeader}>
            <span style={demoStyles.screenTitle}>📱 Farmer Mobile View (Samuel Kamau)</span>
            <span style={demoStyles.syncPill}>Instant Sync</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {deal.status === "agreed" ? (
              <div style={demoStyles.agreedCard}>
                <CheckCircle2 size={48} color="#16a34a" />
                <h3 style={{ margin: "12px 0 4px 0" }}>Deal Closed & Agreed!</h3>
                <p style={{ margin: 0, color: "#475569", fontSize: "14px" }}>
                  Contract locked at <strong>KES {deal.currentOfferPrice}/kg</strong>. Transport dispatch scheduled.
                </p>
              </div>
            ) : (
              <OfferNegotiationCard
                deal={deal}
                forecast={forecast}
                onAccept={handleFarmerAccept}
                onCounter={handleFarmerCounter}
                onDecline={handleFarmerDecline}
              />
            )}
          </div>
        </div>

        <div style={demoStyles.screenColumn}>
          <div style={demoStyles.columnHeader}>
            <span style={demoStyles.screenTitle}>💻 Buyer Procurement Portal (Nairobi Fresh)</span>
            <span style={demoStyles.syncPill}>Instant Sync</span>
          </div>

          <div style={demoStyles.buyerCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>BATCH PO #4092</span>
                <h3 style={{ margin: "4px 0" }}>900 kg Quality Tomatoes</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Supplier: Samuel Kamau</p>
              </div>
              <span style={demoStyles.roleBadge}>Buyer Console</span>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Current Deal Stand:</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>
                KES {deal.currentOfferPrice}/kg
              </div>
              <div style={{ fontSize: "13px", color: "#475569" }}>
                Last action by: <strong>{deal.lastActionBy === "farmer" ? "Farmer" : "You (Buyer)"}</strong>
              </div>
            </div>

            {deal.status === "negotiating" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {deal.lastActionBy === "farmer" ? (
                  <button onClick={handleBuyerAccept} style={demoStyles.buyerAcceptBtn}>
                    Accept Farmer's KES {deal.currentOfferPrice}/kg Counter
                  </button>
                ) : (
                  <div style={demoStyles.waitingNotice}>
                    Waiting for farmer response on mobile...
                  </div>
                )}

                <div style={demoStyles.buyerCounterRow}>
                  <input
                    type="number"
                    value={buyerInputPrice}
                    onChange={(e) => setBuyerInputPrice(e.target.value)}
                    style={demoStyles.numberInput}
                    min="15"
                    max="35"
                  />
                  <button onClick={handleBuyerCounter} style={demoStyles.buyerSubmitBtn}>
                    Send Revised Bid
                  </button>
                </div>
              </div>
            ) : (
              <div style={demoStyles.closedNotice}>
                Negotiation status finalized: <strong>{deal.status.toUpperCase()}</strong>
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "8px" }}>
                LIVE NEGOTIATION THREAD LOG
              </div>
              <div style={demoStyles.logContainer}>
                {deal.history.map((item, idx) => (
                  <div key={idx} style={demoStyles.logItem}>
                    <span style={item.by === "farmer" ? demoStyles.logFarmer : demoStyles.logBuyer}>
                      {item.by.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "13px", color: "#334155" }}>{item.text}</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "auto" }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const demoStyles = {
  container: {
    padding: "20px",
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  stageTag: {
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    fontSize: "12px",
    fontWeight: "800",
    padding: "4px 8px",
    borderRadius: "4px",
    letterSpacing: "0.05em"
  },
  surplusPill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "20px"
  },
  resetButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  tickerBar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "20px"
  },
  tickerItem: {
    backgroundColor: "#ffffff",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
  },
  tickerLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    display: "block",
    marginBottom: "4px"
  },
  tickerValue: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a"
  },
  splitGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    alignItems: "start"
  },
  screenColumn: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  screenTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a"
  },
  syncPill: {
    fontSize: "11px",
    fontWeight: "700",
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "2px 8px",
    borderRadius: "12px"
  },
  agreedCard: {
    textAlign: "center",
    padding: "48px 24px",
    backgroundColor: "#f0fdf4",
    border: "2px dashed #86efac",
    borderRadius: "12px",
    width: "100%"
  },
  buyerCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "20px"
  },
  roleBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#0284c7",
    backgroundColor: "#e0f2fe",
    padding: "3px 8px",
    borderRadius: "4px"
  },
  buyerAcceptBtn: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer"
  },
  waitingNotice: {
    fontSize: "13px",
    color: "#64748b",
    fontStyle: "italic",
    padding: "8px 0"
  },
  buyerCounterRow: {
    display: "flex",
    gap: "8px"
  },
  numberInput: {
    width: "80px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    fontWeight: "600"
  },
  buyerSubmitBtn: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },
  closedNotice: {
    padding: "10px",
    backgroundColor: "#e2e8f0",
    borderRadius: "6px",
    fontSize: "13px",
    textAlign: "center"
  },
  logContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "180px",
    overflowY: "auto"
  },
  logItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #f1f5f9"
  },
  logFarmer: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "700"
  },
  logBuyer: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "700"
  }
};