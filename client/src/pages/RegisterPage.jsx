import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate      = useNavigate();
  const { register }  = useAuth();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name)    e.name    = 'Name is required';
    if (!form.email)   e.email   = 'Email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to EventHive!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); },
  });

  return (
    <div className="auth-page">
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: -150, right: -100 }} />
      <div className="orb orb-cyan"   style={{ width: 300, height: 300, bottom: -100, left: -100 }} />

      <div className="auth-card animate-fade">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <img src="/logo.png" alt="EventHive Logo" className="w-full h-full object-contain p-1" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>
            Event<span className="text-gradient">Hive</span>
          </span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start hosting and discovering events today</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="name" type="text" className="form-input" style={{ paddingLeft: 40 }}
                placeholder="Jane Doe" {...field('name')} />
            </div>
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="reg-email" type="email" className="form-input" style={{ paddingLeft: 40 }}
                placeholder="you@example.com" {...field('email')} />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="reg-password" type={showPwd ? 'text' : 'password'} className="form-input"
                style={{ paddingLeft: 40, paddingRight: 40 }} placeholder="Min. 6 characters" {...field('password')} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="confirm" type={showPwd ? 'text' : 'password'} className="form-input"
                style={{ paddingLeft: 40 }} placeholder="••••••••" {...field('confirm')} />
            </div>
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
