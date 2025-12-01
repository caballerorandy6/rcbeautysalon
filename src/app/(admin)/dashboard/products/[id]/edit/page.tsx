import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeftIcon, ImageIcon, TrashIcon } from "@/components/icons"

// Mockup data - will be replaced with real data
const product = {
  id: "1",
  name: "Professional Shampoo",
  description: "Premium salon-quality shampoo for all hair types. Enriched with natural ingredients to nourish and strengthen your hair.",
  category: "hair-care",
  price: 28.00,
  comparePrice: 35.00,
  sku: "SHMP-001",
  stock: 45,
  trackInventory: true,
  isActive: true,
  isFeatured: false,
  images: [],
}

export default function EditProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">
              {product.name}
            </p>
          </div>
        </div>
        <Button variant="destructive">
          <TrashIcon size={16} className="mr-2" />
          Delete Product
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic details about the product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" defaultValue={product.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={product.description}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  defaultValue={product.category}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a category</option>
                  <option value="hair-care">Hair Care</option>
                  <option value="styling">Styling</option>
                  <option value="nails">Nails</option>
                  <option value="skin-care">Skin Care</option>
                  <option value="tools">Tools & Accessories</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the product price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" defaultValue={product.price} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare at Price ($)</Label>
                  <Input id="comparePrice" type="number" step="0.01" defaultValue={product.comparePrice || ""} />
                  <p className="text-xs text-muted-foreground">
                    Original price for showing discount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage stock levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" defaultValue={product.sku} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" defaultValue={product.stock} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Track Inventory</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable stock tracking for this product
                  </p>
                </div>
                <Switch defaultChecked={product.trackInventory} />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product photos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
                <ImageIcon size={48} className="text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag and drop images, or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Upload Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Product is available for purchase
                  </p>
                </div>
                <Switch defaultChecked={product.isActive} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Show in featured section
                  </p>
                </div>
                <Switch defaultChecked={product.isFeatured} />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button className="w-full">Save Changes</Button>
            <Link href="/dashboard/products">
              <Button variant="outline" className="w-full">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
