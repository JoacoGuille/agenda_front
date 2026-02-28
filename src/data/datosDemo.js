const categoriasDemo = [
  {
    id: 'cat-1',
    name: 'Clases',
    description: 'Materias, tutorias y clases de la facu.',
    eventsCount: 3,
  },
  {
    id: 'cat-2',
    name: 'Reuniones',
    description: 'Reuniones de equipo y seguimiento del proyecto.',
    eventsCount: 2,
  },
  {
    id: 'cat-3',
    name: 'Entregas',
    description: 'Fechas limite y checkpoints.',
    eventsCount: 1,
  },
  {
    id: 'cat-4',
    name: 'Personal',
    description: 'Habitos y organizacion personal.',
    eventsCount: 2,
  },
]

const eventosDemo = [
  {
    id: 'evt-1',
    title: 'Clase React',
    startAt: '2026-03-02T09:30:00',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Clases' },
    status: 'programado',
    location: 'Aula 3',
    description: 'Hooks y router en practica.',
  },
  {
    id: 'evt-2',
    title: 'Reunion equipo',
    startAt: '2026-03-03T11:00:00',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Reuniones' },
    status: 'confirmado',
    location: 'Meet',
    description: 'Revision de avances y pendientes.',
  },
  {
    id: 'evt-3',
    title: 'Entrega parcial',
    startAt: '2026-03-04T18:00:00',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Entregas' },
    status: 'urgente',
    location: 'Campus virtual',
    description: 'Subir avance antes de las 18.',
  },
  {
    id: 'evt-4',
    title: 'Estudio backend',
    startAt: '2026-03-02T14:00:00',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Clases' },
    status: 'programado',
    location: 'Biblioteca',
    description: 'Practica de servicios y rutas.',
  },
  {
    id: 'evt-5',
    title: 'Tutoria',
    startAt: '2026-03-05T10:30:00',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Clases' },
    status: 'pendiente',
    location: 'Aula 5',
    description: 'Consulta de parciales.',
  },
  {
    id: 'evt-6',
    title: 'Revision proyecto',
    startAt: '2026-03-06T15:30:00',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Reuniones' },
    status: 'confirmado',
    location: 'Meet',
    description: 'Checklist de despliegue.',
  },
  {
    id: 'evt-7',
    title: 'Gimnasio',
    startAt: '2026-03-03T19:00:00',
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Personal' },
    status: 'programado',
    location: 'Club',
    description: 'Rutina de fuerza.',
  },
  {
    id: 'evt-8',
    title: 'Cierre semanal',
    startAt: '2026-03-07T12:00:00',
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Personal' },
    status: 'programado',
    location: 'Casa',
    description: 'Planificar la semana siguiente.',
  },
]

const amigosDemo = [
  {
    id: 'am-1',
    name: 'Lu Rojas',
    email: 'lu@agenda.com',
    status: 'activo',
    invitedAt: '2026-02-28',
  },
  {
    id: 'am-2',
    name: 'Tomi Silva',
    email: 'tomi@agenda.com',
    status: 'pendiente',
    invitedAt: '2026-03-01',
  },
  {
    id: 'am-3',
    name: 'Mica P',
    email: 'mica@agenda.com',
    status: 'invitado',
    invitedAt: '2026-02-27',
  },
]

const gruposDemo = [
  {
    id: 'gr-1',
    name: 'TP Sistemas',
    description: 'Entrega y practicas del TP final.',
    membersCount: 4,
    members: [
      { id: 'mb-1', name: 'Nico B', email: 'nico@agenda.com' },
      { id: 'mb-2', name: 'Sofi G', email: 'sofi@agenda.com' },
      { id: 'mb-3', name: 'Lu Rojas', email: 'lu@agenda.com' },
      { id: 'mb-4', name: 'Usuario Demo', email: 'demo@agenda.com' },
    ],
  },
  {
    id: 'gr-2',
    name: 'Cursada 3K2',
    description: 'Clases, parciales y resumenes en comun.',
    membersCount: 6,
    members: [
      { id: 'mb-5', name: 'Tomi Silva', email: 'tomi@agenda.com' },
      { id: 'mb-6', name: 'Mica P', email: 'mica@agenda.com' },
      { id: 'mb-7', name: 'Fede L', email: 'fede@agenda.com' },
      { id: 'mb-8', name: 'Pau C', email: 'pau@agenda.com' },
      { id: 'mb-9', name: 'Nico B', email: 'nico@agenda.com' },
      { id: 'mb-10', name: 'Usuario Demo', email: 'demo@agenda.com' },
    ],
  },
]

const notificacionesDemo = [
  {
    id: 'noti-1',
    title: 'Lu Rojas',
    message: 'Lu Rojas te quiere sumar a su agenda.',
    createdAt: '2026-03-02 10:30',
    read: false,
  },
  {
    id: 'noti-2',
    title: 'Tomi Silva',
    message: 'Tomi Silva te envio una invitacion.',
    createdAt: '2026-03-01 18:10',
    read: false,
  },
  {
    id: 'noti-3',
    title: 'TP Sistemas',
    message: 'Te sumaron al grupo TP Sistemas.',
    createdAt: '2026-02-28 20:15',
    read: true,
  },
]

const resumenDemo = {
  eventosActivos: eventosDemo.length,
  categoriasTotal: categoriasDemo.length,
  recordatorios: 8,
  alertas: 3,
  proximos: eventosDemo.slice(0, 3),
  topCategorias: categoriasDemo.slice(0, 3),
  vistaSemana: eventosDemo.slice(0, 3),
}

export const datosDemo = {
  resumen: resumenDemo,
  eventos: eventosDemo,
  categorias: categoriasDemo,
  amigos: amigosDemo,
  grupos: gruposDemo,
  notificaciones: notificacionesDemo,
}