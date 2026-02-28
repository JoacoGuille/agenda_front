import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'

function CategoryDetail() {
  const { id } = useParams()
  const [categoria, setCategoria] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (esDemo()) {
      const encontrada = datosDemo.categorias.find((item) => item.id === id)
      setCategoria(encontrada || null)
      setCargando(false)
      return
    }
    let activo = true
    apiFetch(`/categories/${id}`)
      .then((info) => {
        if (activo) {
          setCategoria(info.data || info)
          setCargando(false)
        }
      })
      .catch(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  if (cargando) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Categoria</p>
            <h1>Cargando...</h1>
          </div>
        </div>
      </section>
    )
  }

  if (!categoria) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Categoria</p>
            <h1>No encontramos esa categoria</h1>
            <p className="page-subtitle">Volv? al listado y elegi otra.</p>
          </div>
          <div className="page-actions">
            <Link className="ghost-btn" to="/categorias">
              Volver a categorias
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const eventosRelacionados =
    categoria.events ||
    (esDemo()
      ? datosDemo.eventos.filter((evento) => {
          const catId = evento.category?.id || evento.categoryId
          if (catId) return catId === categoria.id
          return evento.category === categoria.name
        })
      : [])

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{categoria.name}</h1>
          <p className="page-subtitle">{categoria.description || 'Sin descripcion'}</p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/categorias">
            Volver
          </Link>
          <Link className="primary-btn" to={`/categorias/${categoria.id}/editar`}>
            Editar categoria
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3>Info rapida</h3>
          <div className="detail-list">
            <div>
              <p className="detail-label">Eventos asociados</p>
              <p className="detail-value">{categoria.eventsCount ?? eventosRelacionados.length}</p>
            </div>
            <div>
              <p className="detail-label">Estado</p>
              <p className="status status-activo">Activa</p>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Eventos vinculados</h3>
          {eventosRelacionados.length === 0 ? (
            <p className="detail-text">Todavia no hay eventos en esta categoria.</p>
          ) : (
            <ul className="panel-list">
              {eventosRelacionados.map((evento) => (
                <li key={evento.id} className="panel-item">
                  <div>
                    <p className="panel-title">{evento.title || evento.name}</p>
                    <p className="panel-subtitle">{evento.date || evento.startAt || ''}</p>
                  </div>
                  <Link className="ghost-btn small" to={`/eventos/${evento.id}`}>
                    Ver
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoryDetail