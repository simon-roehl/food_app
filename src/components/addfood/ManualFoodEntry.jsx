import { useState } from 'react'
import './ManualFoodEntry.css'
function ManualFoodEntry({ onAdd, onCancel }) {
  const [name, setName] = useState(''); const [values, setValues] = useState({ calories: '', protein: '', carbs: '', fat: '' }); const [error, setError] = useState(null)
  function add() { if (!name.trim()) return setError('Enter a name first.'); onAdd({ entryId: crypto.randomUUID(), fdcId: null, name: name.trim(), quantity: 1, unit: 'serving', nutrients: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { value: Math.max(0, Number(value) || 0), quality: 'complete' }])) }) }
  return <div className="manual-food-entry"><h3>Add a custom food</h3><label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label><div className="manual-food-entry__macros">{Object.entries(values).map(([key, value]) => <label key={key}><span>{key}</span><input type="number" min="0" value={value} onChange={(event) => setValues({ ...values, [key]: event.target.value })} /></label>)}</div>{error && <p className="manual-food-entry__error">{error}</p>}<div className="manual-food-entry__actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button type="button" className="primary" onClick={add}>Add</button></div></div>
}
export default ManualFoodEntry
