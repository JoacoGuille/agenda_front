import { Navigate } from 'react-router-dom'
import { haySesion } from '../utils/localAuth.js'

function ProtectedRoute({ children }) {
  if (!haySesion()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute