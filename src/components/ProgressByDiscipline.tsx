import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Mock data for each chart
const chartsData = [
  {
    title: 'Materials',
    data: [
      { Discipline: 'C&GW', Progress: 0 },
      { Discipline: 'ENG AI', Progress: 100 },
      { Discipline: 'ENG C&A', Progress: 50 },
      { Discipline: 'ENG ELEC', Progress: 75 },
      { Discipline: 'ENG INST', Progress: 60 },
      { Discipline: 'ENG M&C', Progress: 80 },
      { Discipline: 'ENG MECH', Progress: 90 },
      { Discipline: 'ENG PROC', Progress: 70 },
      { Discipline: 'MNT C&I', Progress: 40 },
      { Discipline: 'MNT E&I', Progress: 65 },
      { Discipline: 'MNT ELEC', Progress: 85 },
      { Discipline: 'MNT MECH', Progress: 95 },
    ],
  },
  {
    title: 'Resources',
    data: [
      { Discipline: 'C&GW', Progress: 0 },
      { Discipline: 'ENG AI', Progress: 100 },
      { Discipline: 'ENG C&A', Progress: 50 },
      { Discipline: 'ENG ELEC', Progress: 75 },
      { Discipline: 'ENG INST', Progress: 60 },
      { Discipline: 'ENG M&C', Progress: 80 },
      { Discipline: 'ENG MECH', Progress: 90 },
      { Discipline: 'ENG PROC', Progress: 70 },
      { Discipline: 'MNT C&I', Progress: 40 },
      { Discipline: 'MNT E&I', Progress: 65 },
      { Discipline: 'MNT ELEC', Progress: 85 },
      { Discipline: 'MNT MECH', Progress: 95 },
    ],
  },
  {
    title: 'Field Support Services',
    data: [
      { Discipline: 'C&GW', Progress: 0 },
      { Discipline: 'ENG AI', Progress: 100 },
      { Discipline: 'ENG C&A', Progress: 50 },
      { Discipline: 'ENG ELEC', Progress: 75 },
      { Discipline: 'ENG INST', Progress: 60 },
      { Discipline: 'ENG M&C', Progress: 80 },
      { Discipline: 'ENG MECH', Progress: 90 },
      { Discipline: 'ENG PROC', Progress: 70 },
      { Discipline: 'MNT C&I', Progress: 40 },
      { Discipline: 'MNT E&I', Progress: 65 },
      { Discipline: 'MNT ELEC', Progress: 85 },
      { Discipline: 'MNT MECH', Progress: 95 },
    ],
  },
  {
    title: 'Workpacks',
    data: [
      { Discipline: 'C&GW', Progress: 0 },
      { Discipline: 'ENG AI', Progress: 100 },
      { Discipline: 'ENG C&A', Progress: 50 },
      { Discipline: 'ENG ELEC', Progress: 75 },
      { Discipline: 'ENG INST', Progress: 60 },
      { Discipline: 'ENG M&C', Progress: 80 },
      { Discipline: 'ENG MECH', Progress: 90 },
      { Discipline: 'ENG PROC', Progress: 70 },
      { Discipline: 'MNT C&I', Progress: 40 },
      { Discipline: 'MNT E&I', Progress: 65 },
      { Discipline: 'MNT ELEC', Progress: 85 },
      { Discipline: 'MNT MECH', Progress: 95 },
    ],
  },
  {
    title: 'Schedule Preparation',
    data: [
      { Discipline: 'C&GW', Progress: 0 },
      { Discipline: 'ENG AI', Progress: 100 },
      { Discipline: 'ENG C&A', Progress: 50 },
      { Discipline: 'ENG ELEC', Progress: 75 },
      { Discipline: 'ENG INST', Progress: 60 },
      { Discipline: 'ENG M&C', Progress: 80 },
      { Discipline: 'ENG MECH', Progress: 90 },
      { Discipline: 'ENG PROC', Progress: 70 },
      { Discipline: 'MNT C&I', Progress: 40 },
      { Discipline: 'MNT E&I', Progress: 65 },
      { Discipline: 'MNT ELEC', Progress: 85 },
      { Discipline: 'MNT MECH', Progress: 95 },
    ],
  },
];

export const ProgressByDiscipline = () => {
  // State to track the current chart index
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  // Function to go to the previous chart
  const handlePrev = () => {
    setCurrentChartIndex((prevIndex) =>
      prevIndex === 0 ? chartsData.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next chart
  const handleNext = () => {
    setCurrentChartIndex((prevIndex) =>
      prevIndex === chartsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the current chart data
  const currentChart = chartsData[currentChartIndex];

  return (
    <div className="progress-by-discipline">
      {/* Chart Title */}
      <h2>{currentChart.title}</h2>

      {/* Chart Container */}
      <div className="chart-container">
        <BarChart
          width={700}
          height={400}
          data={currentChart.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Progress" type="number" domain={[0, 100]} />
          <YAxis dataKey="Discipline" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Progress" fill="#4caf50" radius={[10, 10, 0, 0]} />
        </BarChart>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={currentChartIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentChartIndex === chartsData.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

// Optional CSS for styling
.progress-by-discipline {
  text-align: center;
}

.chart-container {
  margin: 20px auto;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.navigation-buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.navigation-buttons button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
