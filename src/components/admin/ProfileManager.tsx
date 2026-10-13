import { useState } from 'react';
import { Check, KeyRound, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProfileManager() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    if (password.length < 8 || password !== confirmation) {
      setMessage(password.length < 8 ? 'Use at least 8 characters.' : 'The passwords do not match.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setMessage('The password could not be updated. Please sign in again and retry.');
      return;
    }
    setPassword('');
    setConfirmation('');
    setMessage('Password updated successfully.');
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-full bg-creamdark flex items-center justify-center"><KeyRound className="w-5 h-5 text-brand-terra" /></span>
        <div><h2 className="font-heading font-bold text-brand-brown text-xl">Admin Profile</h2><p className="text-brand-muted text-sm mt-1">Update your sign-in password.</p></div>
      </div>
      <form onSubmit={changePassword} className="space-y-4">
        <div><label className="block text-brand-brown font-semibold text-sm mb-1.5">New password</label><input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input" placeholder="At least 8 characters" /></div>
        <div><label className="block text-brand-brown font-semibold text-sm mb-1.5">Confirm new password</label><input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="admin-input" placeholder="Repeat new password" /></div>
        {message && <p className="text-sm font-semibold text-brand-brownlight">{message}</p>}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-terra text-cream font-bold px-6 py-3 rounded-full hover:bg-brand-terrahover hover:shadow-[0_0_20px_rgba(199,61,19,0.35)] active:scale-95 transition-all duration-300 disabled:opacity-60">{message.includes('successfully') ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}{saving ? 'Saving...' : message.includes('successfully') ? 'Updated' : 'Change Password'}</button>
      </form>
    </div>
  );
}
