import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  Route,
  RouterProvider
} from 'react-router-dom';
import './index.css';
import { VadeMecumDocsPage } from './pages/docs/VadeMecumDocsPage';
import reportWebVitals from './reportWebVitals';
import styled from 'styled-components';
import { ValeOfMythsDocsPage } from './pages/docs/ValeOfMythsDocsPage';
import { EncounterEnginePage } from './pages/engine/EncounterEnginePage';
import { VestigesOfMankindDocsPage } from './pages/docs/VestigesOfMankindDocsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" loader={() => redirect('/docs')} />
      <Route path="docs" element={<VadeMecumDocsPage />} />
      <Route path="docs/vale-of-myths" element={<ValeOfMythsDocsPage />} />
      <Route path="docs/vestiges-of-mankind" element={<VestigesOfMankindDocsPage />} />
      <Route path="engine" element={<EncounterEnginePage />} />
    </Route>
  )
);

const PageWrapper = styled.div`
  background: #2c2c2c;
  color: #fcfcfc;
  min-height: 100vh;
  overflow: auto;
  font-size: 16px;
  line-height: 1;

  * {
    box-sizing: border-box;
  }
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PageWrapper>
      <RouterProvider router={router} />
    </PageWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
