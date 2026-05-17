/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react"

export interface CartItem {
    id: number
    title: string,
    price: number,
    image: string,
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: CartItem) => void
    removeFromCart: (id: number) => void
    totalItems: number
    totalPrice: number
}

type CartAction = | {type: 'ADD_ITEM', payload: CartItem}
                  | {type: 'REMOVE_ITEM', payload: number}

const CART_STORAGE_KEY = 'cart-items'


function cartReducer(state:CartItem[], action: CartAction): CartItem[]{
    switch(action.type){
        case 'ADD_ITEM': {
            const existing = state.find(item => item.id === action.payload.id)
            if(existing){
                return state.map(item => item.id === action.payload.id? {...item, quantity: item.quantity+1} : item)
            }
            return [...state, action.payload]

        }
        case 'REMOVE_ITEM':{
            return state.filter(item => item.id !== action.payload)
        }

        default: 
            return state
    }
}

const CartContext = createContext<CartContextType | null>(null)

function initCartState(): CartItem[] {
    if (typeof window === 'undefined') return []

    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) return []

        const parsed = JSON.parse(raw) as CartItem[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function CartProvider({children}: {children: React.ReactNode}){
    const [items, dispatch] = useReducer(cartReducer, [], initCartState)

    function addToCart(product: CartItem){
        dispatch({type: 'ADD_ITEM', payload: product})
    }

    function removeFromCart(id: number){
        dispatch({type: 'REMOVE_ITEM', payload: id})
    }

    useEffect(() => {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items])

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return <CartContext.Provider value={{items, addToCart, removeFromCart, totalItems, totalPrice}}>{children}</CartContext.Provider>
}

export function useCart(){
    const context = useContext(CartContext)
    if(!context){
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}