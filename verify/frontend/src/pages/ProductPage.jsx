import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'

export default function ProductPage(){
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{
    (async()=>{
      try{
        const res = await api.get(`/products/${id}`)
        setData(res.data)
        console.log("Product data:", res.data) // ✅ ici ça marche
      }catch(err){ console.error(err) }
    })()
  },[id])

  if (!data) return <div>Loading...</div>

  return (
    <div style={{padding:20}}>
      <h2>{data.product.name}</h2>
      <p>{data.product.description}</p>
      <h3>Timeline</h3>
      {data.traces.length===0 ? <p>Aucun événement</p> : (
        <ul>
          {data.traces.map(t => (
            <li key={t._id}>
              <b>{t.type}</b> par {t.product || 'unknown'} le {new Date(t.timestamp).toLocaleString()} {' '}
              {t.hederaTxId && <span>— Hedera: {t.hederaTxId}</span>}
              <div>{JSON.stringify(t.data)}</div>
            </li>
          ))}
        </ul>
      )}

      <h3>Ajouter un événement</h3>
      <AddTraceForm productId={id} onAdded={trace=> setData(prev=> ({...prev, traces: [trace, ...prev.traces]}))} />
    </div>
  )
}

function AddTraceForm({ productId, onAdded }){
  const [type, setType] = useState('production')
  const [payload, setPayload] = useState('')

  const submit = async e => {
    e.preventDefault()
    try{
      const res = await api.post('/traces', { product: productId, type, data: { note: payload } })
      onAdded(res.data.trace)
      setPayload('')
    }catch(err){ alert('Erreur') }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="production">Production</option>
          <option value="transport">Transport</option>
          <option value="storage">Storage</option>
          <option value="health_check">Health check</option>
          <option value="sale">Sale</option>
          <option value="inspection">Inspection</option>
        </select>
      </div>
      <div><input placeholder="Détail" value={payload} onChange={e=>setPayload(e.target.value)} /></div>
      <button>Ajouter</button>
    </form>
  )
}
