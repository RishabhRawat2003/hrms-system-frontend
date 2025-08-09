import { useState, useEffect } from 'react';
import '../../assets/styles/attendance/editattendance.css'

function EditAttendanceModal({ isOpen, onClose, employee = null, onUpdate }) {
    const [formData, setFormData] = useState({
        fullName: '',
        position: '',
        department: '',
        task: '',
        status: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const statusOptions = ['Present', 'Absent', 'Medical Leave', 'Work From Home'];
    const positionOptions = ['Senior Developer', 'HR Manager', 'UI/UX Designer', 'Full Stack Developer', 'Marketing Specialist', 'Backend Developer', 'Graphic Designer', 'Project Manager'];

    useEffect(() => {
        if (employee) {
            setFormData({
                fullName: employee.name || '',
                position: employee.position || '',
                department: employee.department || '',
                task: employee.task || '',
                status: employee.status || ''
            });
        } else {
            setFormData({
                fullName: '',
                position: '',
                department: '',
                task: '',
                status: ''
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
            formData.position !== '' &&
            formData.department.trim() !== '' &&
            formData.task.trim() !== '' &&
            formData.status !== '';

        setIsFormValid(isValid);
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            alert('Please fill all required fields');
            return;
        }

        const attendanceData = {
            id: employee ? employee.id : Date.now(),
            name: formData.fullName,
            position: formData.position,
            department: formData.department,
            task: formData.task,
            status: formData.status,
            ...(employee && {
                email: employee.email,
                phone: employee.phone,
                dateOfJoining: employee.dateOfJoining
            })
        };

        if (onUpdate) {
            onUpdate(attendanceData);
        }

        console.log('Attendance Data:', attendanceData);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="attendance-modal-overlay">
            <div className="attendance-modal-content">
                <div className="attendance-modal-header">
                    <h2 className="attendance-modal-title">
                        Edit Attendance Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="attendance-modal-close-btn"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="attendance-modal-form">
                    <div className="attendance-modal-grid">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Employee Name*"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                disabled={!!employee}
                                className={`attendance-modal-input ${employee ? 'attendance-modal-input-disabled' : ''}`}
                            />
                        </div>

                        <div className="attendance-modal-select-wrapper">
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className="attendance-modal-select"
                            >
                                <option value="" disabled className="text-gray-500">Position*</option>
                                {positionOptions.map((position) => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>
                            <div className="attendance-modal-select-arrow">
                                <svg
                                    className="w-5 h-5 text-[#4D007D]"
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

                        <div>
                            <input
                                type="text"
                                name="department"
                                placeholder="Department*"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                                className="attendance-modal-input"
                            />
                        </div>

                        <div className="attendance-modal-select-wrapper">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="attendance-modal-select"
                            >
                                <option value="" disabled className="text-gray-500">Status*</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <div className="attendance-modal-select-arrow">
                                <svg
                                    className="w-5 h-5 text-[#4D007D]"
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

                        <div className='attendance-modal-task-full'>
                            <input
                                type="text"
                                name="task"
                                placeholder="Task*"
                                value={formData.task}
                                onChange={handleInputChange}
                                required
                                className="attendance-modal-input"
                            />
                        </div>
                    </div>

                    <div className="attendance-modal-button-container">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`attendance-modal-button ${isFormValid
                                ? 'attendance-modal-button-enabled'
                                : 'attendance-modal-button-disabled'
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

export default EditAttendanceModal;
