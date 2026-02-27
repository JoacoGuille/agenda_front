import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

function CategoryForm() {
  const { id } = useParams()
  const irA = useNavigate()
  const ubicacion = useLocation()
  const esEdicion = Boolean(id)
  const volverA = ubicacion.state?.from || '/categorias'

  const [cargando, setCargando] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [formulario, setFormulario] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (!esEdicion) return
    apiFetch(`/categories/${id}`)
      .then((info) => {
        const categoria = info.data || info
        setFormulario({
          name: categoria.name || '',
          description: categoria.description || '',
        })
      })
      .catch(() => setMensajeError('No se pudo cargar la categoria.'))
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
        await apiFetch(`/categories/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: formulario.name, description: formulario.description }),
        })
      } else {
        await apiFetch('/categories', {
          method: 'POST',
          body: JSON.stringify({ name: formulario.name, description: formulario.description }),
        })
      }
      irA(volverA)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo guardar la categoria.')
    } finally {
      setCargando(false)
    }
  }

  const borrarCategoria = async () => {
    const confirmado = window.confirm('Eliminar esta categoria?')
    if (!confirmado) return
    setCargando(true)
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' })
      irA(volverA)
    } catch (err) {
      setMensajeError(err.message || 'No se pudo eliminar la categoria.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{esEdicion ? 'Editar' : 'Nueva'} categoria</p>
          <h1>{esEdicion ? 'Actualizar categoria' : 'Crear categoria'}</h1>
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
            Nombre de la categoria
            <input
              type="text"
              name="name"
              placeholder="Ej: Reuniones"
              value={formulario.name}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label className="form-field form-field-full">
            Descripcion
            <textarea
              name="description"
              placeholder="Explica para que se usa"
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
              {cargando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear categoria'}
            </button>
          </div>
        </form>
        <p className="form-note">Los cambios se guardan con tu sesion activa.</p>
        {esEdicion && (
          <div className="form-danger">
            <p>Eliminar esta categoria es definitivo.</p>
            <button className="danger-btn" type="button" onClick={borrarCategoria}>
              Eliminar categoria
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryForm