import React from 'react'
import { Text, View, Button } from '@adobe/react-spectrum'

export function Products ({ products, onViewDetails }) {
  if (products.length === 0) {
    return (
      <View UNSAFE_className="state-message">
        <Text UNSAFE_className="state-icon">
          🔍
        </Text>

        <Text UNSAFE_style={{ display: 'block' }}>
          No products found
        </Text>

        <Text UNSAFE_style={{ display: 'block' }}>
          Try adjusting your search or filters.
        </Text>
      </View>
    )
  }

  return (
    <View UNSAFE_className="products-grid">
      {products.map((product) => (
        <View
          key={product.productId}
          UNSAFE_className="product-card"
          borderWidth="thin"
          borderColor="dark"
          borderRadius="regular"
          padding="size-300"
          UNSAFE_style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '430px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Product Image */}
          <View
            height="size-2400"
            UNSAFE_style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
              backgroundColor: '#f7f7f7',
              borderRadius: '8px',
              padding: '12px',
              boxSizing: 'border-box'
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: '180px',
                objectFit: 'contain'
              }}
            />
          </View>

          {/* Product Information */}
          <View
            UNSAFE_style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 0
            }}
          >
            <Text
              UNSAFE_style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '1.4',
                marginBottom: '10px',
                minHeight: '46px',
                overflow: 'hidden'
              }}
            >
              {product.title}
            </Text>

            <Text
              UNSAFE_style={{
                display: 'block',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '8px'
              }}
              UNSAFE_className="brand-price"
            >
              ₹{product.price}
            </Text>

            {product.rating && (
              <Text
                UNSAFE_style={{
                  display: 'block',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              >
                ⭐ {product.rating.rate} (
                {product.rating.count} reviews)
              </Text>
            )}

            <Text
              UNSAFE_className="category-badge"
              UNSAFE_style={{
                marginBottom: '16px'
              }}
            >
              {product.category}
            </Text>

            <Button
              variant="accent"
              width="100%"
              onPress={() => onViewDetails(product.productId)}
            >
              View Product
            </Button>
          </View>
        </View>
      ))}
    </View>
  )
}

export default Products
