import { useState, useEffect } from 'react';
import { LuCalendar } from "react-icons/lu";
import '../../assets/styles/employee/editemployee.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoadingSpinnerWithOverlay } from '../global/Loading';

const backend = import.meta.env.VITE_BACKEND

export const positionOptions = [
    {
        label: 'Intern',
        value: 'intern'
    },
    {
        label: 'Full Time',
        value: 'full_time'
    },
    {
        label: 'Junior',
        value: 'junior'
    },
    {
        label: 'Senior',
        value: 'senior'
    },
    {
        label: 'Team Lead',
        value: 'team_lead'
    }
];

function EditEmployeeModal({ isOpen, onClose, employee = null }) {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        department: '',
        position: '',
        dateOfJoining: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employee) {
            const formatDateForInput = (dateString) => {
                if (!dateString) return '';
                return dateString.split('T')[0];
            };

            setFormData({
                full_name: employee.full_name || '',
                email: employee.email || '',
                phone_number: employee.phone_number || '',
                department: employee.department || '',
                position: employee.employement_type || '',
                dateOfJoining: formatDateForInput(employee.created_at)
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
            formData.full_name.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone_number.trim() !== '' &&
            formData.department.trim() !== '' &&
            formData.position !== '' &&
            formData.dateOfJoining !== '';

        setIsFormValid(isValid);
    }, [formData]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!isFormValid) {
                alert('Please fill all required fields');
                return;
            }
    
            const data = {
                full_name: formData.full_name,
                email: formData.email,
                phone_number: formData.phone_number,
                department: formData.department,
                employement_type: formData.position,
            }
            setLoading(true);
    
            await axios.post(`${backend}/employee/${employee._id}/update`, data)
            toast.success('Employee updated successfully');
            setLoading(false)
            onClose();
            setFormData({
                full_name: '',
                email: '',
                phone_number: '',
                department: '',
                position: '',
                dateOfJoining: ''
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.data?.message || error.message);
            setLoading(false);
        }
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

                {loading && <LoadingSpinnerWithOverlay />}

                <form onSubmit={handleSubmit} className="edit-employee-form">
                    <div className="edit-employee-grid">
                        <div>
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name*"
                                value={formData.full_name}
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
                                name="phone_number"
                                placeholder="Phone Number*"
                                value={formData.phone_number}
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
                                {positionOptions.map((position, index) => (
                                    <option key={index} value={position.value}>
                                        {position.label}
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEmployeeModal;
