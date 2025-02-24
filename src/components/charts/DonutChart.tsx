import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const DonutChart = ({ value, colors, title }: any) => {
  const data = [
    { name: "Completed", value: value },
    { name: "Remaining", value: 100 - value },
  ];

  const COLORS = ["#2196F3", "#E0E0E0"]; // Blue for completed, Gray for remaining

  return (
    <div style={{ position: "relative", width: "250px", height: "250px" }}>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>
      </PieChart>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
      <p
        className="text-center font-semibold"
        style={{
          color: colors[0],
        }}
      >
        {title}
      </p>
    </div>
  );
};

export default DonutChart;
