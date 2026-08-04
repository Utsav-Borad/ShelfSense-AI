import ErrorPage from '../errors/ErrorPage';
export default function ForbiddenPage() { return <ErrorPage code="403" title="Access restricted" description="You do not have permission to view this area."/>; }
