import React, { useState, useEffect, useCallback } from "react"
import { fetchSearchResultsFromAPI } from "./searchApiClient"
import debounce from "./debounce"

export function CatSearch() {
  const [hits, setHits] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [status, setStatus] = useState("idle")

  const isMoreThan2Chars = searchTerm.length >= 2

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 1000),
    []
  )

  const searchTermOnChange = (event) => {
    const { value } = event.target
    setInputValue(value)
    debouncedSetSearchTerm(value)
  }

  useEffect(() => {
    if (!isMoreThan2Chars) {
      setHits([])
      setStatus("idle")
      return
    }
    setStatus("searching")
    fetchSearchResultsFromAPI(searchTerm)
      .then((hits) => {
        setHits(hits)
        if (hits.length > 0) {
          setStatus("success")
        } else {
          setStatus("noHits")
        }
      })
      .catch((error) => {
        console.error(`Search failed: ${error.message}`)
        setStatus("error")
        setHits([])
      })
  }, [searchTerm, isMoreThan2Chars])

  return (
    <main>
      <h1>Cat Search!</h1>
      <label
        htmlFor="cat-search"
        aria-label="Search for cat breed"
        style={{ marginRight: "10px" }}
      >
        Search for cat breed
      </label>
      <input
        id="cat-search"
        type="text"
        onChange={searchTermOnChange}
        value={inputValue}
      />
      <div>{STATUS_MESSAGES[status]}</div>
      <ul>
        {status === "success" &&
          hits.map((hit, i) => <li key={i}>🐈 {hit.breed}</li>)}
      </ul>
    </main>
  )
}

const STATUS_MESSAGES = {
  idle: "Type at least two characters to start searching",
  searching: "Finding cats...",
  error: "Search failed",
  success: "Found cats!",
  noHits: "No hits!",
}
