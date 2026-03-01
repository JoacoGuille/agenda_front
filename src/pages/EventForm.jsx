import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { esDemo } from '../utils/demoMode.js'
import { datosDemo } from '../data/datosDemo.js'
import { obtenerId } from '../utils/recordId.js'
import { esObjectId } from '../utils/idValidation.js'
import { obtenerMensajeError } from '../utils/apiError.js'

function EventForm() {
  const { id } = useParams()
  const irA = useNavigate()
  const ubicacion = useLocation()
  const esEdicion = Boolean(id)
  const volverA = ubicacion.state?.from || '/eventos'

  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [formulario, setFormulario] = useState({
    title: '',
    date: '',
    time: '',
    categoryId: '',
    location: '',
    status: 'programado',
    description: '',
  })

  useEffect(() => {
    if (esDemo()) {
      setCategorias(datosDemo.categorias)
      return
    }
    apiFetch('/categories')
      .then((info) => {
        const lista = Array.isArray(info) ? info : info.categories || info.items || info.data || []
        setCategorias(lista)
      })
      .catch(() => setCategorias([]))
  }, [])

  useEffect(() => {
    if (!esEdicion) return
    if (esDemo()) {
      const evento = datosDemo.eventos.find((item) => item.id === id)
      if (!evento) {
        setMensajeError('No se pudo cargar el evento.')
        return
      }
      const inicio = evento.startAt || evento.start
      let fecha = evento.date || ''
      let hora = evento.time || ''
      if (inicio) {
        const parsed = new Date(inicio)
        if (!Number.isNaN(parsed.getTime())) {
          fecha = parsed.toISOString().slice(0, 10)
          hora = parsed.toTimeString().slice(0, 5)
        }
      }
      setFormulario({
        title: evento.title || evento.name || '',
        date: fecha,
        time: hora,
        categoryId: evento.categoryId || obtenerId(evento.category) || '',
        location: evento.location || '',
        status: evento.status || 'programado',
        description: evento.description || '',
      })
      return
    }
    apiFetch(`/events/${id}`)
      .then((info) => {
        const evento = info.data || info
        const inicio = evento.startAt || evento.start
        let fecha = evento.date || ''
        let hora = evento.time || ''
        if (inicio) {
          const parsed = new Date(inicio)
          if (!Number.isNaN(parsed.getTime())) {
            fecha = parsed.toISOString().slice(0, 10)
            hora = parsed.toTimeString().slice(0, 5)
          }
        }
        setFormulario({
          title: evento.title || evento.name || '',
          date: fecha,
          time: hora,
          categoryId: evento.categoryId || obtenerId(evento.category) || '',
          location: evento.location || '',
          status: evento.status || 'programado',
          description: evento.description || '',
        })
      })
      .catch(() => setMensajeError('No se pudo cargar el evento.'))
  }, [id, esEdicion])

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const guardarForm = async (eventoForm) => {
    eventoForm.preventDefault()
    setMensajeError('')
    setCargando(true)

    if (esDemo()) {
      setTimeout(() => {
        setCargando(false)
        irA(volverA)
      }, 400)
      return
    }

    if (formulario.categoryId && !esObjectId(formulario.categoryId)) {
      setMensajeError('La categoria seleccionada es invalida.')
      setCargando(false)
      return
    }

    const inicio =
      formulario.date && formulario.time
        ? new Date(`${formulario.date}T${formulario.time}:00`).toISOString()
        : null

    const datosEnvio = {
      title: formulario.title,
      description: formulario.description,
      location: formulario.location,
      status: formulario.status,
      ...(esObjectId(formulario.categoryId) ? { categoryId: formulario.categoryId } : {}),
      ...(inicio ? { startAt: inicio } : {}),
    }

    try {
      if (esEdicion) {
        await apiFetch(`/events/${id}`, {
          method: 'PUT',
          body: JSON.stringify(datosEnvio),
        })
      } else {
        await apiFetch('/events', {
          method: 'POST',
          body: JSON.stringify(datosEnvio),
        })
      }
      irA(volverA)
    } catch (err) {
      setMensajeError(obtenerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  const borrarEvento = async () => {
    const confirmado = window.confirm('Eliminar este evento?')
    if (!confirmado) return
    if (esDemo()) {
      irA(volverA)
      return
    }
    setCargando(true)
    try {
      await apiFetch(`/events/${id}`, { method: 'DELETE' })
      irA(volverA)
    } catch (err) {
      setMensajeError(obtenerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{esEdicion ? 'Editar' : 'Nuevo'} evento</p>
          <h1>{esEdicion ? 'Actualizar evento' : 'Crear evento'}</h1>
          <p className="page-subtitle">Completa los datos y guarda los cambios.</p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to={volverA}>
            Volver
          </Link>
        </div>
      </div>

      <div className="form-card">
        <form className="form-grid" onSubmit={guardarForm}>
          <label className="form-field">
            Titulo del evento
            <input
              type="text"
              name="title"
              placeholder="Ej: Reunion con el equipo"
              value={formulario.title}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label className="form-field">
            Fecha
            <input
              type="date"
              name="date"
              value={formulario.date}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label className="form-field">
            Hora
            <input
              type="time"
              name="time"
              value={formulario.time}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label className="form-field">
            Categoria
            <select
              name="categoryId"
              value={formulario.categoryId}
              onChange={cambiarCampo}
              required
            >
              <option value="" disabled>
                Elegi una categoria
              </option>
              {categorias.map((categoria) => {
                const categoriaId = obtenerId(categoria)
                return (
                  <option key={categoriaId || categoria.name} value={categoriaId || ''} disabled={!categoriaId}>
                    {categoria.name || categoria.title || 'Sin nombre'}
                  </option>
                )
              })}
            </select>
          </label>

          <label className="form-field">
            Lugar
            <input
              type="text"
              name="location"
              placeholder="Ej: Aula 3 o Meet"
              value={formulario.location}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label className="form-field">
            Estado
            <select name="status" value={formulario.status} onChange={cambiarCampo} required>
              <option value="programado">Programado</option>
              <option value="confirmado">Confirmado</option>
              <option value="urgente">Urgente</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </label>

          <label className="form-field form-field-full">
            Descripcion
            <textarea
              name="description"
              placeholder="Agrega detalles del evento"
              rows="4"
              value={formulario.description}
              onChange={cambiarCampo}
            />
          </label>

          {mensajeError && <p className="auth-error form-field-full">{mensajeError}</p>}

          <div className="form-actions">
            <Link className="ghost-btn" to={volverA}>
              Cancelar
            </Link>
            <button className="primary-btn" type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear evento'}
            </button>
          </div>
        </form>
        <p className="form-note">Los cambios se guardan con tu sesion activa.</p>
        {esEdicion && (
          <div className="form-danger">
            <p>Eliminar este evento es definitivo.</p>
            <button className="danger-btn" type="button" onClick={borrarEvento}>
              Eliminar evento
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventForm
