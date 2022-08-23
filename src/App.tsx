import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Page } from './components/Page'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Page />} />
          <Route path=":endpoint/:network" element={<Page />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
