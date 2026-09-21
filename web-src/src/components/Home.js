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
import { useAuth } from './AuthContext'
import { Products } from './Products'
import './Products.css'

export function Home () {
  const navigate = useNavigate()
  const { logout } = useAuth()

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
      // Get the application user token
      // stored after successful login.
      const userToken =
        sessionStorage.getItem('userToken')

      // Make sure a token exists before
      // calling the protected product action.
      if (!userToken) {
        setError(
          'Your session has expired. Please log in again.'
        )
        return
      }

      const response = await actionWebInvoke(
        allActions[
          'hl-capstone/get-products'
        ],
        {},
        {
          token: userToken
        }
      )

      console.log(
        'Get products response:',
        response
      )

      if (response.success === true) {
        setProducts(
          response.products || []
        )
        setCurrentPage(1)
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

      if (err.status === 401) {
        setError(
          'Your session has expired. Please log in again.'
        )
      } else {
        setError(
          'Unable to load products. Please try again later.'
        )
      }
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
      <View UNSAFE_className="page-container">
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
      <View UNSAFE_className="page-container">
        <Heading level={1}>
          Products
        </Heading>

        <Text UNSAFE_className="error-text">
          {error}
        </Text>

        <Button
          variant="accent"
          marginTop="size-300"
          onPress={() => {
            logout()
            navigate('/login')
          }}
        >
          Login
        </Button>
      </View>
    )
  }

  return (
    <View UNSAFE_className="page-container">
      {/* Home Header */}
      <View UNSAFE_className="page-header">
        <Heading level={1}>
          Welcome to the Store
        </Heading>

        <Text UNSAFE_className="page-subtitle">
          Explore our products
        </Text>
      </View>

      {/* Search / Filter / Sort */}
      <View UNSAFE_className="filter-bar">
        <View UNSAFE_className="filter-search">
          <TextField
            label="Search products"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={handleSearchChange}
            width="100%"
          />
        </View>

        <View UNSAFE_className="filter-category">
          <Picker
            label="Category"
            selectedKey={selectedCategory}
            onSelectionChange={
              handleCategoryChange
            }
            width="100%"
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
        </View>

        <View UNSAFE_className="filter-sort">
          <Picker
            label="Sort By"
            selectedKey={sortOption}
            onSelectionChange={
              handleSortChange
            }
            width="100%"
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
        </View>
      </View>

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
      <Products
        products={paginatedProducts}
        onViewDetails={viewProductDetails}
      />

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

export default Home