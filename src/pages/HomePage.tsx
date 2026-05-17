import {  useEffect, useState } from "react"
import { getProducts,getCategories } from "../services/api"
import type { Product } from "../types/product.types"
import type { Category } from "../types/category.types"
import ProductCard from "@/components/ProductCard"
import { useSearchParams } from "react-router-dom"
import ProductFilters from "../components/ProductFilters"

function HomePage(){
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [categories, setCategories] = useState<Category[]>([])

    const categoryIds = searchParams.getAll('categoryId')
    const priceMin = searchParams.get('price_min') ?? ''
    const priceMax = searchParams.get('price_max') ?? ''
    const limit = searchParams.get('limit') ?? ''
    const sort = searchParams.get('sort') ?? ''
    const queryKey = searchParams.toString()

    const [sortBy, order] = sort.split('-') as ["price" | undefined, "asc" | "desc" | undefined]

    function handleFiltersChange(filters: {
        categoryIds: string[]
        priceMin: string
        priceMax: string
        limit: string
        sort: string
    }) {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete('categoryId')
        filters.categoryIds.forEach((id) => newParams.append('categoryId', id))
        if (filters.priceMin) newParams.set('price_min', filters.priceMin)
        else newParams.delete('price_min')
        if (filters.priceMax) newParams.set('price_max', filters.priceMax)
        else newParams.delete('price_max')
        if (filters.limit) newParams.set('limit', filters.limit)
        else newParams.delete('limit')
        if (filters.sort) newParams.set('sort', filters.sort)
        else newParams.delete('sort')
        setSearchParams(newParams)
    }

    const toNumber = (value: string): number | undefined => {
        if (!value.trim()) return undefined
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : undefined
    }

    function applySort(items: Product[]): Product[] {
        if (sortBy !== 'price' || !order) return items

        const sorted = [...items]
        sorted.sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price))
        return sorted
    }

    function applyPriceFilter(items: Product[]): Product[] {
        const min = toNumber(priceMin)
        const max = toNumber(priceMax)

        return items.filter((item) => {
            if (min !== undefined && item.price < min) return false
            if (max !== undefined && item.price > max) return false
            return true
        })
    }

    function applyPagination(items: Product[]): Product[] {
        const parsedLimit = toNumber(limit)
        if (parsedLimit === undefined) return items

        const safeLimit = Math.max(0, Math.trunc(parsedLimit))
        return items.slice(0, safeLimit)
    }
    

    useEffect(() =>{
        async function fetchCategories(){
            try {
                const response = await getCategories()
                setCategories(response)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Something went wrong')
            }
        }
        fetchCategories()
    }, [])

    useEffect(()=>{
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)
            try{
                const baseFilters = {
                    sortBy,
                    order,
                    priceMin: toNumber(priceMin),
                    priceMax: toNumber(priceMax),
                }

                if (categoryIds.length === 0) {
                    const response = await getProducts(baseFilters)
                    setProducts(applyPagination(applySort(applyPriceFilter(response))))
                } else {
                    const responses = await Promise.all(
                        categoryIds.map((id) =>
                            getProducts({
                                ...baseFilters,
                                categoryId: toNumber(id),
                            })
                        )
                    )

                    const merged = responses.flat()
                    const uniqueById = Array.from(new Map(merged.map((item) => [item.id, item])).values())
                    setProducts(applyPagination(applySort(applyPriceFilter(uniqueById))))
                }
            }catch(error){
                setError(error instanceof Error ? error.message : 'Something went wrong')
            }finally{
                setLoading(false);
            }
        }
        fetchProducts();
    },[queryKey])

    return(
        <div className="page-fade-in mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
            <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Home Page</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="break-words text-red-600">{error}</p>}
            <ProductFilters
                categories={categories}
                categoryIds={categoryIds}
                priceMin={priceMin}
                priceMax={priceMax}
                limit={limit}
                sort={sort}
                onChange={handleFiltersChange}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default HomePage