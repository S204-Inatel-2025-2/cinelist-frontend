import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import PublicLayout from "./layout/PublicLayout"
import PrivateLayout from "./layout/PrivateLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MediaDetails from "./pages/MediaDetails"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />

        {/* Rotas privadas */}
        <Route
          path="/Home"
          element={
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          }
        />
        <Route
          path="/media/:id"
          element={
            <PrivateLayout>
              <MediaDetails/>
            </PrivateLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
