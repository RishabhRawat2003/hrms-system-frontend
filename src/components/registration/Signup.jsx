import { Link } from 'react-router'
import { useState } from 'react'
import Logo from '../../assets/images/Logo.png'
import RegistrationCarousal from './Carousal'
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import '../../assets/styles/registration/signup.css'

function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmpassword: ''
    })

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const isFormValid = () => {
        return Object.values(formData).every(value => value.trim() !== '')
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
                            className={`register-button ${isFormValid() ? 'valid' : 'invalid'}`}
                            disabled={!isFormValid()}
                        >
                            Register
                        </button>
                    </div>
                    <div className='login-link-container'>
                        <p className='login-text'>Already have an account?</p>
                        <Link to="/signin" className='login-link'>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
