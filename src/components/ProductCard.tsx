import type { Product } from '@/types/product.types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

function ProductCard({product}: ProductCardProps){

    const thumbnail = product.images[0] ?? 'https://placehold.co/600x400';

    return(
            <Link to={`/product/${product.id}`} className='group block h-full min-w-0 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
                <div className="overflow-hidden">
                    <img src = {thumbnail} alt = {product.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="p-4 flex flex-col gap-1">
                    <h3 className="truncate text-base font-semibold text-gray-800">{product.title}</h3>
                    <p className="text-lg font-bold text-green-600 mt-2">${product.price}</p>
                    <p className="break-words text-sm text-gray-500 line-clamp-2" >{product.description}</p>
                </div>
            </Link>
    )
}

export default ProductCard