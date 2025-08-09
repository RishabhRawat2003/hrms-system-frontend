import { useState, useEffect } from 'react';
import { LuDownload } from "react-icons/lu";
import '../../assets/styles/candidate/candidateform.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { LoadingSpinnerWithOverlay } from '../global/Loading';

const backend = import.meta.env.VITE_BACKEND

function AddCandidateModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: ''
    });
    const [resume, setResume] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    useEffect(() => {
        const isValid =
            formData.fullName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            formData.position.trim() !== '' &&
            formData.experience.trim() !== '' &&
            resume !== null &&
            isChecked;

        setIsFormValid(isValid);
    }, [formData, resume, isChecked]);

    const validateForm = () => {
        toast.dismiss();

        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        const fullName = formData.fullName.trim();
        if (!fullName) {
            toast.error("Full name is required");
            return false;
        }
        if (!nameRegex.test(fullName)) {
            toast.error("Full name must only contain letters and spaces");
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

        const phone = formData.phone.trim();
        if (!phone) {
            toast.error("Phone number is required");
            return false;
        }
        if (!phoneRegex.test(phone)) {
            toast.error("Phone number must be at least 10 digits");
            return false;
        }

        if (!formData.position.trim()) {
            toast.error("Position is required");
            return false;
        }

        if (!formData.experience.trim()) {
            toast.error("Experience is required");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!validateForm()) return

            setLoading(true);
            const form = new FormData();
            form.append('full_name', formData.fullName);
            form.append('email', formData.email);
            form.append('phone_number', formData.phone);
            form.append('position', formData.position);
            form.append('experience', formData.experience);
            form.append('file', resume);

            const response = await axios.post(`${backend}/candidate/add-candidate`, form, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            toast.success('Candidate added successfully');
            setLoading(false);
            onClose();

            setFormData({
                fullName: '',
                email: '',
                phone: '',
                position: '',
                experience: ''
            });
            setResume(null);
            setIsChecked(false);
        } catch (error) {
            setLoading(false);
            console.error('Error adding candidate:', error);
            toast.error(error.response?.data?.data?.message || error.message)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="candidate-form-overlay">
            <div className="candidate-form-modal">
                <div className="candidate-form-header">
                    <h2 className="candidate-form-title">Add New Candidate</h2>
                    <button
                        onClick={onClose}
                        className="candidate-form-close-btn"
                    >
                        ×
                    </button>
                </div>
                {
                    loading && <LoadingSpinnerWithOverlay />
                }

                <form onSubmit={handleSubmit} className="candidate-form-content">
                    <div className="candidate-form-grid">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name*"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="candidate-form-input"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address*"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="candidate-form-input"
                            />
                        </div>

                        <div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number*"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="candidate-form-input"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="position"
                                placeholder="Position*"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className="candidate-form-input"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="experience"
                                placeholder="Experience*"
                                value={formData.experience}
                                onChange={handleInputChange}
                                required
                                className="candidate-form-input"
                            />
                        </div>

                        <div>
                            <div className="candidate-form-upload-container">
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="candidate-form-file-input"
                                    id="resume-upload"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="candidate-form-file-label"
                                >
                                    <span className={resume ? 'candidate-form-file-selected' : 'candidate-form-file-placeholder'}>
                                        {resume ? resume.name : 'Resume*'}
                                    </span>
                                    <LuDownload size={20} className='candidate-form-upload-icon' />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="candidate-form-checkbox-container">
                        <label className="candidate-form-checkbox-label">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                className="candidate-form-checkbox"
                            />
                            <span className="candidate-form-checkbox-text">
                                I hereby declare that the above information is true to the best of my knowledge and belief
                            </span>
                        </label>
                    </div>

                    <div className="candidate-form-button-container">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`candidate-form-submit-btn ${isFormValid
                                ? 'candidate-form-submit-enabled'
                                : 'candidate-form-submit-disabled'
                                }`}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default AddCandidateModal;
