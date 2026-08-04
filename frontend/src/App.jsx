import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import AppRoutes from './routes/AppRoutes';
import ToastWrapper from './components/ui/ToastWrapper';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter><AppRoutes /></BrowserRouter>
          <ToastWrapper />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
