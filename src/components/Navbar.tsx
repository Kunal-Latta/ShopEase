import { Link } from 'react-router-dom'

function Navbar(){
    return(
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                <Link to="/" className="text-lg font-bold text-gray-900">
                    ShopEase
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        Home
                    </Link>
                    <Link
                        to="/cart"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        Cart
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar