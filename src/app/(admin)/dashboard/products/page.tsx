import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  PackageIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const products = [
  { id: "1", name: "Professional Shampoo", category: "Hair Care", price: 28.00, comparePrice: 35.00, stock: 45, sku: "SHMP-001", isActive: true },
  { id: "2", name: "Moisturizing Conditioner", category: "Hair Care", price: 26.00, comparePrice: null, stock: 32, sku: "COND-001", isActive: true },
  { id: "3", name: "Hair Styling Gel", category: "Styling", price: 18.00, comparePrice: 22.00, stock: 28, sku: "GEL-001", isActive: true },
  { id: "4", name: "Nail Polish Set", category: "Nails", price: 45.00, comparePrice: null, stock: 15, sku: "NAIL-001", isActive: true },
  { id: "5", name: "Face Moisturizer", category: "Skin Care", price: 52.00, comparePrice: 65.00, stock: 0, sku: "SKIN-001", isActive: true },
  { id: "6", name: "Hair Serum", category: "Hair Care", price: 34.00, comparePrice: null, stock: 8, sku: "SER-001", isActive: false },
]

export default function ProductsPage() {
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
            <CardTitle className="text-3xl">48</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Stock</CardDescription>
            <CardTitle className="text-3xl text-green-600">42</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">4</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Out of Stock</CardDescription>
            <CardTitle className="text-3xl text-red-600">2</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <PackageIcon size={20} className="text-muted-foreground" />
                        </div>
                        <p className="font-medium">{product.name}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{product.category}</td>
                    <td className="py-4 text-sm font-mono text-muted-foreground">{product.sku}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${product.comparePrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}>
                        {product.stock}
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
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
