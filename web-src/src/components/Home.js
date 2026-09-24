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
  const [categories, setCategories] = useState(['all'])
  const [searchTerm, setSearchTerm] = useState('')

  const [query, setQuery] = useState({
    search: '',
    category: 'all',
    sort: 'default',
    page: 1
  })

  const [totalPages, setTotalPages] =
    useState(1)
  const [totalCount, setTotalCount] =
    useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const productsPerPage = 6

  useEffect(() => {
    const handle = setTimeout(() => {
      setQuery((prev) => {
        if (prev.search === searchTerm) {
          return prev
        }

        return {
          ...prev,
          search: searchTerm,
          page: 1
        }
      })
    }, 400)

    return () => clearTimeout(handle)
  }, [searchTerm])

  useEffect(() => {
    loadProducts(query)
  }, [query])

  async function loadProducts (query) {
    setLoading(true)
    setError('')

    try {
      const userToken =
        sessionStorage.getItem('userToken')

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
          token: userToken,
          page: query.page,
          limit: productsPerPage,
          search: query.search,
          category: query.category,
          sort: query.sort
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
        setTotalPages(response.totalPages || 1)
        setTotalCount(response.totalCount || 0)
        setCategories([
          'all',
          ...(response.categories || [])
        ])
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

  const paginatedProducts = products

  function handleSearchChange (value) {
    setSearchTerm(value)
  }

  function handleCategoryChange (value) {
    setQuery((prev) => ({
      ...prev,
      category: value,
      page: 1
    }))
  }

  function handleSortChange (value) {
    setQuery((prev) => ({
      ...prev,
      sort: value,
      page: 1
    }))
  }

  function goToPreviousPage () {
    setQuery((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1)
    }))
  }

  function goToNextPage () {
    setQuery((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, totalPages)
    }))
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
            selectedKey={query.category}
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
            selectedKey={query.sort}
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
        {totalCount} products
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
            isDisabled={query.page === 1}
          >
            Previous
          </Button>

          <Text>
            Page {query.page} of {totalPages}
          </Text>

          <Button
            variant="secondary"
            onPress={goToNextPage}
            isDisabled={
              query.page === totalPages
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