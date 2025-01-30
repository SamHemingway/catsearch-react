import React, { useState, useEffect } from "react"
import { fetchSearchResultsFromAPI } from "./searchApiClient"
import debounce from "./debounce"

export function CatSearch() {
  const [hits, setHits] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const isMoreThan2Chars = searchTerm.length >= 2

  const debouncedSetSearchTerm = debounce((value) => setSearchTerm(value), 1000)

  const searchTermOnChange = (event) => {
    const { value } = event.target
    debouncedSetSearchTerm(value)
  }

  useEffect(() => {
    if (!isMoreThan2Chars) {
      setHits([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    fetchSearchResultsFromAPI(searchTerm)
      .then((hits) => {
        setHits(hits)
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [searchTerm, isMoreThan2Chars])

  return (
    <div>
      <h2>Search for cat breed</h2>
      <input type="text" onChange={searchTermOnChange} />
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
