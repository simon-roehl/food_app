import { useMemo, useState } from 'react'
import { MACROS, MICRONUTRIENTS } from '../../utils/nutrients'
import { convertToGrams, MASS_UNITS } from '../../utils/units'
import './FoodQuantityEditor.css'

function FoodQuantityEditor({ food, onAdd, onCancel }) {
  const [quantity, setQuantity] = useState(100)
  const [unit, setUnit] = useState('g')
  const nutrients = useMemo(() => Object.fromEntries(Object.entries(food.nutrients).map(([key, entry]) => [key, { ...entry, value: entry.value * convertToGrams(quantity, unit) / food.baseAmount }])), [food, quantity, unit])
  return <div className="food-quantity-editor"><h3>{food.name}</h3><div className="food-quantity-editor__inputs"><input type="number" min="0.1" step="any" value={quantity} onChange={(event) => setQuantity(Math.max(0, Number(event.target.value)))} /><select value={unit} onChange={(event) => setUnit(event.target.value)}>{MASS_UNITS.map((value) => <option key={value}>{value}</option>)}</select></div><div className="food-quantity-editor__label">{[...MACROS, ...MICRONUTRIENTS].map(({ key, label, unit: nutrientUnit }) => <div key={key} className="food-quantity-editor__row"><span>{label}{nutrients[key]?.quality === 'unknown' ? '**' : ''}</span><span>{nutrients[key]?.quality === 'unknown' ? '—' : `${Math.round((nutrients[key]?.value ?? 0) * 10) / 10}${nutrientUnit}`}</span></div>)}</div><p className="food-quantity-editor__legend">** No data available</p><div className="food-quantity-editor__actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button type="button" className="primary" disabled={quantity <= 0} onClick={() => onAdd({ entryId: crypto.randomUUID(), fdcId: food.fdcId, name: food.name, quantity, unit, nutrients })}>Add</button></div></div>
}
export default FoodQuantityEditor
