import { nextTick, ref } from 'vue'

import { VueDraggableNext } from '../../src'
/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'

// Mock Sortable.js
jest.mock('sortablejs', () => ({
  create: jest.fn(() => ({
    option: jest.fn(),
    destroy: jest.fn(),
    toArray: jest.fn(() => []),
    sort: jest.fn(),
    save: jest.fn(),
    closest: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
}))

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
}

interface CartItem extends Product {
  cartId: string
  quantity: number
}

describe('Shopping Cart Example', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: '/products/headphones.jpg',
    rating: 5,
    reviews: 128,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
  })

  it('should render products section with clone functionality', () => {
    const ProductsSection = {
      template: `
        <draggable
          v-model="products"
          :group="{ name: 'shopping', pull: 'clone', put: false }"
          :clone="cloneProduct"
          :sort="false"
          class="products-grid"
          item-key="id"
        >
          <template #item="{ element: product }">
            <div class="product-card" :data-testid="'product-' + product.id">
              <h4>{{ product.name }}</h4>
              <p class="price">\${{ product.price }}</p>
              <div class="product-rating">
                <span class="stars">{{ '★'.repeat(product.rating) }}</span>
                <span class="rating-text">({{ product.reviews }})</span>
              </div>
            </div>
          </template>
        </draggable>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const products = ref([mockProduct])

        const cloneProduct = (product: Product): CartItem => ({
          ...product,
          cartId: `${product.id}-${Date.now()}`,
          quantity: 1,
        })

        return { products, cloneProduct }
      },
    }

    const wrapper = mount(ProductsSection)

    // Check product is rendered
    expect(wrapper.find('[data-testid="product-1"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wireless Headphones')
    expect(wrapper.text()).toContain('$99.99')
    expect(wrapper.text()).toContain('★★★★★')
    expect(wrapper.text()).toContain('(128)')

    // Check draggable configuration
    const draggable = wrapper.findComponent(VueDraggableNext)
    expect(draggable.props('group')).toEqual({
      name: 'shopping',
      pull: 'clone',
      put: false,
    })
    expect(draggable.props('sort')).toBe(false)
  })

  it('should render cart section and handle item addition', async () => {
    const CartSection = {
      template: `
        <div>
          <div class="cart-stats">
            <span>{{ cartItems.length }} items</span>
            <span class="total">\${{ cartTotal }}</span>
          </div>
          
          <draggable
            v-model="cartItems"
            group="shopping"
            class="cart-items"
            @change="onCartChange"
            item-key="cartId"
          >
            <template #item="{ element: item }">
              <div class="cart-item" :data-testid="'cart-' + item.cartId">
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="price">\${{ item.price }} × {{ item.quantity }}</p>
                </div>
                <div class="item-controls">
                  <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item)" class="qty-btn">+</button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const cartItems = ref<CartItem[]>([])

        const cartTotal = ref('0.00')

        const calculateTotal = () => {
          const total = cartItems.value.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )
          cartTotal.value = total.toFixed(2)
        }

        const onCartChange = jest.fn(event => {
          if (event.added) {
            calculateTotal()
          }
        })

        const increaseQuantity = jest.fn((item: CartItem) => {
          item.quantity++
          calculateTotal()
        })

        const decreaseQuantity = jest.fn((item: CartItem) => {
          if (item.quantity > 1) {
            item.quantity--
          } else {
            const index = cartItems.value.findIndex(
              cartItem => cartItem.cartId === item.cartId
            )
            if (index > -1) {
              cartItems.value.splice(index, 1)
            }
          }
          calculateTotal()
        })

        return {
          cartItems,
          cartTotal,
          onCartChange,
          increaseQuantity,
          decreaseQuantity,
        }
      },
    }

    const wrapper = mount(CartSection)

    // Initially empty cart
    expect(wrapper.find('.cart-stats').text()).toContain('0 items')
    expect(wrapper.find('.total').text()).toBe('$0.00')

    // Add item to cart
    const vm = wrapper.vm as any
    const cartItem: CartItem = {
      ...mockProduct,
      cartId: `${mockProduct.id}-123`,
      quantity: 1,
    }

    vm.cartItems.push(cartItem)
    vm.calculateTotal()
    await nextTick()

    // Check item is displayed
    expect(wrapper.find('[data-testid="cart-1-123"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wireless Headphones')
    expect(wrapper.text()).toContain('$99.99 × 1')
    expect(wrapper.find('.cart-stats').text()).toContain('1 items')
    expect(wrapper.find('.total').text()).toBe('$99.99')
  })

  it('should handle quantity changes', async () => {
    const cartItem: CartItem = {
      ...mockProduct,
      cartId: `${mockProduct.id}-123`,
      quantity: 2,
    }

    const QuantityControls = {
      template: `
        <div class="item-controls">
          <button @click="decreaseQuantity" class="qty-btn decrease">-</button>
          <span class="quantity">{{ item.quantity }}</span>
          <button @click="increaseQuantity" class="qty-btn increase">+</button>
        </div>
      `,
      props: ['item'],
      emits: ['quantityChanged'],
      setup(props, { emit }) {
        const increaseQuantity = () => {
          props.item.quantity++
          emit('quantityChanged', props.item)
        }

        const decreaseQuantity = () => {
          if (props.item.quantity > 1) {
            props.item.quantity--
            emit('quantityChanged', props.item)
          }
        }

        return { increaseQuantity, decreaseQuantity }
      },
    }

    const wrapper = mount(QuantityControls, {
      props: { item: cartItem },
    })

    // Check initial quantity
    expect(wrapper.find('.quantity').text()).toBe('2')

    // Increase quantity
    await wrapper.find('.increase').trigger('click')
    expect(cartItem.quantity).toBe(3)
    expect(wrapper.emitted('quantityChanged')).toHaveLength(1)

    // Decrease quantity
    await wrapper.find('.decrease').trigger('click')
    expect(cartItem.quantity).toBe(2)
    expect(wrapper.emitted('quantityChanged')).toHaveLength(2)
  })

  it('should handle trash zone for item removal', async () => {
    const TrashZone = {
      template: `
        <div class="trash-zone" :class="{ active: isDragging }">
          <draggable
            v-model="trashItems"
            group="shopping"
            class="trash-area"
            @change="onTrashDrop"
          >
            <template #item="{ element }">
              <!-- Items dropped here are removed -->
            </template>
          </draggable>
          <div class="trash-content">
            <span class="trash-icon">🗑️</span>
            <span class="trash-text">Drop here to remove</span>
          </div>
        </div>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const trashItems = ref<CartItem[]>([])
        const isDragging = ref(false)

        const onTrashDrop = jest.fn(event => {
          if (event.added) {
            const droppedItem = event.added.element
            // Remove from trash (simulates deletion)
            trashItems.value = trashItems.value.filter(
              item => item.cartId !== droppedItem.cartId
            )
          }
        })

        return { trashItems, isDragging, onTrashDrop }
      },
    }

    const wrapper = mount(TrashZone)

    expect(wrapper.find('.trash-zone').exists()).toBe(true)
    expect(wrapper.find('.trash-icon').text()).toBe('🗑️')
    expect(wrapper.text()).toContain('Drop here to remove')

    // Test drag state
    const vm = wrapper.vm as any
    vm.isDragging = true
    await nextTick()
    expect(wrapper.find('.trash-zone').classes()).toContain('active')
  })

  it('should handle checkout functionality', async () => {
    const CheckoutComponent = {
      template: `
        <div>
          <div class="cart-total">\${{ cartTotal }}</div>
          <button 
            :disabled="cartItems.length === 0"
            @click="checkout"
            class="checkout-btn"
          >
            Checkout - \${{ cartTotal }}
          </button>
        </div>
      `,
      setup() {
        const cartItems = ref<CartItem[]>([
          { ...mockProduct, cartId: '1-123', quantity: 2 },
        ])

        const cartTotal = ref('199.98') // 99.99 * 2

        const checkout = jest.fn(() => {
          if (cartItems.value.length === 0) return
          alert(`Checkout completed! Total: $${cartTotal.value}`)
          cartItems.value = []
          cartTotal.value = '0.00'
        })

        return { cartItems, cartTotal, checkout }
      },
    }

    // Mock window.alert
    window.alert = jest.fn()

    const wrapper = mount(CheckoutComponent)

    // Check button is enabled with items
    expect(wrapper.find('.checkout-btn').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.checkout-btn').text()).toBe('Checkout - $199.98')

    // Click checkout
    await wrapper.find('.checkout-btn').trigger('click')
    expect(wrapper.vm.checkout).toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith(
      'Checkout completed! Total: $199.98'
    )

    // After checkout, cart should be empty
    const vm = wrapper.vm as any
    expect(vm.cartItems).toHaveLength(0)
    expect(vm.cartTotal).toBe('0.00')
  })

  it('should save cart to localStorage', () => {
    const cartItems = [{ ...mockProduct, cartId: '1-123', quantity: 1 }]

    const saveCartToLocalStorage = jest.fn(() => {
      localStorage.setItem('shopping-cart', JSON.stringify(cartItems))
    })

    saveCartToLocalStorage()

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'shopping-cart',
      JSON.stringify(cartItems)
    )
  })

  it('should load cart from localStorage', () => {
    const cartData = [{ ...mockProduct, cartId: '1-123', quantity: 1 }]

    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(cartData))

    const loadCartFromLocalStorage = () => {
      const saved = localStorage.getItem('shopping-cart')
      return saved ? JSON.parse(saved) : []
    }

    const loadedCart = loadCartFromLocalStorage()

    expect(localStorage.getItem).toHaveBeenCalledWith('shopping-cart')
    expect(loadedCart).toEqual(cartData)
  })

  it('should handle duplicate items by increasing quantity', async () => {
    const DuplicateHandler = {
      template: `
        <draggable
          v-model="cartItems"
          group="shopping"
          @change="onCartChange"
          item-key="cartId"
        >
          <template #item="{ element: item }">
            <div>{{ item.name }} ({{ item.quantity }})</div>
          </template>
        </draggable>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const cartItems = ref<CartItem[]>([
          { ...mockProduct, cartId: '1-123', quantity: 1 },
        ])

        const onCartChange = jest.fn(event => {
          if (event.added) {
            const newItem = event.added.element as CartItem

            // Check if item already exists in cart
            const existingItem = cartItems.value.find(
              item => item.id === newItem.id && item.cartId !== newItem.cartId
            )

            if (existingItem) {
              // Increase quantity instead of adding duplicate
              existingItem.quantity += newItem.quantity
              cartItems.value.splice(event.added.newIndex, 1)
            }
          }
        })

        return { cartItems, onCartChange }
      },
    }

    const wrapper = mount(DuplicateHandler)
    const draggable = wrapper.findComponent(VueDraggableNext)

    // Simulate adding the same product again
    const duplicateItem: CartItem = {
      ...mockProduct,
      cartId: '1-456', // Different cartId but same product id
      quantity: 1,
    }

    await draggable.vm.$emit('change', {
      added: {
        newIndex: 1,
        element: duplicateItem,
      },
    })

    expect(wrapper.vm.onCartChange).toHaveBeenCalled()
    // Original item should have increased quantity
    expect(wrapper.vm.cartItems[0].quantity).toBe(2)
    // Should still only have one item
    expect(wrapper.vm.cartItems).toHaveLength(1)
  })

  it('should handle removal feedback', () => {
    const showRemovalFeedback = jest.fn((item: CartItem) => {
      const notification = document.createElement('div')
      notification.className = 'removal-notification'
      notification.textContent = `${item.name} removed from cart`
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
      }, 3000)
    })

    const cartItem: CartItem = {
      ...mockProduct,
      cartId: '1-123',
      quantity: 1,
    }

    showRemovalFeedback(cartItem)

    expect(showRemovalFeedback).toHaveBeenCalledWith(cartItem)

    // Check notification was created
    const notification = document.querySelector('.removal-notification')
    expect(notification).toBeTruthy()
    expect(notification?.textContent).toBe(
      'Wireless Headphones removed from cart'
    )
  })
})
