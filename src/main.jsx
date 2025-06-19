import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import NovaObservacao from './pages/NovaObservacao.jsx'
import Historico from './pages/Historico.jsx'
import Ops from './pages/Ops.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/nova-observacao" element={<NovaObservacao />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/ops" element={<Ops />} />
</Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
