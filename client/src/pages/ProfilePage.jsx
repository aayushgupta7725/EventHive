import { useState } from 'react';
import { FiUser, FiMail, FiSave, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm]  = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });
  const [pwd, setPwd]    = useState({ current: '', newPwd: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [tab, setTab]    = useState('profile');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setPwdField = (key) => (e) => setPwd(p => ({ ...p, [key]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/profile', { name: form.name, bio: form.bio });
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    if (pwd.newPwd !== pwd.confirm) { toast.error('Passwords do not match'); return; }
    if (pwd.newPwd.length < 6)      { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.put('/profile/password', { currentPassword: pwd.current, newPassword: pwd.newPwd });
      setPwd({ current: '', newPwd: '', confirm: '' });
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="pt-[var(--navbar-height)] min-h-screen bg-surface">
      <div className="max-w-[680px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary-container text-white flex items-center justify-center text-3xl font-bold shadow-[0_4px_20px_rgba(109,40,217,0.15)] overflow-hidden">
              {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : initial}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <FiCamera size={13} />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-on-surface">{user?.name}</h2>
            <p className="text-on-surface-variant text-sm">{user?.email}</p>
            {user?.bio && <p className="text-on-surface-variant text-sm mt-1.5">{user.bio}</p>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-outline-variant/30 mb-7">
          <button
            onClick={() => setTab('profile')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === 'profile' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setTab('security')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === 'security' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-7 animate-fade">
            <h3 className="text-lg font-bold text-on-surface mb-6">Personal Information</h3>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="prof-name">Full Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="prof-name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary bg-white text-sm outline-none transition-all"
                    value={form.name}
                    onChange={set('name')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="prof-email">Email Address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="prof-email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant bg-surface-container-low text-sm outline-none opacity-70 cursor-not-allowed"
                    value={form.email}
                    readOnly
                    title="Email cannot be changed"
                  />
                </div>
                <span className="text-xs text-on-surface-variant">Email cannot be changed</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="prof-bio">Bio</label>
                <textarea
                  id="prof-bio"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary bg-white text-sm outline-none transition-all resize-y"
                  placeholder="Tell others a bit about yourself..."
                  value={form.bio}
                  onChange={set('bio')}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : <><FiSave size={16} /> Save Changes</>}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-7 animate-fade">
            <h3 className="text-lg font-bold text-on-surface mb-6">Change Password</h3>
            <form onSubmit={handleChangePwd} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="cur-pwd">Current Password</label>
                <input
                  id="cur-pwd" type="password" placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary bg-white text-sm outline-none transition-all"
                  value={pwd.current} onChange={setPwdField('current')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="new-pwd">New Password</label>
                <input
                  id="new-pwd" type="password" placeholder="Min. 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary bg-white text-sm outline-none transition-all"
                  value={pwd.newPwd} onChange={setPwdField('newPwd')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="conf-pwd">Confirm New Password</label>
                <input
                  id="conf-pwd" type="password" placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary bg-white text-sm outline-none transition-all"
                  value={pwd.confirm} onChange={setPwdField('confirm')}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : '🔐 Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
