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
    // Test mode: Accept any valid phone number
    if (!isPhoneValid) return;
    
    setLoading(true);
    setError('');
    
    // For local testing: simulate API call and always succeed
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1000);
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    // For local testing: accept any 6-digit code
    setTimeout(() => {
      const testUser = {
        id: '1',
        name: name || 'Test User',
        phone: phone,
        created_at: new Date().toISOString()
      };
      
      const testToken = 'test-token-' + Date.now();
      
      console.log('🔐 Starting login process with:', testUser);
      
      // Update auth store which handles localStorage
      login(testUser, testToken);
      console.log('✅ Auth store login called');
      
      // Call onLogin callback
      if (onLogin) {
        onLogin(testUser, testToken);
        console.log('✅ onLogin callback called');
      }
      
      // Force a state check after a brief delay
      setTimeout(() => {
        const token = localStorage.getItem('lifeos_token');
        const user = localStorage.getItem('lifeos_user');
        console.log('🔍 LocalStorage check:', { token, user });
      }, 100);
      
      setLoading(false);
      console.log('🎯 Login process completed');
    }, 1000);
  };

  const handleOTPChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    console.log('📱 OTP input changed:', cleaned, 'length:', cleaned.length);
    setOtp(cleaned);
    
    if (cleaned.length === 6) {
      console.log('🎯 6 digits entered, triggering verifyOTP in 100ms');
      setTimeout(() => {
        console.log('⏰ Timeout executing, calling verifyOTP now');
        verifyOTP();
      }, 100);
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

              <button
                onClick={verifyOTP}
                disabled={otp.length !== 6 || loading}
                className="primary-button"
                style={{ marginTop: '15px' }}
              >
                {loading ? (
                  <Loader2 size={20} className="spinner" />
                ) : (
                  <>
                    Verify Code
                    <Check size={20} />
                  </>
                )}
              </button>

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