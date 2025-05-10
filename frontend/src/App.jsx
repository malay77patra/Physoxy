import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Pricing from '@/pages/Pricing'
import Checkout from '@/pages/Checkout'
import Blog from '@/pages/Blog'
import DefaultLayout from '@/layouts/DefaultLayout'
import GoBackLayout from '@/layouts/GoBackLayout'
import AdminOnlyLayout from '@/layouts/AdminOnlyLayout'
import AuthorizedLayout from '@/layouts/AuthorizedLayout'

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

        <Route element={<AuthorizedLayout />}>
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/blog/:id" element={<Blog />} />
        </Route>

        <Route element={<AdminOnlyLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

    </Routes>
  )
}
