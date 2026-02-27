import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../services/api.js'
import useDragScroll from '../hooks/useDragScroll.js'

const diasCorto = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const ordenSemana = [1, 2, 3, 4, 5, 6, 0]
const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const horas = Array.from({ length: 18 }, (_, i) => 6 + i)

const rellenar = (valor) => String(valor).padStart(2, '0')

const aClave = (fecha) =>
  `${fecha.getFullYear()}-${rellenar(fecha.getMonth() + 1)}-${rellenar(fecha.getDate())}`

const inicioSemana = (fecha) => {
  const actual = new Date(fecha)
  const dia = actual.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  actual.setDate(actual.getDate() + diff)
  actual.setHours(0, 0, 0, 0)
  return actual
}

const sumarDias = (fecha, dias) => {
  const next = new Date(fecha)
  next.setDate(next.getDate() + dias)
  return next
}

const normalizarLista = (info) => {
  if (Array.isArray(info)) return info
  if (!info || typeof info !== 'object') return []
  return info.events || info.items || info.data || []
}

const normalizarEventos = (info) =>
  normalizarLista(info).map((evento) => {
    const inicio = evento.startAt || evento.start || evento.date
    const parsed = inicio ? new Date(inicio) : null
    const fecha =
      parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toISOString().slice(0, 10)
        : evento.date || ''
    const hora =
      parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toTimeString().slice(0, 5)
        : evento.time || ''
    return {
      ...evento,
      date: fecha,
      time: hora,
      title: evento.title || evento.name,
      location: evento.location || '',
      status: evento.status || 'programado',
    }
  })

const armarMapa = (items) => {
  return items.reduce((acc, evento) => {
    if (!evento.date) return acc
    acc[evento.date] = acc[evento.date] ? [...acc[evento.date], evento] : [evento]
    return acc
  }, {})
}

function CalendarView() {
  const [eventos, setEventos] = useState([])
  const [vista, setVista] = useState('week')
  const [fechaElegida, setFechaElegida] = useState(new Date())
  const [cursorMes, setCursorMes] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const [cargando, setCargando] = useState(false)
  const refDrag = useDragScroll()

  const mapaEventos = useMemo(() => armarMapa(eventos), [eventos])

  const cargarRango = async (desde, hasta) => {
    setCargando(true)
    try {
      const info = await apiFetch(`/events?from=${desde}&to=${hasta}`)
      setEventos(normalizarEventos(info))
    } catch {
      setEventos([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (vista === 'month') {
      const inicioMes = new Date(cursorMes.getFullYear(), cursorMes.getMonth(), 1)
      const finMes = new Date(cursorMes.getFullYear(), cursorMes.getMonth() + 1, 0)
      cargarRango(aClave(inicioMes), aClave(finMes))
      return
    }

    if (vista === 'week') {
      const inicioSemanaActual = inicioSemana(fechaElegida)
      const finSemana = sumarDias(inicioSemanaActual, 6)
      cargarRango(aClave(inicioSemanaActual), aClave(finSemana))
      return
    }

    const dia = aClave(fechaElegida)
    cargarRango(dia, dia)
  }, [vista, fechaElegida, cursorMes])

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista)
    if (nuevaVista === 'month') {
      setCursorMes(new Date(fechaElegida.getFullYear(), fechaElegida.getMonth(), 1))
    }
  }

  const irAtras = () => {
    if (vista === 'month') {
      const siguiente = new Date(cursorMes)
      siguiente.setMonth(siguiente.getMonth() - 1)
      setCursorMes(siguiente)
    } else if (vista === 'week') {
      setFechaElegida(sumarDias(fechaElegida, -7))
    } else {
      setFechaElegida(sumarDias(fechaElegida, -1))
    }
  }

  const irAdelante = () => {
    if (vista === 'month') {
      const siguiente = new Date(cursorMes)
      siguiente.setMonth(siguiente.getMonth() + 1)
      setCursorMes(siguiente)
    } else if (vista === 'week') {
      setFechaElegida(sumarDias(fechaElegida, 7))
    } else {
      setFechaElegida(sumarDias(fechaElegida, 1))
    }
  }

  const inicioSemanaActual = inicioSemana(fechaElegida)
  const diasSemana = ordenSemana.map((_, index) => sumarDias(inicioSemanaActual, index))

  const pintarHeaderSemana = () => (
    <div className="schedule-header">
      <div className="schedule-time-label">Hora</div>
      {diasSemana.map((dia) => {
        const clave = aClave(dia)
        const cantidad = mapaEventos[clave]?.length ?? 0
        const activo = aClave(fechaElegida) === clave
        return (
          <button
            key={clave}
            className={`day-chip ${activo ? 'active' : ''}`}
            type="button"
            onClick={() => setFechaElegida(dia)}
          >
            <span>
              {diasCorto[dia.getDay()]} {dia.getDate()}
            </span>
            <small>{cantidad} eventos</small>
          </button>
        )
      })}
    </div>
  )

  const pintarFilasSemana = () => (
    <div className="schedule-body">
      {cargando && <p className="day-empty">Cargando eventos...</p>}
      {!cargando &&
        horas.map((hora) => (
          <div key={hora} className="schedule-row">
            <div className="schedule-time">{rellenar(hora)}:00</div>
            {diasSemana.map((dia) => {
              const clave = aClave(dia)
              const eventosDia = mapaEventos[clave] ?? []
              const eventosHora = eventosDia.filter(
                (evento) => Number((evento.time || '0').split(':')[0]) === hora,
              )
              return (
                <div key={`${clave}-${hora}`} className="schedule-cell">
                  {eventosHora.map((evento) => (
                    <div key={evento.id} className={`schedule-event status-${evento.status}`}>
                      <Link className="schedule-event-title" to={`/eventos/${evento.id}`}>
                        {evento.title}
                      </Link>
                      <p className="schedule-event-meta">{evento.time}</p>
                      <Link
                        className="ghost-btn small"
                        to={`/eventos/${evento.id}/editar`}
                        state={{ from: '/calendario' }}
                      >
                        Editar
                      </Link>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
    </div>
  )

  const pintarVistaDia = () => {
    const clave = aClave(fechaElegida)
    const eventosDia = mapaEventos[clave] ?? []

    return (
      <div className="day-view">
        <div className="day-selector">
          {diasSemana.map((dia) => {
            const claveDia = aClave(dia)
            const activo = claveDia === clave
            return (
              <button
                key={claveDia}
                className={`day-chip ${activo ? 'active' : ''}`}
                type="button"
                onClick={() => setFechaElegida(dia)}
              >
                <span>
                  {diasCorto[dia.getDay()]} {dia.getDate()}
                </span>
                <small>{mapaEventos[claveDia]?.length ?? 0} eventos</small>
              </button>
            )
          })}
        </div>
        <div className="day-schedule">
          {cargando && <p className="day-empty">Cargando eventos...</p>}
          {!cargando &&
            horas.map((hora) => {
              const eventosHora = eventosDia.filter(
                (evento) => Number((evento.time || '0').split(':')[0]) === hora,
              )
              return (
                <div key={hora} className="day-row">
                  <div className="day-time">{rellenar(hora)}:00</div>
                  <div className="day-cell">
                    {eventosHora.length === 0 ? (
                      <p className="day-empty">Libre</p>
                    ) : (
                      eventosHora.map((evento) => (
                        <div key={evento.id} className={`schedule-event status-${evento.status}`}>
                          <Link className="schedule-event-title" to={`/eventos/${evento.id}`}>
                            {evento.title}
                          </Link>
                          <p className="schedule-event-meta">
                            {evento.time} ? {evento.location}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  const pintarVistaMes = () => {
    const inicioMes = new Date(cursorMes.getFullYear(), cursorMes.getMonth(), 1)
    const diaInicio = inicioMes.getDay()
    const corrimiento = diaInicio === 0 ? -6 : 1 - diaInicio
    const inicioGrilla = sumarDias(inicioMes, corrimiento)
    const diasMes = Array.from({ length: 42 }, (_, i) => sumarDias(inicioGrilla, i))
    const claveElegida = aClave(fechaElegida)
    const eventosElegidos = mapaEventos[claveElegida] ?? []

    return (
      <div className="month-layout">
        <div className="month-grid">
          {diasMes.map((dia) => {
            const clave = aClave(dia)
            const enMes = dia.getMonth() === cursorMes.getMonth()
            const activo = clave === claveElegida
            const cantidad = mapaEventos[clave]?.length ?? 0
            return (
              <button
                key={clave}
                type="button"
                onClick={() => setFechaElegida(dia)}
                className={`month-cell ${enMes ? '' : 'muted'} ${activo ? 'active' : ''}`}
              >
                <span className="month-day">{dia.getDate()}</span>
                {cantidad > 0 && <span className="month-count">{cantidad} eventos</span>}
              </button>
            )
          })}
        </div>
        <div className="month-sidebar">
          <div>
            <p className="eyebrow">Detalle del dia</p>
            <h3>
              {diasCorto[fechaElegida.getDay()]} {fechaElegida.getDate()} de{' '}
              {meses[fechaElegida.getMonth()]}
            </h3>
          </div>
          {cargando && <p className="day-empty">Cargando eventos...</p>}
          {!cargando && eventosElegidos.length === 0 ? (
            <p className="day-empty">No hay eventos para este dia.</p>
          ) : (
            <div className="month-events">
              {eventosElegidos.map((evento) => (
                <div key={evento.id} className="month-event">
                  <div>
                    <p className="month-event-title">{evento.title}</p>
                    <p className="month-event-meta">
                      {evento.time} ? {evento.location}
                    </p>
                  </div>
                  <Link
                    className="ghost-btn small"
                    to={`/eventos/${evento.id}/editar`}
                    state={{ from: '/calendario' }}
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
          <Link className="primary-btn" to="/eventos/nuevo" state={{ from: '/calendario' }}>
            Agregar evento
          </Link>
        </div>
      </div>
    )
  }

  const tituloFecha =
    vista === 'month'
      ? `${meses[cursorMes.getMonth()]} ${cursorMes.getFullYear()}`
      : vista === 'day'
      ? `${diasCorto[fechaElegida.getDay()]} ${fechaElegida.getDate()} ${
          meses[fechaElegida.getMonth()]
        }`
      : `Semana de ${diasCorto[inicioSemanaActual.getDay()]} ${inicioSemanaActual.getDate()} ${
          meses[inicioSemanaActual.getMonth()]
        }`

  return (
    <section className="page calendar-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Calendario</p>
          <h1>Tu agenda, bien clara</h1>
          <p className="page-subtitle">
            Cambia entre semana, dia y mes para acomodar todo.
          </p>
        </div>
        <div className="page-actions">
          <Link className="ghost-btn" to="/eventos">
            Ver lista
          </Link>
          <Link className="primary-btn" to="/eventos/nuevo" state={{ from: '/calendario' }}>
            Nuevo evento
          </Link>
        </div>
      </div>

      <div className="calendar-toolbar">
        <div className="view-toggle">
          <button
            type="button"
            className={`toggle-btn ${vista === 'week' ? 'active' : ''}`}
            onClick={() => cambiarVista('week')}
          >
            Semana
          </button>
          <button
            type="button"
            className={`toggle-btn ${vista === 'day' ? 'active' : ''}`}
            onClick={() => cambiarVista('day')}
          >
            Dia
          </button>
          <button
            type="button"
            className={`toggle-btn ${vista === 'month' ? 'active' : ''}`}
            onClick={() => cambiarVista('month')}
          >
            Mes
          </button>
        </div>
        <div className="calendar-date-controls">
          <button className="ghost-btn small" type="button" onClick={irAtras}>
            Anterior
          </button>
          <span>{tituloFecha}</span>
          <button className="ghost-btn small" type="button" onClick={irAdelante}>
            Siguiente
          </button>
        </div>
      </div>

      {vista === 'week' && (
        <div className="schedule-wrapper">
          <div className="schedule-scroll drag-scroll" ref={refDrag}>
            {pintarHeaderSemana()}
            {pintarFilasSemana()}
          </div>
        </div>
      )}

      {vista === 'day' && pintarVistaDia()}

      {vista === 'month' && pintarVistaMes()}
    </section>
  )
}

export default CalendarView