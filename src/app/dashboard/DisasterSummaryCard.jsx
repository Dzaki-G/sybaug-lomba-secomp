// DisasterSummaryCard.jsx
import { useState } from 'react';

export default function DisasterSummaryCard({ title, count, unit }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...cardStyle,
        ...(isHovered ? cardHoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 style={cardTitleStyle}>{title}</h4>
      <p style={cardCountStyle}>{count.toLocaleString()}</p>
      <span style={cardUnitStyle}>{unit}</span>
    </div>
  );
}

// Styles for DisasterSummaryCard
const cardStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '20px 12px',
  borderRadius: '16px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
};

// Add hover effect for cards
const cardHoverStyle = {
  transform: 'translateY(-4px)',
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const cardTitleStyle = {
  fontSize: '12px',
  fontWeight: '500',
  marginBottom: '8px',
  color: '#ffffff',
  letterSpacing: '0.3px',
  lineHeight: '1.3',
  margin: '0 0 8px 0',
  textAlign: 'center',
};

const cardCountStyle = {
  fontSize: '64px',
  fontWeight: '700',
  color: '#FFFFFF',
  margin: '6px 0',
  letterSpacing: '-0.5px',
  lineHeight: '1',
};

const cardUnitStyle = {
  fontSize: '10px',
  color: '#ffffff',
  fontWeight: '400',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
};