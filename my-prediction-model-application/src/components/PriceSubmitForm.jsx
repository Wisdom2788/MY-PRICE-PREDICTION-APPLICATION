// PriceSubmitForm: Allows users to submit the current price of a selected commodity in NGN
// The form sends data to the backend API which will forward to a Sui smart contract.

import { useState } from 'react';
import { submitPrice } from '../lib/api.js';

const COMMODITIES = ['Rice', 'Petrol', 'Sugar'];

export default function PriceSubmitForm() {
  const [form, setForm] = useState({ commodity: 'Rice', price: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const priceNum = Number(form.price);
    if (!form.commodity || Number.isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid NGN price.');
      return;
    }
    setLoading(true);
    try {
      await submitPrice({ commodity: form.commodity, price: priceNum });
      setSuccess('Price submitted successfully to Sui oracle via backend.');
      setForm((p) => ({ ...p, price: '' }));
    } catch (err) {
      setError(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="submit-panel">
      <div className="panel-header">
        <h2 className="panel-title">Submit Current Price</h2>
        <p className="panel-subtitle">Send local market price to the Sui oracle (via backend API)</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="submit-commodity" className="form-label">Commodity</label>
          <select
            id="submit-commodity"
            className="form-select"
            value={form.commodity}
            onChange={(e) => setForm({ ...form, commodity: e.target.value })}
          >
            {COMMODITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="submit-price" className="form-label">Price (NGN)</label>
          <input
            id="submit-price"
            className="form-input"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g., 1200.00"
            required
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Price'}
        </button>
      </form>
    </section>
  );
}
