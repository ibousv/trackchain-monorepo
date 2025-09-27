import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async()=>{
      try{
        const res = await api.get('/products')
        setProducts(res.data)
      }catch(err){ console.error(err) }
      setLoading(false)
    })()
  },[])

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      {loading ? <div>Loading...</div> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
          {products.map(p=> (
            <div key={p._id} style={{border:'1px solid #ddd',padding:10}}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <Link to={`/product/${p._id}`}>Voir</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
