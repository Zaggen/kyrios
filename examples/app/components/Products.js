// @flow
import React from 'react'
import { useQuery } from '../hooks/store'

const Products = () => {
  const [state] = useQuery(qry => qry.products.state())

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
