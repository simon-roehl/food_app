async function foodRequest(path) {
  const response = await fetch(path)
  if (!response.ok) throw new Error(await response.text() || 'Food request failed')
  return response.json()
}
export const searchFoods = (query) => foodRequest(`/api/food/search?q=${encodeURIComponent(query)}`)
export const getFoodDetails = (fdcId) => foodRequest(`/api/food/${fdcId}`)
