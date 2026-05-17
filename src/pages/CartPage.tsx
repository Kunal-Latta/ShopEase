import { useCart } from "../context/CartContext"

function CartPage(){
    const { items, totalItems, totalPrice, removeFromCart } = useCart()

    if (items.length === 0) {
        return <div className="page-fade-in mx-auto w-full max-w-4xl px-3 py-6 sm:px-4"><p>Your cart is empty</p></div>
    }

    return(
        <div className="page-fade-in mx-auto w-full max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
            <h1 className="mb-4 text-2xl font-bold">Cart ({totalItems} items)</h1>
            <div className="flex flex-col gap-4">
                {items.map(item => (
                    <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="break-words font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-green-600 font-bold">${item.price * item.quantity}</p>
                        </div>
                        <button
                            aria-label={`Remove ${item.title} from cart`}
                            onClick={() => removeFromCart(item.id)}
                            className="min-h-10 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:w-auto"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-right">
                <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            </div>
        </div>
    )
}

export default CartPage