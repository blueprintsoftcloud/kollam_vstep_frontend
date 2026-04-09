import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initFetchInterceptor } from './utils/fetchInterceptor';

initFetchInterceptor();

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
)
