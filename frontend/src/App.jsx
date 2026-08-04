import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    // reducedMotion="user" makes every Framer animation in the product respect
    // the operating system's reduce-motion setting — something a CSS media
    // query cannot do, because Framer writes transforms from JavaScript.
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <BrowserRouter><AppRoutes /></BrowserRouter>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
