import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    tooltip?: string;
  }>;
  className?: string;
  tooltipKey?: string; // Add tooltipKey prop
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChart = ({ data, className, tooltipKey }: PieChartProps) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none' 
            }} 
            formatter={(value, name, props) => {
              return tooltipKey ? props.payload[tooltipKey] : value;
            }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center" 
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
