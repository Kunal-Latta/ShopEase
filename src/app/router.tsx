
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import { Routes, Route } from 'react-router-dom';

function AppRouter(){
    return (
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/product/:id" element={<ProductDetailPage/>} />
                <Route path="/cart" element={<CartPage/>} />
            </Routes>
    )
}

export default AppRouter