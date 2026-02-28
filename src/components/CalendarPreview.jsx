import useDragScroll from '../hooks/useDragScroll.js'

const celdas = [
  { etiqueta: 'Clase React', clase: 'event-blue' },
  { etiqueta: 'Reunion equipo', clase: 'event-green' },
  null,
  { etiqueta: 'Entrega parcial', clase: 'event-orange' },
  null,
  null,
  null,
  { etiqueta: 'Estudio backend', clase: 'event-yellow' },
  null,
  { etiqueta: 'Tutoria', clase: 'event-blue' },
  null,
  null,
  { etiqueta: 'Revision proyecto', clase: 'event-green' },
  null,
  null,
  { etiqueta: 'Gimnasio', clase: 'event-orange' },
  null,
  null,
  null,
  { etiqueta: 'Cierre semanal', clase: 'event-rose' },
  null,
]

const leyendas = [
  { texto: 'Clases', clase: 'event-blue' },
  { texto: 'Reuniones', clase: 'event-green' },
  { texto: 'Pendientes', clase: 'event-orange' },
]

function CalendarPreview() {
  const refScroll = useDragScroll()

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <div>
          <p className="calendar-title">Vista semanal</p>
          <p className="calendar-subtitle">Semana en curso</p>
        </div>
        <button className="calendar-add" type="button">
          + Nuevo
        </button>
      </div>
      <div className="calendar-grid drag-scroll" ref={refScroll}>
        <div className="calendar-cell header">Lun</div>
        <div className="calendar-cell header">Mar</div>
        <div className="calendar-cell header">Mie</div>
        <div className="calendar-cell header">Jue</div>
        <div className="calendar-cell header">Vie</div>
        <div className="calendar-cell header">Sab</div>
        <div className="calendar-cell header">Dom</div>

        {celdas.map((celda, idx) => (
          <div key={idx} className="calendar-cell">
            {celda && <span className={`event ${celda.clase}`}>{celda.etiqueta}</span>}
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        {leyendas.map((leyenda) => (
          <span key={leyenda.texto} className="legend-item">
            <span className={`legend-dot ${leyenda.clase}`} />
            {leyenda.texto}
          </span>
        ))}
      </div>
    </div>
  )
}

export default CalendarPreview