import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

function Dashboard() {
  const [resumenSemana, setResumenSemana] = useState({
    eventosActivos: 0,
    categoriasTotal: 0,
    recordatorios: 0,
    alertas: 0,
    proximos: [],
    topCategorias: [],
    vistaSemana: [],
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    apiFetch('/dashboard/summary')
      .then((info) => {
        const dataPanel = info.data || info || {}
        const eventosProximos = dataPanel.upcoming || []
        const categoriasTop = dataPanel.topCategories || []
        const vistaCorta = dataPanel.weekPreview || eventosProximos.slice(0, 3)
        if (activo) {
          setResumenSemana({
            eventosActivos: dataPanel.activeEvents ?? eventosProximos.length ?? 0,
            categoriasTotal: dataPanel.categoriesCount ?? categoriasTop.length ?? 0,
            recordatorios: dataPanel.remindersCount ?? 0,
            alertas: dataPanel.alertsCount ?? 0,
            proximos: eventosProximos,
            topCategorias: categoriasTop,
            vistaSemana: vistaCorta,
          })
          setCargando(false)
        }
      })
      .catch(() => {
        if (activo) {
          setCargando(false)
        }
      })
    return () => {
      activo = false
    }
  }, [])

  const eventosProximos = resumenSemana.proximos
  const categoriasTop = resumenSemana.topCategorias
  const vistaCorta = resumenSemana.vistaSemana

  return (
    <section className="page dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resumen</p>
          <h1>Tu semana en numeros</h1>
          <p className="page-subtitle">
            Un vistazo rapido para saber que tenes por delante.
          </p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/eventos">
            Ver eventos
          </Link>
          <Link className="primary-btn" to="/eventos/nuevo">
            Crear evento
          </Link>
        </div>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <p className="stat-label">Eventos en agenda</p>
          <p className="stat-value">{resumenSemana.eventosActivos}</p>
          <p className="stat-note">Semana en curso</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Categorias</p>
          <p className="stat-value">{resumenSemana.categoriasTotal}</p>
          <p className="stat-note">Etiquetas activas</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Recordatorios</p>
          <p className="stat-value">{resumenSemana.recordatorios}</p>
          <p className="stat-note">Alertas programadas</p>
        </article>
      </div>

      <div className="split-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Lo que se viene</h3>
            <Link to="/eventos">Ver todo</Link>
          </div>
          <ul className="panel-list">
            {cargando && <li className="panel-item">Cargando...</li>}
            {!cargando && eventosProximos.length === 0 && (
              <li className="panel-item">Sin eventos proximos.</li>
            )}
            {eventosProximos.map((evento) => (
              <li key={evento.id} className="panel-item">
                <div>
                  <p className="panel-title">{evento.title || evento.name}</p>
                  <p className="panel-subtitle">
                    {(evento.date || evento.startAt || evento.start) ?? ''}
                    {evento.time ? ` ? ${evento.time}` : ''}
                  </p>
                </div>
                <span className="panel-tag">
                  {evento.category?.name || evento.category || 'Sin categoria'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Categorias mas usadas</h3>
            <Link to="/categorias">Gestionar</Link>
          </div>
          <ul className="panel-list">
            {cargando && <li className="panel-item">Cargando...</li>}
            {!cargando && categoriasTop.length === 0 && (
              <li className="panel-item">Sin categorias todavia.</li>
            )}
            {categoriasTop.map((categoria) => (
              <li key={categoria.id} className="panel-item">
                <div>
                  <p className="panel-title">{categoria.name}</p>
                  <p className="panel-subtitle">{categoria.description}</p>
                </div>
                <span className="panel-tag">
                  {categoria.eventsCount ?? categoria.events ?? 0} eventos
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel calendar-panel">
          <div className="panel-header">
            <h3>Vista rapida de la semana</h3>
            <Link to="/eventos/nuevo">Agregar</Link>
          </div>
          <ul className="calendar-mini">
            {cargando && <li className="calendar-mini-item">Cargando...</li>}
            {!cargando && vistaCorta.length === 0 && (
              <li className="calendar-mini-item">Sin eventos para mostrar.</li>
            )}
            {vistaCorta.map((evento) => (
              <li key={evento.id} className="calendar-mini-item">
                <div>
                  <Link className="calendar-mini-title" to={`/eventos/${evento.id}`}>
                    {evento.title || evento.name}
                  </Link>
                  <p className="calendar-mini-meta">
                    {(evento.date || evento.startAt || evento.start) ?? ''}
                    {evento.time ? ` ? ${evento.time}` : ''}
                  </p>
                </div>
                <Link className="ghost-btn small" to={`/eventos/${evento.id}/editar`}>
                  Editar
                </Link>
              </li>
            ))}
          </ul>
          <div className="calendar-mini-actions">
            <Link className="ghost-btn small" to="/calendario">
              Ver calendario
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard