import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import 'react-phone-number-input/style.css';

/** 👉 Set your main screen here.
 *  If your home page is '/', change to '/'.
 */
const MAIN_ROUTE = '/home';

export default function LoginScreen({ onLogin }) {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = useRef([]);
  const isPhoneValid = phone && isValidPhoneNumber(phone);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---- MOCK SEND OTP (always succeeds) ----
  const sendOTP = async () => {
    if (!isPhoneValid) return;
    setLoading(true); setError('');
    await sleep(400);
    setStep('otp');
    setLoading(false);
  };

  // ---- MOCK VERIFY OTP (accept ANY 6 digits) ----
  const verifyOTP = async () => {
    if (otp.length !== 6) return;
    setLoading(true); setError('');
    await sleep(400);

    // pretend success and login
    const user = { id: 'demo-user', name: (name || 'User').trim(), phone };
    const token = 'demo-token';
    login(user, token);
    onLogin && onLogin(user, token);

    // Force navigation (SPA + hard fallback to avoid getting "stuck")
    console.log('✅ Demo OTP accepted. Navigating to', MAIN_ROUTE);
    navigate(MAIN_ROUTE, { replace: true });
    setTimeout(() => {
      if (window.location.pathname !== MAIN_ROUTE) {
        window.location.assign(MAIN_ROUTE); // hard fallback
      }
    }, 150);

    setLoading(false);
  };

  // Handle combined OTP string & auto-verify at 6 digits
  const handleOTPChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (cleaned.length === 6) setTimeout(() => verifyOTP(), 120);
  };

  // focus first OTP box when entering otp step
  useEffect(() => {
    if (step === 'otp' && otpRefs.current[0]) otpRefs.current[0].focus();
  }, [step]);

  return (
    <div className="login-screen">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-header">
          <motion.div
            className="login-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          >
            <Phone size={32} />
          </motion.div>

          <motion.h1
            className="login-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to LifeOS
          </motion.h1>

          <motion.p
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {step === 'phone' && 'Enter your phone number to get started'}
            {step === 'otp' && `We sent a code to ${phone}`}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div
              key="phone"
              className="login-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="IN"
                  className="phone-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-input"
                />
              </div>

              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {error}
                </motion.div>
              )}

              <button
                onClick={sendOTP}
                disabled={!isPhoneValid || loading}
                className="primary-button"
              >
                {loading ? (
                  <Loader2 size={20} className="spinner" />
                ) : (
                  <>
                    Continue
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-xs opacity-70 mt-2">
                (Demo: any 6-digit code will verify.)
              </p>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              className="login-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <div className="otp-input-container">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      className="otp-digit"
                      maxLength="1"
                      value={otp[i] || ''}
                      ref={(el) => (otpRefs.current[i] = el)}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 1);
                        const arr = otp.split('');
                        arr[i] = v;
                        const next = arr.join('');
                        setOtp(next);
                        if (v && i < 5) otpRefs.current[i + 1]?.focus();
                        if (next.length === 6) setTimeout(() => verifyOTP(), 120);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          otpRefs.current[i - 1]?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* back + resend controls */}
              <div className="otp-actions" style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={() => setStep('phone')} className="secondary-button">Change Number</button>
                <button onClick={sendOTP} disabled={loading} className="text-button">Resend Code</button>
              </div>

              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {error}
                </motion.div>
              )}

              {loading && (
                <div className="loading-indicator">
                  <Loader2 size={20} className="spinner" />
                  <span>Verifying...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
