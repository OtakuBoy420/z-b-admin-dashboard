// Methods supported [PATCH, DELETE, POST, GET]

import { useEffect, useState, useContext } from "react"
import tokenContext from "../contexts/tokenContext"

export default function useDynamicFetch({ params, method, data }) {
  // Auth token
  const { token } = useContext(tokenContext)

  const [fetchData, setFetchData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(
    function () {
      if (params) {
        // Dette er en IIFE (immediately invoked function expression)
        ;(async function () {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}${params}`,
            {
              method: method,
              headers: {
                authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
              body: data !== null ? JSON.stringify(data) : null,
            }
          )
          if (response.status === 404) {
            setError(response.statusText)
          }
          const json = await response.json()
          setFetchData(json)
          setIsLoading(false)
        })()
      }
    },
    [params, token, data, method]
  )

  return { fetchData, isLoading, error }
}
