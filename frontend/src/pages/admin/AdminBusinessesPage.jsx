import { useEffect, useState } from 'react';
import { BusinessTable } from '../../components/admin';
import { toBusinesses } from '../../components/admin/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAdminBusinesses } from '../../services/authService';
import '../../styles/admin.css';

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getAdminBusinesses();
        if (active) setBusinesses(toBusinesses(response.data));
      } catch (failure) {
        if (active) setFailed(failure.detail || 'We could not load the businesses.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const term = query.trim().toLowerCase();
  const visible = businesses.filter((business) => {
    if (!term) return true;
    return [business.name, business.type, business.owner.name, business.owner.email]
      .some((field) => field.toLowerCase().includes(term));
  });

  if (loading) return <div className="ad"><LoadingSpinner label="Reading the businesses" /></div>;

  if (failed) {
    return <div className="ad"><ErrorState title="We could not load the businesses" description={failed} /></div>;
  }

  return (
    <div className="ad">
      <BusinessTable
        businesses={visible}
        total={businesses.length}
        query={query}
        onQuery={setQuery}
        filtered={Boolean(term)}
        onReset={() => setQuery('')}
      />
    </div>
  );
}
