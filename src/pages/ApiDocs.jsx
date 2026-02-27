import { Link } from 'react-router-dom'

const rutas = [
  {
    titulo: 'Auth',
    lista: [
      { metodo: 'POST', ruta: '/auth/register', detalle: 'Registrar usuario' },
      { metodo: 'POST', ruta: '/auth/login', detalle: 'Login y JWT' },
      { metodo: 'GET', ruta: '/auth/verifytoken=...', detalle: 'Verificar email' },
      { metodo: 'POST', ruta: '/auth/forgot-password', detalle: 'Pedir reset' },
      { metodo: 'POST', ruta: '/auth/reset-password', detalle: 'Cambiar contraseña' },
    ],
  },
  {
    titulo: 'Eventos (principal)',
    lista: [
      { metodo: 'GET', ruta: '/events', detalle: 'Listar eventos' },
      { metodo: 'GET', ruta: '/events/:id', detalle: 'Detalle de evento' },
      { metodo: 'POST', ruta: '/events', detalle: 'Crear evento (JWT)' },
      { metodo: 'PUT', ruta: '/events/:id', detalle: 'Editar evento (JWT)' },
      { metodo: 'DELETE', ruta: '/events/:id', detalle: 'Eliminar evento (JWT)' },
    ],
  },
  {
    titulo: 'Categorías (relacionada)',
    lista: [
      { metodo: 'GET', ruta: '/categories', detalle: 'Listar categorias' },
      { metodo: 'GET', ruta: '/categories/:id', detalle: 'Detalle categoria' },
      { metodo: 'POST', ruta: '/categories', detalle: 'Crear categoria (JWT)' },
      { metodo: 'PUT', ruta: '/categories/:id', detalle: 'Editar categoria (JWT)' },
      { metodo: 'DELETE', ruta: '/categories/:id', detalle: 'Eliminar categoria (JWT)' },
    ],
  },
  {
    titulo: 'Dashboard',
    lista: [{ metodo: 'GET', ruta: '/dashboard/summary', detalle: 'Resumen semanal' }],
  },
  {
    titulo: 'Calendario',
    lista: [
      {
        metodo: 'GET',
        ruta: '/eventsfrom=YYYY-MM-DD&to=YYYY-MM-DD',
        detalle: 'Eventos por rango',
      },
    ],
  },
  {
    titulo: 'Amigos',
    lista: [
      { metodo: 'GET', ruta: '/friends', detalle: 'Listar amigos' },
      { metodo: 'POST', ruta: '/friends/invite', detalle: 'Invitar amigo' },
      { metodo: 'POST', ruta: '/friends/accept', detalle: 'Aceptar invitacion' },
      { metodo: 'POST', ruta: '/friends/reject', detalle: 'Rechazar invitacion' },
    ],
  },
  {
    titulo: 'Grupos',
    lista: [
      { metodo: 'GET', ruta: '/groups', detalle: 'Listar grupos' },
      { metodo: 'GET', ruta: '/groups/:id', detalle: 'Detalle grupo' },
      { metodo: 'POST', ruta: '/groups', detalle: 'Crear grupo (JWT)' },
      { metodo: 'PUT', ruta: '/groups/:id', detalle: 'Editar grupo (JWT)' },
      { metodo: 'DELETE', ruta: '/groups/:id', detalle: 'Eliminar grupo (JWT)' },
      { metodo: 'POST', ruta: '/groups/:id/invite-link', detalle: 'Link de invitacion' },
    ],
  },
  {
    titulo: 'Notificaciones',
    lista: [
      { metodo: 'GET', ruta: '/notifications', detalle: 'Solicitudes pendientes' },
      { metodo: 'POST', ruta: '/notifications/:id/accept', detalle: 'Aceptar' },
      { metodo: 'POST', ruta: '/notifications/:id/reject', detalle: 'Rechazar' },
    ],
  },
]

function ApiDocs() {
  return (
    <section className="page docs-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Documentacion</p>
          <h1>Endpoints principales</h1>
          <p className="page-subtitle">
            Vista previa para conectar el frontend cuando el backend esté listo.
          </p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/">
            Volver al inicio
          </Link>
          <Link className="primary-btn" to="/login">
            Ir a login
          </Link>
        </div>
      </div>

      <div className="docs-grid">
        {rutas.map((bloque) => (
          <article key={bloque.titulo} className="panel">
            <h3>{bloque.titulo}</h3>
            <ul className="docs-list">
              {bloque.lista.map((fila) => (
                <li key={fila.ruta} className="docs-item">
                  <span className="docs-method">{fila.metodo}</span>
                  <span className="docs-path">{fila.ruta}</span>
                  <span className="docs-desc">{fila.detalle}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ApiDocs