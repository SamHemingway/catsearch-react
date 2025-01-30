import React, { useState, useEffect, useCallback } from "react"
import { fetchSearchResultsFromAPI } from "./searchApiClient"
import debounce from "./debounce"

export function CatSearch() {
  const [hits, setHits] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("idle")

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

  const statusMessage = {
    idle: "Type at least two characters to start searching",
    searching: "Finding cats...",
    error: "Search failed",
    success: "Found cats!",
    noHits: "No hits!",
  }

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
      <div>{statusMessage[status]}</div>
      <div>
        {status === "success" &&
          hits.map((hit, i) => <div key={i}>🐈 {hit.breed}</div>)}
      </div>
    </div>
  )
}
