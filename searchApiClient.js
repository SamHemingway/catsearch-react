export async function fetchSearchResultsFromAPI(searchTerm) {
  // Note: this API seems a bit unstable and sometimes it takes a long time to respond, especially
  // for broad searches
  const response = await fetch(
    `https://cat-api-bjoerge.sanity-io1.now.sh/cats?query=${searchTerm}`
  )

  if (!response.ok) {
    throw new Error(`Error fetching cat data: ${response.status}`)
  }

  return response.json()
}
