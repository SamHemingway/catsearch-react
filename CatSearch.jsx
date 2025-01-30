import React, { useState, useEffect, useCallback } from "react"
import { fetchSearchResultsFromAPI } from "./searchApiClient"
import debounce from "./debounce"

export function CatSearch() {
  const [hits, setHits] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const isMoreThan2Chars = searchTerm.length >= 2

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 1000),
    []
  )

  const searchTermOnChange = (event) => {
    const { value } = event.target
    debouncedSetSearchTerm(value)
  }

  useEffect(() => {
    if (!isMoreThan2Chars) {
      setHits([])
      return
    }
    setIsSearching(true)
    fetchSearchResultsFromAPI(searchTerm)
      .then((hits) => {
        setHits(hits)
      })
      .catch((error) => {
        console.error("Search failed:", error)
        setHits([])
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [searchTerm, isMoreThan2Chars])

  return (
    <div>
      <h2>Cat Search!</h2>
      <label
        htmlFor="cat-search"
        aria-label="Search for cat breed"
        style={{ marginRight: "10px" }}
      >
        Search for cat breed
      </label>
      <input id="cat-search" type="text" onChange={searchTermOnChange} />
      <div>
        {isMoreThan2Chars === false
          ? "Type at least two characters to start searching"
          : `You searched for ${searchTerm}`}
      </div>
      <div>
        {isSearching
          ? "Finding cats..."
          : hits.length > 0
          ? hits.map((hit, i) => <div key={i}>🐈 {hit.breed}</div>)
          : "No hits!"}
      </div>
    </div>
  )
}
