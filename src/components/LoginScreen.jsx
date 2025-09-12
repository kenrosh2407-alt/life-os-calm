import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Phone, ArrowRight, Loader2, Check } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import 'react-phone-number-input/style.css';

export default function LoginScreen({ onLogin }) {
  const { login } = useAuthStore();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'name'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPhoneValid = phone && isValidPhoneNumber(phone);

  const sendOTP = async () => {
    if (!isPhoneValid) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8000/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name: name || 'User' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8000/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update auth store which handles localStorage
        login(data.user, data.token);
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Invalid OTP');
        setOtp('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleOTPChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (cleaned.length === 6) {
      setTimeout(() => verifyOTP(), 100);
    }
  };

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
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
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
            {step === 'name' && 'What should we call you?'}
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
                  defaultCountry="US"
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
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      className="otp-digit"
                      maxLength="1"
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const newOtp = otp.split('');
                        newOtp[i] = e.target.value;
                        handleOTPChange(newOtp.join(''));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          document.querySelector(`.otp-digit:nth-child(${i})`).focus();
                        }
                      }}
                      onInput={(e) => {
                        if (e.target.value && i < 5) {
                          document.querySelector(`.otp-digit:nth-child(${i + 2})`).focus();
                        }
                      }}
                    />
                  ))}
                </div>
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

              <div className="otp-actions">
                <button
                  onClick={() => setStep('phone')}
                  className="secondary-button"
                >
                  Change Number
                </button>
                
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-button"
                >
                  Resend Code
                </button>
              </div>

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