import { Link } from "react-router-dom"
import type { Product } from "../types/product.types"
import { useState, useEffect } from "react"
import { getProductById } from "../services/api"
import { useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"


function ProductDetailPage(){
    const {id} = useParams<{id: string}>()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const {addToCart} = useCart()

    useEffect(()=>{

        if(!id) return;

        const fetchProduct = async () => {

            try {
                const data = await getProductById(Number(id));
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    },[id])

    if(!id) {
        return (
            <div className="page-fade-in mx-auto w-full max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
                <h2 className="mb-3 text-xl font-semibold">Error: Product Id is required</h2>
                <Link className="text-blue-600 hover:underline" to="/">Back to Home</Link>
            </div>
        )
    }


    return(
        <div className="page-fade-in mx-auto w-full max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Product Detail Page</h1>
            <Link className="text-blue-600 hover:underline" to="/">Back to Home</Link>
            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="mt-4 break-words text-red-600">{error}</p>}
            {product && (
                <div className="mt-4 rounded-lg border border-gray-200 p-4 sm:p-5">
                    <h2 className="break-words text-xl font-semibold">{product.title}</h2>
                    <p className="mt-2 break-words text-gray-600">{product.description}</p>
                    <p className="mt-2 text-lg font-bold text-green-600">Price: ${product.price}</p>
                    <button aria-label="Add item to cart" className="mt-4 min-h-10 rounded-lg bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => addToCart({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.images[0],
                        quantity: 1
                    })}>Add to Cart</button>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {product.images.map((img, index) => {
                            return <img key={index} src={img} alt={product.title} className="h-44 w-full rounded-md object-cover sm:h-52" />
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetailPage