// @flow
import React from 'react'
import { useGetters } from '../hooks/store'

const Products = () => {
  const [state] = useGetters(get => get.products.state())

  return state.status === 'loaded' ? (
    <ul>
      {state.data.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  ) : (
    <p>Loading...</p>
  )
}

export default Products
