// PriceChart: Renders a responsive line chart of predicted prices in NGN using Chart.js
// It fetches predictions from the backend whenever the selected commodity changes

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { fetchPredictions } from '../lib/api.js';

// Register the components we use in Chart.js (required in tree-shakable builds)
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function PriceChart({ commodity }) {
  // Local state to store fetched data
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch predictions whenever the commodity changes
  useEffect(() => {
    let mounted = true; // Guards state updates if component unmounts during fetch
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetchPredictions(commodity);
        // Expecting a lightweight response: { dates: string[], values: number[] }
        if (mounted) {
          setDates(Array.isArray(res?.dates) ? res.dates : []);
          setValues(Array.isArray(res?.values) ? res.values : []);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch predictions.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [commodity]);

  // Prepare data and options in the shape expected by react-chartjs-2
  const data = {
    labels: dates,
    datasets: [
      {
        label: `${commodity} price (NGN)`,
        data: values,
        borderColor: 'rgba(30, 144, 255, 1)',
        backgroundColor: 'rgba(30, 144, 255, 0.15)',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: { mode: 'nearest', intersect: false },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price (NGN)' }, beginAtZero: false },
    },
  };

  return (
    <section className="chart-panel">
      <div className="panel-header">
        <h2 className="panel-title">Predicted Prices</h2>
        <p className="panel-subtitle">Lightweight forecast data for quick planning</p>
      </div>

      {loading && <p className="panel-status">Loading predictions…</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="chart-wrapper" aria-busy={loading}>
        {/* The Line component renders a responsive canvas chart */}
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
