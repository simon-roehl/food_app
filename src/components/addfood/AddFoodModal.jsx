import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/react'
import { searchFoods, getFoodDetails } from '../../api/foodClient'
import { api } from '../../api/client'
import FoodQuantityEditor from './FoodQuantityEditor'
import ManualFoodEntry from './ManualFoodEntry'
import './AddFoodModal.css'

function AddFoodModal({ onClose, onAddEntry }) {
  const { getToken } = useAuth(); const [view, setView] = useState('browse'); const [query, setQuery] = useState(''); const [results, setResults] = useState([]); const [food, setFood] = useState(null); const [favorites, setFavorites] = useState([]); const [error, setError] = useState(null); const [saving, setSaving] = useState(false)
  useEffect(() => { api.getFavorites(getToken, 'items').then(setFavorites).catch(() => {}) }, [getToken])
  async function search(event) { event.preventDefault(); if (!query.trim()) return; setError(null); try { setResults(await searchFoods(query.trim())) } catch { setError('Food search failed. Try again.') } }
  async function select(fdcId) { setError(null); try { setFood(await getFoodDetails(fdcId)); setView('quantity') } catch { setError('Food details could not be loaded.') } }
  async function add(entry) { setSaving(true); setError(null); try { await onAddEntry(entry); onClose() } catch { setError("Couldn't save this food. Try again.") } finally { setSaving(false) } }
  async function toggleFavorite(item) { const exists = favorites.some((favorite) => favorite.fdcId === item.fdcId); try { if (exists) { await api.removeFavorite(getToken, 'items', String(item.fdcId)); setFavorites((all) => all.filter((favorite) => favorite.fdcId !== item.fdcId)) } else { const favorite = { fdcId: item.fdcId, name: item.name }; await api.addFavorite(getToken, 'items', favorite); setFavorites((all) => [...all, favorite]) } } catch { setError("Couldn't update favorites.") } }
  return <div className="add-food-modal__overlay" onClick={onClose}><div className="add-food-modal" role="dialog" aria-modal="true" aria-label="Add food" onClick={(event) => event.stopPropagation()}><header className="add-food-modal__header"><h2>Add food</h2><button type="button" onClick={onClose} aria-label="Close">×</button></header>{error && <p className="add-food-modal__error">{error}</p>}{view === 'quantity' && food && <FoodQuantityEditor food={food} onAdd={add} onCancel={() => setView('browse')} />}{view === 'manual' && <ManualFoodEntry onAdd={add} onCancel={() => setView('browse')} />}{view === 'browse' && <><form className="add-food-modal__search" onSubmit={search}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods" /><button type="submit">Search</button></form><button type="button" className="add-food-modal__manual" onClick={() => setView('manual')}>Enter manually</button><ul className="add-food-modal__results">{results.map((item) => <li key={item.fdcId}><button type="button" onClick={() => select(item.fdcId)}>{item.name}{item.brandName && <small> — {item.brandName}</small>}</button><button type="button" onClick={() => toggleFavorite(item)}>{favorites.some((favorite) => favorite.fdcId === item.fdcId) ? '★' : '☆'}</button></li>)}</ul>{favorites.length > 0 && <section><h3>Favorites</h3>{favorites.map((item) => <button key={item.fdcId} type="button" className="add-food-modal__favorite" onClick={() => select(item.fdcId)}>{item.name}</button>)}</section>}</>}{saving && <p>Saving…</p>}</div></div>
}
export default AddFoodModal
