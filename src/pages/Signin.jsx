import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import Logo from '../assets/images/Logo.png'
import RegistrationCarousal from '../components/registration/Carousal'
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import '../assets/styles/registration/signin.css'
import { toast } from 'react-toastify';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND

function Signin() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    async function handleSignin() {
        try {
            toast.dismiss()
            const response = await axios.post(`${backend}/hr/signin`, formData)
            if (response.data.status === "Success") {
                localStorage.setItem('token', JSON.stringify(response.data.data.user.token))
                toast.success('Login successful')
                navigate('/dashboard')
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || error.message)
        }
    }

    const isFormValid = () => {
        return Object.values(formData).every(value => value.trim() !== '')
    }

    return (
        <div className='signin-container'>
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
                    </div>
                    <div className='button-container'>
                        <button
                            className={`login-button ${isFormValid() ? 'valid' : 'invalid'}`}
                            disabled={!isFormValid()}
                            onClick={handleSignin}
                        >
                            Login
                        </button>
                    </div>
                    <div className='register-link-container'>
                        <p className='register-text'>Don't have an account?</p>
                        <Link to="/" className='register-link'>Register</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin
