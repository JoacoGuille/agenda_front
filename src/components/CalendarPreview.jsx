import useDragScroll from '../hooks/useDragScroll.js'

function CalendarPreview() {
  const refScroll = useDragScroll()

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <div>
          <p className="calendar-title">Vista semanal</p>
          <p className="calendar-subtitle">Conectada al backend</p>
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

        {Array.from({ length: 21 }).map((_, idx) => (
          <div key={idx} className="calendar-cell" />
        ))}
      </div>
      <div className="calendar-legend">
        <span className="legend-item">Sin datos de ejemplo</span>
      </div>
    </div>
  )
}

export default CalendarPreview