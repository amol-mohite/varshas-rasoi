import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('amol@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInError) {
      navigate('/admin');
      return;
    }
    if (email === 'amol@gmail.com') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (!signUpError) {
        navigate('/admin');
        return;
      }
    }
    setError('Unable to sign in with those details. Please check the email and password.');
    setSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card p-8 max-w-md w-full">
        <div className="w-14 h-14 rounded-full bg-brand-terra flex items-center justify-center mx-auto mb-5"><Lock className="w-7 h-7 text-cream" /></div>
        <h1 className="font-heading font-bold text-brand-brown text-3xl text-center">Admin Login</h1>
        <p className="text-brand-muted text-sm mt-3 text-center">Sign in to manage Varsha's Rasoi.</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} className="admin-input" placeholder="Admin email" />
          <input type="password" required value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} className="admin-input" placeholder="Password" />
          {error && <p className="text-nonveg text-sm font-semibold">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full h-12 rounded-full bg-brand-terra text-cream font-bold hover:bg-brand-terrahover hover:shadow-[0_0_20px_rgba(199,61,19,0.35)] active:scale-95 transition-all duration-300 disabled:opacity-60">{submitting ? 'Signing in...' : 'Login'}</button>
        </form>
        <Link to="/" className="inline-flex items-center gap-1.5 mt-5 text-xs text-brand-muted hover:text-brand-terra transition-colors duration-300"><ArrowLeft className="w-3.5 h-3.5" /> Back to home</Link>
      </div>
    </div>
  );
}
