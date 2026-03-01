import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'
import { obtenerId } from '../utils/recordId.js'

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

const normalizarCategorias = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.categories || info.items || info.data || []
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
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (esDemo()) {
      setEventos(normalizarLista(datosDemo.eventos))
      setCategorias(normalizarCategorias(datosDemo.categorias))
      setCargando(false)
      return
    }
    let activo = true
    Promise.allSettled([apiFetch('/events'), apiFetch('/categories')])
      .then(([eventosRes, categoriasRes]) => {
        if (!activo) return
        if (eventosRes.status === 'fulfilled') {
          setEventos(normalizarLista(eventosRes.value))
        } else {
          setEventos([])
        }
        if (categoriasRes.status === 'fulfilled') {
          setCategorias(normalizarCategorias(categoriasRes.value))
        } else {
          setCategorias([])
        }
        setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const mapaCategorias = useMemo(() => {
    const mapa = {}
    categorias.forEach((categoria) => {
      const categoriaId = obtenerId(categoria)
      if (!categoriaId) return
      mapa[categoriaId] = categoria.name || categoria.title || categoria.label || ''
    })
    return mapa
  }, [categorias])

  const eventosVista = useMemo(
    () =>
      eventos.map((evento) => {
        const inicio = evento.startAt || evento.start || evento.date
        const categoriaId =
          evento.categoryId ||
          obtenerId(evento.category) ||
          (typeof evento.category === 'string' ? evento.category : null)
        const categoriaTxt =
          evento.category?.name ||
          evento.categoryName ||
          (categoriaId && mapaCategorias[categoriaId]) ||
          (typeof evento.category === 'string' ? evento.category : null) ||
          'Sin categoria'

        return {
          ...evento,
          eventoId: obtenerId(evento),
          fechaTxt: evento.date || formatearFecha(inicio),
          horaTxt: evento.time || formatearHora(inicio),
          categoriaTxt,
          estado: evento.status || 'programado',
        }
      }),
    [eventos, mapaCategorias],
  )

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
            {eventosVista.map((evento, index) => (
              <tr key={evento.eventoId || `${evento.title || 'evento'}-${index}`}>
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
                    <Link
                      className="ghost-btn small"
                      to={evento.eventoId ? `/eventos/${evento.eventoId}` : '/eventos'}
                    >
                      Ver
                    </Link>
                    <Link
                      className="ghost-btn small"
                      to={evento.eventoId ? `/eventos/${evento.eventoId}/editar` : '/eventos'}
                    >
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
