import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';

export default function AppLayout() { return <div className="app-shell"><Sidebar/><div className="app-main"><Topbar/><main className="app-content"><Outlet/></main><Footer/></div></div>; }
