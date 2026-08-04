import { Link } from 'react-router-dom';
export default function ErrorPage({ code, title, description }) { return <div className="error-page"><p>{code}</p><h1>{title}</h1><span>{description}</span><Link to="/" className="btn app-btn app-btn-primary">Back to dashboard</Link></div>; }
