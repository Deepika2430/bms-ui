import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  bars: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
  tooltipFormatter?: (value: any, name: string, props: any) => string; // Add tooltipFormatter prop
}

const BarChart = ({ data, bars, xAxisLabel, yAxisLabel, className, tooltipFormatter }: BarChartProps) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#ccc', strokeWidth: 1 }}
            tickLine={false}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#ccc', strokeWidth: 1 }}
            tickLine={false}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none' 
            }} 
            formatter={tooltipFormatter} // Use the custom tooltip formatter
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              barSize={30}
              animationDuration={1000}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
