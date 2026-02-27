import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ApiDocs from './pages/ApiDocs.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EventsList from './pages/EventsList.jsx'
import EventDetail from './pages/EventDetail.jsx'
import EventForm from './pages/EventForm.jsx'
import CategoriesList from './pages/CategoriesList.jsx'
import CategoryDetail from './pages/CategoryDetail.jsx'
import CategoryForm from './pages/CategoryForm.jsx'
import CalendarView from './pages/CalendarView.jsx'
import FriendsList from './pages/FriendsList.jsx'
import FriendDetail from './pages/FriendDetail.jsx'
import FriendForm from './pages/FriendForm.jsx'
import GroupsList from './pages/GroupsList.jsx'
import GroupDetail from './pages/GroupDetail.jsx'
import GroupForm from './pages/GroupForm.jsx'
import Notifications from './pages/Notifications.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/endpoints" element={<ApiDocs />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventos" element={<EventsList />} />
        <Route path="/eventos/nuevo" element={<EventForm />} />
        <Route path="/eventos/:id" element={<EventDetail />} />
        <Route path="/eventos/:id/editar" element={<EventForm />} />
        <Route path="/categorias" element={<CategoriesList />} />
        <Route path="/categorias/nueva" element={<CategoryForm />} />
        <Route path="/categorias/:id" element={<CategoryDetail />} />
        <Route path="/categorias/:id/editar" element={<CategoryForm />} />
        <Route path="/calendario" element={<CalendarView />} />
        <Route path="/amigos" element={<FriendsList />} />
        <Route path="/amigos/nuevo" element={<FriendForm />} />
        <Route path="/amigos/:id" element={<FriendDetail />} />
        <Route path="/grupos" element={<GroupsList />} />
        <Route path="/grupos/nuevo" element={<GroupForm />} />
        <Route path="/grupos/:id" element={<GroupDetail />} />
        <Route path="/grupos/:id/editar" element={<GroupForm />} />
        <Route path="/notificaciones" element={<Notifications />} />
      </Route>
    </Routes>
  )
}

export default App
