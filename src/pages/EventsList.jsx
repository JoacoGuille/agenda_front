import { Link } from 'react-router-dom'
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

const normalizarLista = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.events || info.items || info.data || []
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

function EventsList() {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (esDemo()) {
      const lista = normalizarLista(datosDemo.eventos).map((evento) => {
        const inicio = evento.startAt || evento.start
        return {
          ...evento,
          fechaTxt: evento.date || formatearFecha(inicio),
          horaTxt: evento.time || formatearHora(inicio),
          categoriaTxt:
            evento.category?.name || evento.categoryName || evento.category || 'Sin categoria',
          estado: evento.status || 'programado',
        }
      })
      setEventos(lista)
      setCargando(false)
      return
    }
    let activo = true
    apiFetch('/events')
      .then((info) => {
        const lista = normalizarLista(info).map((evento) => {
          const inicio = evento.startAt || evento.start
          return {
            ...evento,
            fechaTxt: evento.date || formatearFecha(inicio),
            horaTxt: evento.time || formatearHora(inicio),
            categoriaTxt:
              evento.category?.name || evento.categoryName || evento.category || 'Sin categoria',
            estado: evento.status || 'programado',
          }
        })
        if (activo) {
          setEventos(lista)
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
          <p className="eyebrow">Agenda</p>
          <h1>Eventos</h1>
          <p className="page-subtitle">Todo lo que tenes en el calendario.</p>
        </div>
        <div className="page-actions">
          <Link className="primary-btn" to="/eventos/nuevo">
            Nuevo evento
          </Link>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Fecha</th>
              <th>Categoria</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan="5">Cargando eventos...</td>
              </tr>
            )}
            {!cargando && eventos.length === 0 && (
              <tr>
                <td colSpan="5">No hay eventos cargados.</td>
              </tr>
            )}
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>
                  <div className="table-main">
                    <p>{evento.title || evento.name}</p>
                    <span>{evento.location || 'Sin ubicacion'}</span>
                  </div>
                </td>
                <td>
                  {evento.fechaTxt}
                  {evento.horaTxt ? ` ? ${evento.horaTxt}` : ''}
                </td>
                <td>
                  <span className="pill">{evento.categoriaTxt}</span>
                </td>
                <td>
                  <span className={`status status-${evento.estado}`}>
                    {labelsEstado[evento.estado] || 'Programado'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <Link className="ghost-btn small" to={`/eventos/${evento.id}`}>
                      Ver
                    </Link>
                    <Link className="ghost-btn small" to={`/eventos/${evento.id}/editar`}>
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

export default EventsList