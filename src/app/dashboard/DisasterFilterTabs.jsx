// DisasterFilterTabs.jsx
const types = [
  { label: 'All', value: 'All' },
  { label: 'Banjir', value: 'Banjir' },
  { label: 'Banjir ROB', value: 'Banjir ROB' },
  { label: 'Angin Kencang', value: 'Angin Kencang' },
  { label: 'Karhutla', value: 'Kebakaran Hutan & Lahan' },
  { label: 'Tanah Longsor', value: 'Tanah Longsor' },
  { label: 'Gempa Bumi', value: 'Gempa Bumi' },
  { label: 'Tsunami', value: 'Tsunami' },
];


export default function DisasterFilterTabs({ selected, setSelected }) {
  return (
    <div style={tabsContainerStyle}>
      {types.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setSelected(value)}
          style={{
            ...tabButtonStyle,
            ...(selected === value ? activeTabStyle : {}),
          }}
          onMouseEnter={(e) => {
            if (selected !== value) {
              e.target.style.background = 'rgba(59, 130, 246, 0.4)';
              e.target.style.backdropFilter = 'blur(12px)';
              e.target.style.WebkitBackdropFilter = 'blur(12px)';
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (selected !== value) {
              e.target.style.background = 'rgba(30, 64, 175, 0.3)';
              e.target.style.backdropFilter = 'blur(8px)';
              e.target.style.WebkitBackdropFilter = 'blur(8px)';
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {label}
        </button>
      ))}

    </div>
  );
}

// Styles for DisasterFilterTabs
const tabsContainerStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '32px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '16px',
  // background: 'rgba(30, 64, 175, 0.15)',
  // backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
};

const tabButtonStyle = {
  padding: '12px 24px',
  borderRadius: '24px',
  background: 'rgba(30, 64, 175, 0.3)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  letterSpacing: '0.5px',
  outline: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  overflow: 'hidden',
};

const activeTabStyle = {
  background: 'rgba(0, 123, 255, 0.4)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  transform: 'translateY(-1px)',
};
