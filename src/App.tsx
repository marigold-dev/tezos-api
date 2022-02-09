import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Page } from './Page'

export function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Page />} />
        <Route path=":endpoint/:network" element={<Page />} />
      </Routes>
    </BrowserRouter>
  )
}
