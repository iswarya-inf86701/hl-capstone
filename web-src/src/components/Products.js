import React, { useEffect, useState } from 'react'
import {
  Heading,
  View,
  Text,
  Flex,
  ProgressCircle,
  TextField,
  Picker,
  Item,
  Button
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import actionWebInvoke from '../utils'
import allActions from '../config.json'
import './Products.css'

export function Products () {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState('all')
  const [sortOption, setSortOption] =
    useState('default')
  const [currentPage, setCurrentPage] =
    useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const productsPerPage = 6

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts () {
    setLoading(true)
    setError('')

    try {
      const response = await actionWebInvoke(
        allActions['hl-capstone/get-products'],
        {},
        {}
      )

      console.log(
        'Get products response:',
        response
      )

      if (response.success === true) {
        setProducts(response.products || [])
      } else {
        setError(
          response.message ||
          'Unable to load products.'
        )
      }
    } catch (err) {
      console.log(
        'Get products request failed:',
        err
      )

      setError(
        'Unable to load products. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'all',
    ...new Set(
      products.map(
        (product) => product.category
      )
    )
  ]

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

      const matchesCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory

      return (
        matchesSearch &&
        matchesCategory
      )
    }
  )

  const sortedProducts = [
    ...filteredProducts
  ]

  switch (sortOption) {
    case 'price-low':
      sortedProducts.sort(
        (a, b) => a.price - b.price
      )
      break

    case 'price-high':
      sortedProducts.sort(
        (a, b) => b.price - a.price
      )
      break

    case 'rating-low':
      sortedProducts.sort(
        (a, b) =>
          (a.rating?.rate || 0) -
          (b.rating?.rate || 0)
      )
      break

    case 'rating-high':
      sortedProducts.sort(
        (a, b) =>
          (b.rating?.rate || 0) -
          (a.rating?.rate || 0)
      )
      break

    case 'name-az':
      sortedProducts.sort(
        (a, b) =>
          a.title.localeCompare(b.title)
      )
      break

    case 'name-za':
      sortedProducts.sort(
        (a, b) =>
          b.title.localeCompare(a.title)
      )
      break

    default:
      break
  }

  const totalPages = Math.ceil(
    sortedProducts.length /
    productsPerPage
  )

  const startIndex =
    (currentPage - 1) *
    productsPerPage

  const paginatedProducts =
    sortedProducts.slice(
      startIndex,
      startIndex + productsPerPage
    )

  function handleSearchChange (value) {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  function handleCategoryChange (value) {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  function handleSortChange (value) {
    setSortOption(value)
    setCurrentPage(1)
  }

  function goToPreviousPage () {
    setCurrentPage(
      (page) => Math.max(page - 1, 1)
    )
  }

  function goToNextPage () {
    setCurrentPage(
      (page) =>
        Math.min(page + 1, totalPages)
    )
  }

  function viewProductDetails (productId) {
    navigate(`/products/${productId}`)
  }

  if (loading) {
    return (
      <View
        width="100%"
        padding="size-400"
      >
        <Flex
          direction="column"
          alignItems="center"
          gap="size-200"
        >
          <ProgressCircle
            size="L"
            isIndeterminate
            aria-label="Loading products"
          />

          <Text>
            Loading products...
          </Text>
        </Flex>
      </View>
    )
  }

  if (error) {
    return (
      <View
        width="100%"
        padding="size-400"
      >
        <Heading level={1}>
          Products
        </Heading>

        <Text
          UNSAFE_style={{
            display: 'block',
            color: '#d7373f',
            marginTop: '20px'
          }}
        >
          {error}
        </Text>
      </View>
    )
  }

  return (
    <View
      width="100%"
      padding="size-400"
      UNSAFE_style={{
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      {/* Page Header */}
      <Heading level={1}>
        Products
      </Heading>

      {/* Search / Filter / Sort */}
      <Flex
        gap="size-200"
        marginTop="size-300"
        marginBottom="size-400"
        alignItems="end"
        wrap
        UNSAFE_style={{
          maxWidth: '100%'
        }}
      >
        <TextField
          label="Search products"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={handleSearchChange}
          width="size-4600"
        />

        <Picker
          label="Category"
          selectedKey={selectedCategory}
          onSelectionChange={
            handleCategoryChange
          }
          width="size-2400"
        >
          {categories.map(
            (category) => (
              <Item
                key={category}
                textValue={category}
              >
                {category === 'all'
                  ? 'All Categories'
                  : category}
              </Item>
            )
          )}
        </Picker>

        <Picker
          label="Sort By"
          selectedKey={sortOption}
          onSelectionChange={
            handleSortChange
          }
          width="size-2400"
        >
          <Item key="default">
            Default
          </Item>

          <Item key="price-low">
            Price: Low to High
          </Item>

          <Item key="price-high">
            Price: High to Low
          </Item>

          <Item key="rating-low">
            Rating: Low to High
          </Item>

          <Item key="rating-high">
            Rating: High to Low
          </Item>

          <Item key="name-az">
            Name: A to Z
          </Item>

          <Item key="name-za">
            Name: Z to A
          </Item>
        </Picker>
      </Flex>

      {/* Product Count */}
      <Text
        UNSAFE_style={{
          display: 'block',
          marginBottom: '24px'
        }}
      >
        Showing {paginatedProducts.length} of{' '}
        {sortedProducts.length} products
      </Text>

      {/* Product Cards */}
      {paginatedProducts.length === 0 ? (
        <Text>
          No products found.
        </Text>
      ) : (
        <View
          UNSAFE_className="products-grid"
        >
          {paginatedProducts.map(
            (product) => (
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
                  boxShadow:
                    '0 2px 8px rgba(0, 0, 0, 0.08)'
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
                  {/* Product Title */}
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

                  {/* Price */}
                  <Text
                    UNSAFE_style={{
                      display: 'block',
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '8px'
                    }}
                  >
                    ${product.price}
                  </Text>

                  {/* Rating */}
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

                  {/* Category */}
                  <Text
                    UNSAFE_style={{
                      display: 'block',
                      fontSize: '14px',
                      textTransform: 'capitalize',
                      marginBottom: '16px'
                    }}
                  >
                    {product.category}
                  </Text>

                  {/* View Product Button */}
                  <Button
                    variant="accent"
                    width="100%"
                    onPress={() =>
                      viewProductDetails(
                        product.productId
                      )
                    }
                  >
                    View Product
                  </Button>
                </View>
              </View>
            )
          )}
        </View>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex
          justifyContent="center"
          alignItems="center"
          gap="size-200"
          marginTop="size-500"
        >
          <Button
            variant="secondary"
            onPress={goToPreviousPage}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>

          <Text>
            Page {currentPage} of {totalPages}
          </Text>

          <Button
            variant="secondary"
            onPress={goToNextPage}
            isDisabled={
              currentPage === totalPages
            }
          >
            Next
          </Button>
        </Flex>
      )}
    </View>
  )
}

export default Products