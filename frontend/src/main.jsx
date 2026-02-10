import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import store from './store/index';
import './i18n';
import rollbarInstance, { isRollbarEnabled } from './rollbarConfig';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider instance={rollbarInstance} enabled={isRollbarEnabled}>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>,
);
