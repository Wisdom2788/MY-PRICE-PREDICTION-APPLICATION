// CommoditySelector: Dropdown to select a commodity. Calls onChange when selection changes.
// Demonstrates controlled <select> element with a value prop and onChange handler.

const OPTIONS = [
  { label: 'Rice', value: 'Rice' },
  { label: 'Petrol', value: 'Petrol' },
  { label: 'Sugar', value: 'Sugar' },
];

export default function CommoditySelector({ value, onChange }) {
  return (
    <div className="selector-row">
      <label htmlFor="commodity" className="form-label">Commodity</label>
      <select
        id="commodity"
        className="form-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
