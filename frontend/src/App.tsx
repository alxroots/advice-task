import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./components/auth/private-route.tsx";
import LoginPage from "./pages/login-pages.tsx";
import RegisterPage from "./pages/register-pages.tsx";
import TaskListPage from "./pages/task-list-page.tsx";
import TaskDetailPage from "./pages/task-detail-page.tsx";
import TaskFormPage from "./pages/task-form-page.tsx";
import { AuthProvider } from "./context/auth-context.tsx";
import TaskCategoryPage from "@/pages/task-category-page.tsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/tasks" />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/create"
            element={
              <PrivateRoute>
                <TaskFormPage />
              </PrivateRoute>
            }
          />
            <Route
                path="/tasks/category/create"
                element={
                    <PrivateRoute>
                        <TaskCategoryPage />
                    </PrivateRoute>
                }
            />
          <Route
            path="/tasks/edit/:id"
            element={
              <PrivateRoute>
                <TaskFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute>
                <TaskDetailPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
