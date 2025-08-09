import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import Logo from '../assets/images/Logo.png'
import RegistrationCarousal from '../components/registration/Carousal'
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import '../assets/styles/registration/signup.css'
import { toast } from 'react-toastify';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND

function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showOtpPopup, setShowOtpPopup] = useState(false)
    const [otp, setOtp] = useState('')
    const [isOtpLoading, setIsOtpLoading] = useState(false)
    const [isVerifyLoading, setIsVerifyLoading] = useState(false)
    const [isSignupLoading, setIsSignupLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmpassword: ''
    })
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const validateForm = () => {
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        toast.dismiss();

        const fullname = formData.fullname.trim();
        if (!fullname) {
            toast.error("Full name is required");
            return false;
        }
        if (!nameRegex.test(fullname)) {
            toast.error("Full name must only contain letters");
            return false;
        }

        const email = formData.email.trim();
        if (!email) {
            toast.error("Email is required");
            return false;
        }
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return false;
        }

        if (!formData.password) {
            toast.error("Password is required");
            return false;
        }
        if (formData.password !== formData.confirmpassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };


    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
        setOtp(value)
    }

    async function getOtp() {
        try {
            if (!validateForm()) return
            const data = {
                email: formData.email
            }
            await axios.post(`${backend}/otp/send-email-otp`, data)
            toast.success('OTP sent successfully')
            setIsOtpLoading(true)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsOtpLoading(false)
        }
    }

    async function verifyOtp() {
        try {
            setIsVerifyLoading(true)
            const data = {
                email: formData.email,
                otp
            }
            await axios.post(`${backend}/otp/verify-email-otp`, data)
            toast.success('OTP Verified successfully')
            setOtp('')
            setShowOtpPopup(false)
            await executeSignup()
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsVerifyLoading(false)
        }
    }

    async function executeSignup() {
        try {
            const data = {
                full_name: formData.fullname,
                email: formData.email,
                password: formData.password
            }
            setIsSignupLoading(true)
            await axios.post(`${backend}/hr/signup`, data)
            setFormData({
                fullname: '',
                email: '',
                password: '',
                confirmpassword: ''
            })
            navigate('/signin')
            toast.success('Account created successfully!')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsSignupLoading(false)
        }
    }

    const handleRegisterClick = async () => {
        if (!isFormValid()) {
            toast.error('Please fill in all required fields')
            return
        }

        if (formData.password !== formData.confirmpassword) {
            toast.error('Passwords do not match')
            return
        }

        await getOtp()
    }

    const isFormValid = () => {
        return Object.values(formData).every(value => value.trim() !== '')
    }

    const closeOtpPopup = () => {
        setShowOtpPopup(false)
        setOtp('')
    }

    return (
        <div className='signup-container'>
            <div className='logo-container'>
                <img src={Logo} alt="Logo" className='logo' />
            </div>
            <div className='main-content'>
                {/* Left container */}
                <RegistrationCarousal />

                {/* Right container */}
                <div className='form-container'>
                    <h1 className='welcome-title'>Welcome to Dashboard</h1>
                    <div className='form-fields'>
                        <div className='field-group'>
                            <label htmlFor="fullname" className='field-label'>
                                Full Name <span className='required'>*</span>
                            </label>
                            <input
                                type="text"
                                id='fullname'
                                placeholder='Full Name'
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className='input-field'
                            />
                        </div>
                        <div className='field-group'>
                            <label htmlFor="email" className='field-label'>
                                Email Address<span className='required'>*</span>
                            </label>
                            <input
                                type="email"
                                id='email'
                                placeholder='Email Address'
                                value={formData.email}
                                onChange={handleInputChange}
                                className='input-field'
                            />
                        </div>
                        <div className='field-group'>
                            <label htmlFor="password" className='field-label'>
                                Password <span className='required'>*</span>
                            </label>
                            <div className='password-container'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='input-field password-input'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='password-toggle'
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className='field-group'>
                            <label htmlFor="confirmpassword" className='field-label'>
                                Confirm Password <span className='required'>*</span>
                            </label>
                            <div className='password-container'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id='confirmpassword'
                                    placeholder='Confirm Password'
                                    value={formData.confirmpassword}
                                    onChange={handleInputChange}
                                    className='input-field password-input'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='password-toggle'
                                >
                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='button-container'>
                        <button
                            onClick={handleRegisterClick}
                            className={`register-button ${isFormValid() ? 'valid' : 'invalid'}`}
                            disabled={!isFormValid() || isOtpLoading || isSignupLoading}
                        >
                            {isOtpLoading ? 'Sending OTP...' : isSignupLoading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                    <div className='login-link-container'>
                        <p className='login-text'>Already have an account?</p>
                        <Link to="/signin" className='login-link'>Login</Link>
                    </div>
                </div>
            </div>

            {showOtpPopup && (
                <div className='otp-overlay' onClick={(e) => e.target === e.currentTarget && closeOtpPopup()}>
                    <div className='otp-popup'>
                        <div className='otp-header'>
                            <h2 className='otp-title'>Verify Your Email</h2>
                            <button
                                onClick={closeOtpPopup}
                                className='otp-close-button'
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className='otp-content'>
                            <div className='otp-icon'>
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#4D007D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="22,6 12,13 2,6" stroke="#4D007D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <p className='otp-description'>
                                We've sent a 6-digit verification code to
                            </p>
                            <p className='otp-email'>{formData.email}</p>

                            <div className='otp-input-container'>
                                <label className='otp-label'>Enter Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="000000"
                                    className='otp-input'
                                    maxLength={6}
                                    autoFocus
                                />
                                <p className='otp-timer'> Code expires in 10 minutes</p>
                            </div>

                            <div className='otp-actions'>
                                <button
                                    onClick={verifyOtp}
                                    disabled={otp.length !== 6 || isVerifyLoading}
                                    className='otp-verify-button'
                                >
                                    {isVerifyLoading ? (
                                        <>
                                            <div className='loading-spinner'></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify & Create Account'
                                    )}
                                </button>

                                <div className='otp-resend-container'>
                                    <p className='otp-resend-text'>Didn't receive the code?</p>
                                    <button
                                        onClick={getOtp}
                                        disabled={isOtpLoading}
                                        className='otp-resend-button'
                                    >
                                        {isOtpLoading ? 'Sending...' : 'Resend Code'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Signup
