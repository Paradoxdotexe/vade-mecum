import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import './index.css';
import { VadeMecumDocsPage } from './pages/docs/VadeMecumDocsPage';
import reportWebVitals from './reportWebVitals';
import { ValeOfMythsDocsPage } from './pages/docs/ValeOfMythsDocsPage';
import { EnginePageController } from './pages/engine/EnginePageController';
import { VestigesOfMankindDocsPage } from './pages/docs/VestigesOfMankindDocsPage';
import { HomePage } from './pages/HomePage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthStateProvider } from './pages/engine/useAuth';
import { VThemeProvider } from './common/VTheme';
import { PageWrapper } from './common/PageWrapper';
import { CharactersPage } from './pages/vtt/characters/CharactersPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<PageWrapper />}>
      <Route path="" element={<HomePage />} />

      <Route path="docs" element={<VadeMecumDocsPage />} />
      <Route path="docs/vale-of-myths" element={<ValeOfMythsDocsPage />} />
      <Route path="docs/vestiges-of-mankind" element={<VestigesOfMankindDocsPage />} />

      <Route path="vtt/characters" element={<CharactersPage />} />

      <Route
        path="engine"
        element={
          <AuthStateProvider>
            <EnginePageController />
          </AuthStateProvider>
        }
      />
    </Route>
  )
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1200000
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <VThemeProvider>
      <RouterProvider router={router} />
    </VThemeProvider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
