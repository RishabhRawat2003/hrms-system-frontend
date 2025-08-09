import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import '../../assets/styles/leaves/addleaves.css'

function AddLeavesModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        leaveDate: '',
        reason: '',
    });

    const [documents, setDocuments] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEmployeeSuggestions, setShowEmployeeSuggestions] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isValidEmployee, setIsValidEmployee] = useState(true);
    const [showEmployeeError, setShowEmployeeError] = useState(false);
    const inputRef = useRef(null);

    const employees = [
        { id: 1, name: 'John Doe', designation: 'Software Engineer' },
        { id: 2, name: 'Jane Smith', designation: 'UI/UX Designer' },
        { id: 3, name: 'Mike Johnson', designation: 'Project Manager' },
        { id: 4, name: 'Sarah Wilson', designation: 'Business Analyst' },
        { id: 5, name: 'David Brown', designation: 'DevOps Engineer' },
        { id: 6, name: 'Emily Davis', designation: 'Frontend Developer' },
        { id: 7, name: 'Robert Miller', designation: 'Backend Developer' },
        { id: 8, name: 'Lisa Anderson', designation: 'Product Manager' },
        { id: 9, name: 'James Taylor', designation: 'Full Stack Developer' },
        { id: 10, name: 'Maria Garcia', designation: 'QA Engineer' }
    ];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        if (formData.name.trim() === '') {
            setFilteredEmployees([]);
            setShowEmployeeSuggestions(false);
            setIsValidEmployee(true);
            setShowEmployeeError(false);
        } else {
            const filtered = employees.filter(employee =>
                employee.name.toLowerCase().includes(formData.name.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setShowEmployeeSuggestions(filtered.length > 0);
        }
    }, [formData.name]);

    const validateEmployeeName = () => {
        if (formData.name.trim() === '') {
            setIsValidEmployee(true);
            setShowEmployeeError(false);
            return;
        }

        const exactMatch = employees.find(employee =>
            employee.name.toLowerCase() === formData.name.toLowerCase()
        );

        if (!exactMatch) {
            setIsValidEmployee(false);
            setShowEmployeeError(true);
            setFormData(prev => ({
                ...prev,
                designation: ''
            }));
        } else {
            setIsValidEmployee(true);
            setShowEmployeeError(false);
            setFormData(prev => ({
                ...prev,
                designation: exactMatch.designation
            }));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowEmployeeSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setFormData(prev => ({
                ...prev,
                name: value,
                designation: ''
            }));

            if (showEmployeeError) {
                setShowEmployeeError(false);
                setIsValidEmployee(true);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEmployeeSelect = (employee) => {
        setFormData(prev => ({
            ...prev,
            name: employee.name,
            designation: employee.designation
        }));
        setShowEmployeeSuggestions(false);
        setFilteredEmployees([]);
        setIsValidEmployee(true);
        setShowEmployeeError(false);
    };

    const handleFileChange = (e) => {
        setDocuments(e.target.files[0]);
    };

    const clearName = () => {
        setFormData(prev => ({
            ...prev,
            name: '',
            designation: ''
        }));
        setShowEmployeeSuggestions(false);
        setFilteredEmployees([]);
        setIsValidEmployee(true);
        setShowEmployeeError(false);
    };

    const getDaysInMonth = (month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push({
                date: new Date(current),
                day: current.getDate(),
                isCurrentMonth: current.getMonth() === month,
                isToday: current.toDateString() === new Date().toDateString()
            });
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setFormData(prev => ({
            ...prev,
            leaveDate: date.toISOString().split('T')[0]
        }));
        setShowCalendar(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidEmployee) {
            setShowEmployeeError(true);
            return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('designation', formData.designation);
        formDataToSubmit.append('leaveDate', formData.leaveDate);
        formDataToSubmit.append('reason', formData.reason);
        if (documents) {
            formDataToSubmit.append('documents', documents);
        }

        console.log('Form submitted:', { ...formData, documents });
        onClose();
    };

    const isFormValid = formData.name && formData.designation && formData.leaveDate && formData.reason && isValidEmployee;
    const calendarDays = getDaysInMonth(currentMonth, currentYear);

    if (!isOpen) return null;

    return (
        <div className="add-leaves-modal-overlay">
            <div className="add-leaves-modal-container">
                <div className="add-leaves-modal-header">
                    <h2 className="add-leaves-modal-title">Add New Leave</h2>
                    <button
                        onClick={onClose}
                        className="add-leaves-close-button"
                    >
                        <IoClose className="add-leaves-close-icon" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="add-leaves-form">
                    <div className="add-leaves-form-row">
                        <div className="add-leaves-input-group">
                            <div className="add-leaves-employee-input-wrapper" ref={inputRef}>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onBlur={validateEmployeeName}
                                    onFocus={() => {
                                        if (formData.name && filteredEmployees.length > 0) {
                                            setShowEmployeeSuggestions(true);
                                        }
                                    }}
                                    className={`add-leaves-input ${showEmployeeError
                                        ? 'add-leaves-input-error'
                                        : 'add-leaves-input-normal'
                                        }`}
                                    placeholder="Enter employee name"
                                    required
                                    autoComplete="off"
                                />

                                {formData.name && (
                                    <button
                                        type="button"
                                        onClick={clearName}
                                        className="add-leaves-clear-button"
                                    >
                                        <IoClose className="add-leaves-clear-icon" />
                                    </button>
                                )}

                                {showEmployeeSuggestions && filteredEmployees.length > 0 && (
                                    <div className="add-leaves-suggestions-dropdown">
                                        {filteredEmployees.map((employee) => (
                                            <div
                                                key={employee.id}
                                                onClick={() => handleEmployeeSelect(employee)}
                                                className="add-leaves-suggestion-item"
                                            >
                                                <div className="add-leaves-suggestion-name">{employee.name}</div>
                                                <div className="add-leaves-suggestion-designation">{employee.designation}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showEmployeeError && (
                                    <div className="add-leaves-error-container">
                                        <p className="add-leaves-error-message">
                                            <svg className="add-leaves-error-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Employee not found in the employee list
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="add-leaves-input-group">
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                className="add-leaves-input add-leaves-input-normal"
                                placeholder="Enter designation"
                                required
                            />
                        </div>
                    </div>

                    <div className="add-leaves-form-row">
                        <div className="add-leaves-input-group">
                            <div className="add-leaves-date-input-wrapper">
                                <input
                                    type="text"
                                    value={formData.leaveDate ? new Date(formData.leaveDate).toLocaleDateString() : ''}
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    readOnly
                                    className="add-leaves-input add-leaves-input-normal add-leaves-date-input"
                                    placeholder="Select date"
                                    required
                                />

                                {showCalendar && (
                                    <div className="add-leaves-calendar-modal">
                                        <div className="add-leaves-calendar-header">
                                            <button
                                                type="button"
                                                onClick={goToPreviousMonth}
                                                className="add-leaves-calendar-nav-button"
                                            >
                                                <HiChevronLeft className="add-leaves-calendar-nav-icon" />
                                            </button>
                                            <h3 className="add-leaves-calendar-title">
                                                {monthNames[currentMonth]} {currentYear}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={goToNextMonth}
                                                className="add-leaves-calendar-nav-button"
                                            >
                                                <HiChevronRight className="add-leaves-calendar-nav-icon" />
                                            </button>
                                        </div>

                                        <div className="add-leaves-calendar-days-header">
                                            {dayNames.map((day) => (
                                                <div key={day} className="add-leaves-calendar-day-name">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="add-leaves-calendar-grid">
                                            {calendarDays.map((dayData, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => dayData.isCurrentMonth && handleDateSelect(dayData.date)}
                                                    className={`add-leaves-calendar-day ${dayData.isCurrentMonth
                                                            ? 'add-leaves-calendar-day-current'
                                                            : 'add-leaves-calendar-day-other'
                                                        } ${dayData.isToday
                                                            ? 'add-leaves-calendar-day-today'
                                                            : ''
                                                        } ${selectedDate && selectedDate.toDateString() === dayData.date.toDateString()
                                                            ? 'add-leaves-calendar-day-selected'
                                                            : ''
                                                        }`}
                                                    disabled={!dayData.isCurrentMonth}
                                                >
                                                    {dayData.day}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="add-leaves-calendar-footer">
                                            <button
                                                type="button"
                                                onClick={() => setShowCalendar(false)}
                                                className="add-leaves-calendar-close-button"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="add-leaves-input-group">
                            <div className="add-leaves-file-input-wrapper">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="add-leaves-file-input-hidden"
                                    id="document-upload"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <label
                                    htmlFor="document-upload"
                                    className="add-leaves-file-input-label"
                                >
                                    <span className="add-leaves-file-input-text">
                                        {documents ? documents.name : 'Choose file'}
                                    </span>
                                    <svg className="add-leaves-file-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="add-leaves-reason-group">
                        <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            className="add-leaves-input add-leaves-input-normal"
                            placeholder="Enter reason for leave"
                            required
                        />
                    </div>

                    <div className="add-leaves-submit-container">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`add-leaves-submit-button ${isFormValid
                                    ? 'add-leaves-submit-button-enabled'
                                    : 'add-leaves-submit-button-disabled'
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

export default AddLeavesModal;
