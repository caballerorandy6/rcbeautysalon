import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PackageIcon,
  PlusIcon,
  PencilIcon,
} from "@/components/icons"
import { getAdminProducts, getProductStats } from "@/app/actions/products"
import { ProductSearch } from "@/components/dashboard/product-search"
import { DeleteProductButton } from "@/components/dashboard/delete-product-button"

interface ProductsPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search } = await searchParams
  const [products, stats] = await Promise.all([
    getAdminProducts(search),
    getProductStats(),
  ])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your shop inventory
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <PlusIcon size={16} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-3xl">{stats.totalProducts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Stock</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.inStock}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.lowStock}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Out of Stock</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.outOfStock}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <ProductSearch />

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found.</p>
              <Link href="/dashboard/products/new" className="mt-4 inline-block">
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  Add First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">SKU</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                              <PackageIcon size={20} className="text-muted-foreground" />
                            </div>
                          )}
                          <p className="font-medium">{product.name}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{product.category?.name || "Uncategorized"}</td>
                      <td className="py-4 text-sm font-mono text-muted-foreground">{product.sku || "-"}</td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">${product.price.toFixed(2)}</p>
                          {product.compareAtPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${product.compareAtPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`font-medium ${
                          product.stockQuantity === 0
                            ? "text-red-600"
                            : product.stockQuantity <= 10
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <PencilIcon size={16} />
                            </Button>
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
