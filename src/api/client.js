async function request(getToken, path, options = {}) {
  const token = await getToken()
  if (!token) throw new Error('You must be signed in to make this request.')

  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  })
  if (!response.ok && response.status !== 204) throw new Error(`${options.method ?? 'GET'} ${path} failed: ${response.status} ${await response.text()}`)
  return response.status === 204 ? null : response.json()
}

export const api = {
  getProfile: (getToken) => request(getToken, '/api/profile'),
  saveProfile: (getToken, profile) => request(getToken, '/api/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getLog: (getToken, date) => request(getToken, `/api/log/${date}`),
  addLogEntry: (getToken, date, entry) => request(getToken, `/api/log/${date}`, { method: 'POST', body: JSON.stringify(entry) }),
  deleteLogEntry: (getToken, date, entryId) => request(getToken, `/api/log/${date}?entryId=${encodeURIComponent(entryId)}`, { method: 'DELETE' }),
  getFavorites: (getToken, type) => request(getToken, `/api/favorites?type=${type}`),
  addFavorite: (getToken, type, favorite) => request(getToken, `/api/favorites?type=${type}`, { method: 'POST', body: JSON.stringify(favorite) }),
  removeFavorite: (getToken, type, id) => request(getToken, `/api/favorites?type=${type}&id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
}
