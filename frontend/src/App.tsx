import './css/App.css'
import {Routes, Route} from "react-router-dom"
import HomePage from "./pages/homepage"
import { RegisterPage } from './pages/registerUser'
import { LoginPage } from "./pages/loginPage"
import {NavBar} from "./components/navbar.tsx"

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
