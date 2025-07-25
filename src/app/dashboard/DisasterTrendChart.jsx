// DisasterTrendChart.jsx
'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DisasterTrendChart({ selected, data }) {
  const chartData = monthLabels.map((label, i) => {
    const entry = { month: label };
    Object.keys(data).forEach(type => {
      entry[type] = data[type][i];
    });
    return entry;
  });

  const lineColors = {
    Banjir: 'rgba(0, 217, 255, 1)',
    'Banjir ROB': 'rgba(125, 211, 252, 1)',
    'Angin Kencang': 'rgba(253, 224, 71, 1)',
    'Kebakaran Hutan & Lahan': 'rgba(255, 107, 53, 1)',
    'Tanah Longsor': 'rgba(255, 64, 129, 1)',
    'Gempa Bumi': 'rgba(192, 132, 252, 1)',
    Tsunami: 'rgba(79, 255, 176, 1)',
  };

  const filteredLines = selected === 'All' ? Object.keys(data) : [selected];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle}>
          <p style={tooltipLabelStyle}>{`Bulan: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{...tooltipItemStyle, color: entry.color}}>
              {`${entry.dataKey}: ${entry.value} kejadian`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis 
          dataKey="month" 
          stroke="#FFFFFF"
          fontSize={12}
          fontWeight="500"
          tickLine={false}
          axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
        />
        <YAxis 
          stroke="#FFFFFF"
          fontSize={12}
          fontWeight="500"
          tickLine={false}
          axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
          gridLineStyle={{ stroke: '#FFFFFF', strokeDasharray: '3 3' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF'
          }}
        />
        {filteredLines.map(type => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            stroke={lineColors[type] || '#FFFFFF'}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, fill: lineColors[type] || '#FFFFFF' }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Styles for Chart Tooltip
const tooltipStyle = {
  background: "rgba(77, 83, 119, 0.55)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.22)",
  border: "1px solid rgba(255, 255, 255, 0.64)",
  borderRadius: "16px",
  padding: "16px 20px",
  color: "#000000",
  fontSize: "14px",
};

const tooltipLabelStyle = {
  fontWeight: '600',
  marginBottom: '8px',
  color: '#ffffff',
  margin: '0 0 8px 0',
};

const tooltipItemStyle = {
  fontWeight: '500',
  margin: '4px 0',
};