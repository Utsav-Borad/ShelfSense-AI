import { Toaster } from 'react-hot-toast';

export default function ToastWrapper() {
  return <Toaster position="top-right" toastOptions={{ className: 'app-toast' }} />;
}
