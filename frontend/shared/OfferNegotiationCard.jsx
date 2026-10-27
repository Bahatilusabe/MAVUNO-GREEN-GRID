import React, { useState } from 'react';

const DEFAULT_FORECAST = {
  minPrice: 18,
  modalPrice: 24,
  maxPrice: 30,
  recommendedCounter: 25,
  spoilageHours: 71,
  unit: 'kg',
  crop: 'Tomatoes'
};

export default function OfferNegotiationCard({
  deal = {
    id: 'DEAL-1042',
    crop: 'Tomatoes',
    quantityKg: 900,
    currentOfferPrice: 20,
    buyerName: 'Nairobi Fresh Grocers',
    farmerName: 'Samuel Kamau',
  },
  forecast = DEFAULT_FORECAST,
  onAccept,
  onCounter,
  onDecline
}) {
  const [selectedCounter, setSelectedCounter] = useState(forecast.recommendedCounter);
  const [isCountering, setIsCountering] = useState(false);

  const totalValue = deal.currentOfferPrice * deal.quantityKg;
  const priceDiffPercent = Math.round(
    ((deal.currentOfferPrice - forecast.modalPrice) / forecast.modalPrice) * 100
  );

  const gaugePercent = Math.min(
    100,
    Math.max(
      0,
      ((deal.currentOfferPrice - forecast.minPrice) /
        (forecast.maxPrice - forecast.minPrice)) * 100
    )
  );

  const counterChips = [
    {
      price: forecast.modalPrice - 1,
      tag: 'Fast Deal',
      desc: 'Closes quickly before spoilage accelerates.'
    },
    {
      price: forecast.modalPrice,
      tag: 'Fair Market',
      desc: 'Matches current wholesale market average.'
    },
    {
      price: forecast.modalPrice + 2,
      tag: 'Max Value',
      desc: 'Optimized for high-grade harvest batches.'
    }
  ];

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.dealBadge}>DEAL #{deal.id}</span>
          <h2 style={styles.title}>{deal.crop} Harvest Lot</h2>
          <p style={styles.subtext}>Offered by: <strong>{deal.buyerName}</strong></p>
        </div>
        <div style={styles.spoilageBadge}>
          <span>⏳ Spoilage: <strong>{forecast.spoilageHours}h left</strong></span>
        </div>
      </div>

      <div style={styles.heroSection}>
        <div>
          <div style={styles.heroPrice}>
            KES {deal.currentOfferPrice}
            <span style={styles.unitText}>/{forecast.unit}</span>
          </div>
          <div style={styles.subDetail}>
            Total: <strong>KES {totalValue.toLocaleString()}</strong> ({deal.quantityKg} kg)
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              ...styles.statusTag,
              backgroundColor: priceDiffPercent < 0 ? '#fee2e2' : '#dcfce7',
              color: priceDiffPercent < 0 ? '#991b1b' : '#166534'
            }}
          >
            {priceDiffPercent < 0
              ? `${Math.abs(priceDiffPercent)}% Under Fair Price`
              : `${priceDiffPercent}% Above Market Avg`}
          </span>
        </div>
      </div>

      <div style={styles.gaugeContainer}>
        <div style={styles.gaugeLabels}>
          <span>Min: KES {forecast.minPrice}</span>
          <span style={{ fontWeight: 'bold' }}>Market Modal: KES {forecast.modalPrice}</span>
          <span>Max: KES {forecast.maxPrice}</span>
        </div>
        <div style={styles.gaugeTrack}>
          <div style={{ ...styles.gaugePointer, left: `${gaugePercent}%` }} />
        </div>
        <div style={styles.aiInsight}>
          <strong>AI Advisor:</strong> Offer is {Math.abs(priceDiffPercent)}% below modal.
          Recommended counter is <strong>KES {forecast.recommendedCounter}/{forecast.unit}</strong>.
        </div>
      </div>

      {!isCountering ? (
        <div style={styles.btnRow}>
          <button
            onClick={() => onAccept && onAccept(deal.currentOfferPrice)}
            style={{ ...styles.btn, ...styles.acceptBtn }}
          >
            Accept (KES {deal.currentOfferPrice})
          </button>
          <button
            onClick={() => setIsCountering(true)}
            style={{ ...styles.btn, ...styles.counterBtn }}
          >
            Counter Offer
          </button>
          <button
            onClick={() => onDecline && onDecline()}
            style={{ ...styles.btn, ...styles.declineBtn }}
          >
            Decline
          </button>
        </div>
      ) : (
        <div style={styles.counterSection}>
          <label style={styles.counterLabel}>Select AI Recommended Counter Chip:</label>
          <div style={styles.chipRow}>
            {counterChips.map((chip) => (
              <button
                key={chip.price}
                type="button"
                onClick={() => setSelectedCounter(chip.price)}
                style={{
                  ...styles.chip,
                  borderColor: selectedCounter === chip.price ? '#16a34a' : '#e2e8f0',
                  backgroundColor: selectedCounter === chip.price ? '#f0fdf4' : '#fff'
                }}
              >
                <div style={styles.chipPrice}>KES {chip.price}/kg</div>
                <div style={styles.chipTag}>{chip.tag}</div>
                <div style={styles.chipDesc}>{chip.desc}</div>
              </button>
            ))}
          </div>

          <div style={styles.btnRow}>
            <button
              onClick={() => {
                onCounter && onCounter(selectedCounter);
                setIsCountering(false);
              }}
              style={{ ...styles.btn, ...styles.submitCounterBtn }}
            >
              Send KES {selectedCounter}/kg Counter
            </button>
            <button
              onClick={() => setIsCountering(false)}
              style={{ ...styles.btn, ...styles.cancelBtn }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '560px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1e293b'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  dealBadge: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  title: {
    margin: '4px 0 2px 0',
    fontSize: '20px',
    fontWeight: '700'
  },
  subtext: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b'
  },
  spoilageBadge: {
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    color: '#c2410c',
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '20px'
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '16px 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9'
  },
  heroPrice: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a'
  },
  unitText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#64748b'
  },
  subDetail: {
    fontSize: '14px',
    color: '#475569',
    marginTop: '4px'
  },
  statusTag: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  gaugeContainer: {
    margin: '18px 0',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '14px'
  },
  gaugeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px'
  },
  gaugeTrack: {
    height: '10px',
    borderRadius: '5px',
    background: 'linear-gradient(to right, #ef4444, #eab308 50%, #22c55e)',
    position: 'relative',
    marginBottom: '10px'
  },
  gaugePointer: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#0f172a',
    border: '3px solid #ffffff',
    position: 'absolute',
    top: '-3px',
    transform: 'translateX(-50%)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'left 0.3s ease'
  },
  aiInsight: {
    fontSize: '13px',
    color: '#334155',
    lineHeight: '1.4'
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px'
  },
  btn: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none'
  },
  acceptBtn: {
    backgroundColor: '#16a34a',
    color: '#ffffff'
  },
  counterBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff'
  },
  declineBtn: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1'
  },
  counterSection: {
    marginTop: '16px'
  },
  counterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
    display: 'block'
  },
  chipRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px'
  },
  chip: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
    textAlign: 'left'
  },
  chipPrice: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a'
  },
  chipTag: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#16a34a',
    marginTop: '2px',
    textTransform: 'uppercase'
  },
  chipDesc: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '4px',
    lineHeight: '1.2'
  },
  submitCounterBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff'
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    color: '#64748b'
  }
};