import type { Category } from "../types/category.types";

interface Props {
    categories: Category[];
    categoryIds: string[];
    priceMin: string;
    priceMax: string;
    limit: string;
    sort: string;
    onChange: (filters: {
        categoryIds: string[];
        priceMin: string;
        priceMax: string;
        limit: string;
        sort: string;
    }) => void;
}

function ProductFilters({ categories, categoryIds, priceMin, priceMax, limit, sort, onChange }: Props) {
    function handleCategoryToggle(id: string) {
        const updated = categoryIds.includes(id)
            ? categoryIds.filter((value) => value !== id)
            : [...categoryIds, id]

        onChange({ categoryIds: updated, priceMin, priceMax, limit, sort })
    }

    return (
        <section aria-label="Product filters" className="mb-4 space-y-3 sm:mb-6">
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                    const id = String(cat.id)
                    const selected = categoryIds.includes(id)

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => handleCategoryToggle(id)}
                            className={`min-h-10 rounded border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                                selected
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-300 bg-white text-gray-700'
                            }`}
                        >
                            {cat.name}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <select
                    aria-label="Sort products"
                    value={sort}
                    onChange={(event) =>
                        onChange({ categoryIds, priceMin, priceMax, limit, sort: event.target.value })
                    }
                    className="min-h-10 rounded border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <option value="">Default sort</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>

                <input
                    aria-label="Minimum price"
                    value={priceMin}
                    onChange={(event) =>
                        onChange({ categoryIds, priceMin: event.target.value, priceMax, limit, sort })
                    }
                    placeholder="Min price"
                    inputMode="numeric"
                    className="min-h-10 rounded border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                />

                <input
                    aria-label="Maximum price"
                    value={priceMax}
                    onChange={(event) =>
                        onChange({ categoryIds, priceMin, priceMax: event.target.value, limit, sort })
                    }
                    placeholder="Max price"
                    inputMode="numeric"
                    className="min-h-10 rounded border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                />

                <input
                    aria-label="Products per page limit"
                    value={limit}
                    onChange={(event) =>
                        onChange({ categoryIds, priceMin, priceMax, limit: event.target.value, sort })
                    }
                    placeholder="Limit"
                    inputMode="numeric"
                    className="min-h-10 rounded border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                />
            </div>
        </section>
    )
}

export default ProductFilters