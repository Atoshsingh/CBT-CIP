import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { Toaster } from './components/ui/sonner.jsx'
// import store from './redux/store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from './redux/store.jsx'

let persistor=persistStore(store)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null}  persistor={persistor}>
      <App />
    <Toaster />                                   
      </PersistGate>
    </Provider>
  </StrictMode>,
)
