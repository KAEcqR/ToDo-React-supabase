import { createBrowserRouter, RouterProvider } from 'react-router';
import LoginPage from './components/LoginPage'
import Layout from './components/Layout';
import ToDoPage from './components/ToDoPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {path: "login", element: <LoginPage />},
      {path: "", element: <ToDoPage />}
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
