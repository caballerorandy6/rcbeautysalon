import { create, type StateCreator } from "zustand"
import { persist, type PersistOptions } from "zustand/middleware"
import { toast } from "sonner"

export interface CartItem {
  productId: string
  name: string
  image: string | null
  quantity: number
  price: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  deleteItem: (productId: string) => void
}

type CartPersist = (
  config: StateCreator<CartState>,
  options: PersistOptions<CartState>
) => StateCreator<CartState>

export const useCartStore = create<CartState>(
  (persist as CartPersist)(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(
          (item) => item.productId === product.productId
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
          toast.success(`Increased quantity of ${product.name} in your cart.`)
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
          toast.success(`Added ${product.name} to your cart.`)
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      deleteItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
