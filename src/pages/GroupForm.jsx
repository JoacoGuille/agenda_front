import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

function GroupForm() {
  const { id } = useParams()
  const irA = useNavigate()
  const ubicacion = useLocation()
  const esEdicion = Boolean(id)
  const volverA = ubicacion.state?.from || '/grupos'

  const [cargando, setCargando] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [formulario, setFormulario] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (!esEdicion) return
    apiFetch(`/groups/${id}`)
      .then((info) => {
        const grupo = info.data || info
        setFormulario({
          name: grupo.name || '',
          description: grupo.description || '',
        })
      })
      .catch(() => setMensajeError('No se pudo cargar el grupo.'))
  }, [id, esEdicion])

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const guardarForm = async (eventoForm) => {
    eventoForm.preventDefault()
    setMensajeError('')
    setCargando(true)

    try {
      if (esEdicion) {
        await apiFetch(`/groups/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: formulario.name, description: formulario.description }),
        })
      } else {
        await apiFetch('/groups', {
          method: 'POST',
          body: JSON.stringify({ name: formulario.name, description: formulario.description }),
        })
      }
      irA(volverA)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo guardar el grupo.')
    } finally {
      setCargando(false)
    }
  }

  const borrarGrupo = async () => {
    const confirmado = window.confirm('Eliminar este grupo?')
    if (!confirmado) return
    setCargando(true)
    try {
      await apiFetch(`/groups/${id}`, { method: 'DELETE' })
      irA(volverA)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo eliminar el grupo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{esEdicion ? 'Editar' : 'Nuevo'} grupo</p>
          <h1>{esEdicion ? 'Actualizar grupo' : 'Crear grupo'}</h1>
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
            Nombre del grupo
            <input
              type="text"
              name="name"
              placeholder="Ej: TP Sistemas"
              value={formulario.name}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label className="form-field form-field-full">
            Descripcion
            <textarea
              name="description"
              placeholder="Conta para que es este grupo"
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
              {cargando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear grupo'}
            </button>
          </div>
        </form>
        <p className="form-note">Los cambios se guardan con tu sesion activa.</p>
        {esEdicion && (
          <div className="form-danger">
            <p>Eliminar este grupo es definitivo.</p>
            <button className="danger-btn" type="button" onClick={borrarGrupo}>
              Eliminar grupo
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default GroupForm