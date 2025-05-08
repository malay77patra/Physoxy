import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Pricing from '@/pages/Pricing'
import DefaultLayout from '@/layouts/DefaultLayout'
import GoBackLayout from '@/layouts/GoBackLayout'
import AdminOnlyLayout from '@/layouts/AdminOnlyLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<GoBackLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route element={<AdminOnlyLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

    </Routes>
  );
}
