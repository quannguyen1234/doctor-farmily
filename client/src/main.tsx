import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Geocode from 'react-geocode';

import App from './App';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';

Geocode.setApiKey(import.meta.env.VITE_GOOGLE_MAPS_API);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GlobalStyles>
  </React.StrictMode>
);
