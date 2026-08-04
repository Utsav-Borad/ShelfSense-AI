import { Link } from 'react-router-dom';
export default function Breadcrumb({ items = [] }) { return <nav aria-label="Breadcrumb"><ol className="app-breadcrumb">{items.map((item, index) => <li key={item.label}>{item.to && index !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}</li>)}</ol></nav>; }
