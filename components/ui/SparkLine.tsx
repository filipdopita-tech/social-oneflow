'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparkLineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export default function SparkLine({ data, color = '#6B5BFF', height = 32, width = 80 }: SparkLineProps) {
  const chartData = data.map((value, index) => ({ value, index }))
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
