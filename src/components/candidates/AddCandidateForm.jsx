import { useState, useEffect } from 'react';
import { LuDownload } from "react-icons/lu";
import '../../assets/styles/candidate/candidateform.css'

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            alert('Please fill all required fields and confirm the declaration');
            return;
        }
        const newCandidate = {
            id: Date.now(),
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            status: "New",
            experience: formData.experience,
        };

        console.log('Candidate Data:', newCandidate);
        console.log('Resume File:', resume);

        onClose();

        // Reset form
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            position: '',
            experience: ''
        });
        setResume(null);
        setIsChecked(false);
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
