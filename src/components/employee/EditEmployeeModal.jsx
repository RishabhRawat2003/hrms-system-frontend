import { useState, useEffect } from 'react';
import { LuCalendar } from "react-icons/lu";
import '../../assets/styles/employee/editemployee.css'

function EditEmployeeModal({ isOpen, onClose, employee = null }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        dateOfJoining: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const positionOptions = ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'];

    useEffect(() => {
        if (employee) {
            setFormData({
                fullName: employee.name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                department: employee.department || '',
                position: employee.position || '',
                dateOfJoining: employee.dateOfJoining || ''
            });
        }
    }, [employee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const isValid =
            formData.fullName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            formData.department.trim() !== '' &&
            formData.position !== '' &&
            formData.dateOfJoining !== '';

        setIsFormValid(isValid);
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            alert('Please fill all required fields');
            return;
        }

        const employeeData = {
            id: employee ? employee.id : Date.now(),
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            position: formData.position,
            dateOfJoining: formData.dateOfJoining,
        };

        console.log('Employee Data:', employeeData);

        onClose();

        setFormData({
            fullName: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            dateOfJoining: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="edit-employee-overlay">
            <div className="edit-employee-content">
                <div className="edit-employee-header">
                    <h2 className="edit-employee-title">
                        Edit Employee Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="edit-employee-close-btn"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="edit-employee-form">
                    <div className="edit-employee-grid">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name*"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="edit-employee-input"
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
                                className="edit-employee-input"
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
                                className="edit-employee-input"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="department"
                                placeholder="Department*"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                                className="edit-employee-input"
                            />
                        </div>

                        <div className="edit-employee-select-wrapper">
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className="edit-employee-select"
                            >
                                <option value="" disabled className="text-gray-500">Position*</option>
                                {positionOptions.map((position) => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>
                            <div className="edit-employee-select-arrow">
                                <svg
                                    className="edit-employee-arrow-icon"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="edit-employee-date-wrapper">
                            <input
                                type="date"
                                name="dateOfJoining"
                                value={formData.dateOfJoining}
                                onChange={handleInputChange}
                                required
                                className="edit-employee-date-input"
                            />
                            <div className="edit-employee-calendar-icon">
                                <LuCalendar size={20} className="edit-employee-calendar-svg" />
                            </div>
                        </div>
                    </div>

                    <div className="edit-employee-button-container">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`edit-employee-button ${isFormValid
                                ? 'edit-employee-button-enabled'
                                : 'edit-employee-button-disabled'
                                }`}
                        >
                            {employee ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEmployeeModal;
