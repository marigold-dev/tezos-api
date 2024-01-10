import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Page } from './components/Page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Page />} />
          <Route path="/:type/:protocol" element={<Page />} />
          <Route path="/:type/:protocol/:rc" element={<Page />} />
        </Routes>
      </BrowserRouter>
    </PersistQueryClientProvider>
  )
}

export default App
