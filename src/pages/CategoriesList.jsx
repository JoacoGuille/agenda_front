import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

const normalizarLista = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.categories || info.items || info.data || []
}

function CategoriesList() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    apiFetch('/categories')
      .then((info) => {
        if (activo) {
          setCategorias(normalizarLista(info))
          setCargando(false)
        }
      })
      .catch(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Entidad relacionada</p>
          <h1>Categorias</h1>
          <p className="page-subtitle">
            Gestiona las categorias que se vinculan con los eventos.
          </p>
        </div>
        <div className="page-actions">
          <Link className="primary-btn" to="/categorias/nueva">
            Nueva categoria
          </Link>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Descripcion</th>
              <th>Eventos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan="4">Cargando categorias...</td>
              </tr>
            )}
            {!cargando && categorias.length === 0 && (
              <tr>
                <td colSpan="4">No hay categorias cargadas.</td>
              </tr>
            )}
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>
                  <div className="table-main">
                    <p>{categoria.name}</p>
                  </div>
                </td>
                <td>{categoria.description || 'Sin descripcion'}</td>
                <td>{categoria.eventsCount ?? categoria.events?.length ?? 0}</td>
                <td>
                  <div className="table-actions">
                    <Link className="ghost-btn small" to={`/categorias/${categoria.id}`}>
                      Ver
                    </Link>
                    <Link className="ghost-btn small" to={`/categorias/${categoria.id}/editar`}>
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CategoriesList