import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'

const labelsEstado = {
  programado: 'Programado',
  confirmado: 'Confirmado',
  urgente: 'Urgente',
  pendiente: 'Pendiente',
}

const formatearFecha = (valor) => {
  if (!valor) return ''
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return fecha.toLocaleDateString('es-AR')
}

const formatearHora = (valor) => {
  if (!valor) return ''
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function EventDetail() {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (esDemo()) {
      const encontrado = datosDemo.eventos.find((item) => item.id === id)
      setEvento(encontrado || null)
      setCargando(false)
      return
    }
    let activo = true
    apiFetch(`/events/${id}`)
      .then((info) => {
        if (activo) {
          setEvento(info.data || info)
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
            <p className="eyebrow">Evento</p>
            <h1>Cargando...</h1>
          </div>
        </div>
      </section>
    )
  }

  if (!evento) {
    return (
      <section className="page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Evento</p>
            <h1>No encontramos ese evento</h1>
            <p className="page-subtitle">Volv? al listado y elegi otro.</p>
          </div>
          <div className="page-actions">
            <Link className="ghost-btn" to="/eventos">
              Volver a eventos
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const inicio = evento.startAt || evento.start || evento.date
  const fechaTxt = evento.date || formatearFecha(inicio)
  const horaTxt = evento.time || formatearHora(inicio)
  const categoriaTxt =
    evento.category?.name || evento.categoryName || evento.category || 'Sin categoria'

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{evento.title || evento.name}</h1>
          <p className="page-subtitle">
            {fechaTxt}
            {horaTxt ? ` ? ${horaTxt}` : ''}
            {evento.location ? ` ? ${evento.location}` : ''}
          </p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/eventos">
            Volver
          </Link>
          <Link className="primary-btn" to={`/eventos/${evento.id}/editar`}>
            Editar evento
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3>Info rapida</h3>
          <p className="detail-text">{evento.description || 'Sin descripcion'}</p>
          <div className="detail-list">
            <div>
              <p className="detail-label">Categoria</p>
              <p className="detail-value">{categoriaTxt}</p>
            </div>
            <div>
              <p className="detail-label">Estado</p>
              <p className={`status status-${evento.status || 'programado'}`}>
                {labelsEstado[evento.status] || 'Programado'}
              </p>
            </div>
            <div>
              <p className="detail-label">Lugar</p>
              <p className="detail-value">{evento.location || 'Sin ubicacion'}</p>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Acciones</h3>
          <p className="detail-text">Si queres eliminarlo, entra a la edicion.</p>
          <Link className="ghost-btn" to={`/eventos/${evento.id}/editar`}>
            Ir a editar
          </Link>
        </div>
      </div>
    </section>
  )
}

export default EventDetail