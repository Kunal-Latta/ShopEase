import { BrowserRouter } from 'react-router-dom';
import './App.css'
import AppRouter from './app/router';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <BrowserRouter>
    <CartProvider>
      <Navbar/>
      <AppRouter/>
    </CartProvider>
    </BrowserRouter>
  )
}

export default App
