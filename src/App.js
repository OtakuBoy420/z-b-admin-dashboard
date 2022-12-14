import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Orders from "./pages/Orders"
import Order from "./pages/Order"
import Customers from "./pages/Customers"
import Customer from "./pages/Customer"
import Products from "./pages/Products"
import Product from "./pages/Product"
import tokenContext from "./contexts/tokenContext"
import notificationContext from "./contexts/notificationContext"
import Layout from "./components/Layout"
import { useState } from "react"
import themeContext from "./contexts/themeContext"
import { setColors } from "./functions/setColors"
import searchContext from "./contexts/searchContext"
import confirmPopupContext from "./contexts/confirmPopupContext"
function App() {
  const [token, setToken] = useState(false) // token sfdcnhlisgnchg
  const [notification, setNotification] = useState([])
  const [search, setSearch] = useState("")
  const [popup, setPopup] = useState(false)
  /*-------------THEME LOCAL STORAGE---------- */
  const themeLS = JSON.parse(window.localStorage.getItem("theme"))
  const [savedTheme] = useState(themeLS)
  const [theme, setTheme] = useState(savedTheme || "light")

  setColors(
    theme === "dark" ? "var(--darkmode-color)" : "",
    theme === "dark" ? "var(--darkmode-text)" : "",
    theme === "dark" ? "var(--darkmode-background)" : "",
    theme === "dark" ? "var(--darkmode-theme)" : "",
    theme === "dark" ? "var(--darkmode-input)" : ""
  )
  /*------------------------------------------*/

  return (
    <notificationContext.Provider value={{ notification, setNotification }}>
      <tokenContext.Provider value={{ token, setToken }}>
        <themeContext.Provider value={{ theme, setTheme }}>
          <searchContext.Provider value={{ search, setSearch }}>
            <confirmPopupContext.Provider value={{ popup, setPopup }}>
              <BrowserRouter>
                <Routes>
                  {token ? (
                    <Route path="/" default element={<Layout />}>
                      <Route path="/" element={<Orders />} />
                      <Route path="/order/:id" element={<Order />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/customer/:id" element={<Customer />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<Product />} />
                    </Route>
                  ) : (
                    <Route path="/" default element={<Login />} />
                  )}
                </Routes>
              </BrowserRouter>
            </confirmPopupContext.Provider>
          </searchContext.Provider>
        </themeContext.Provider>
      </tokenContext.Provider>
    </notificationContext.Provider>
  )
}

export default App
