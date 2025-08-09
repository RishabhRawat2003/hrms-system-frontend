import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import EditEmployeeModal, { positionOptions } from '../components/employee/EditEmployeeModal';
import '../assets/styles/employee/employee.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoadingSpinnerWithoutOverlay } from '../components/global/Loading';

const backend = import.meta.env.VITE_BACKEND

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editEmployeePopup, setEditEmployeePopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    async function getEmployees() {
        try {
            setLoading(true);

            const response = await axios.post(`${backend}/employee/list`, {
                pageNum: 1,
                pageSize: 10,
                filter: {}
            });
            const employeeList = response.data.data.employeeList || [];
            const activeEmployees = employeeList.filter(employee => !employee.is_deleted);
            setAllEmployees(activeEmployees);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        applyFilters();
    }, [selectedPosition, searchTerm, allEmployees]);

    function applyFilters() {
        let filteredEmployees = [...allEmployees];

        if (selectedPosition) {
            filteredEmployees = filteredEmployees.filter(employee =>
                employee.employement_type === selectedPosition
            );
        }

        if (searchTerm) {
            const query = searchTerm?.toLowerCase();
            filteredEmployees = filteredEmployees.filter(employee =>
                employee.full_name?.toLowerCase().includes(query) ||
                employee.email?.toLowerCase().includes(query) ||
                employee.phone_number?.toLowerCase().includes(query)
            );
        }

        setEmployees(filteredEmployees);
    }

    useEffect(() => {
        getEmployees()
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenActionMenu(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleActionMenu = (employeeId, event, index) => {
        event.stopPropagation();
        setOpenActionMenu(openActionMenu === employeeId ? null : employeeId);
    };

    const handleEditEmployee = (employee) => {
        setEditEmployeePopup(true);
        setSelectedEmployee(employee);
        setOpenActionMenu(null);
    };

    const handleDeleteEmployee = async (employeeId) => {
        try {
            toast.dismiss()
            setLoading(true);
            await axios.post(`${backend}/employee/${employeeId}/update`, { is_deleted: true });
            toast.success('Employee deleted successfully');
            setLoading(false);
            getEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            setLoading(false);
            toast.error(error.response?.data?.data?.message || error.message);
        }
        setOpenActionMenu(null);
    };

    function handleOnClose() {
        setEditEmployeePopup(false)
        setSelectedEmployee(null)
        getEmployees()
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className='employee-container'>
            <div className='employee-header'>
                <div className='employee-search-wrapper'>
                    <div className="employee-search-box">
                        <FaSearch className="employee-search-icon" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="employee-search-input"
                        />
                    </div>
                </div>
                <div className='employee-filter-wrapper'>
                    <div className="employee-filter-container">
                        <div className="employee-select-wrapper">
                            <select
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value)}
                                className="employee-position-select"
                            >
                                <option value="">All Positions</option>
                                {positionOptions.map((position) => (
                                    <option key={position} value={position.value}>
                                        {position.label}
                                    </option>
                                ))}
                            </select>

                            <div className="employee-select-arrow">
                                <svg
                                    className="employee-arrow-icon"
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
                    </div>
                </div>
            </div>

            {editEmployeePopup && <EditEmployeeModal isOpen={editEmployeePopup} onClose={handleOnClose} employee={selectedEmployee} />}

            {
                loading
                    ? <LoadingSpinnerWithoutOverlay />
                    : <div className='employee-table-wrapper'>
                        <div className="employee-table-container">
                            <table className="employee-table">
                                <thead className="employee-table-head">
                                    <tr>
                                        <th className="employee-table-header">Sr no.</th>
                                        <th className="employee-table-header">Employee Name</th>
                                        <th className="employee-table-header">Email Address</th>
                                        <th className="employee-table-header">Phone Number</th>
                                        <th className="employee-table-header">Position</th>
                                        <th className="employee-table-header">Department</th>
                                        <th className="employee-table-header">Date of Joining</th>
                                        <th className="employee-table-header">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.length > 0 ? (
                                        employees.map((employee, index) => (
                                            <tr key={index} className="employee-table-row">
                                                <td className="employee-table-cell">{`0${index + 1}`}</td>
                                                <td className="employee-table-cell employee-name-cell">{employee.full_name}</td>
                                                <td className="employee-table-cell">{employee.email}</td>
                                                <td className="employee-table-cell">{employee.phone_number}</td>
                                                <td className="employee-table-cell">{
                                                    positionOptions.map((item) => {
                                                        if (item.value === employee.employement_type) {
                                                            return item.label
                                                        }
                                                    })
                                                    || 'N/A'}</td>
                                                <td className="employee-table-cell">
                                                    {employee.department || 'N/A'}
                                                </td>
                                                <td className="employee-table-cell">{formatDate(employee.created_at)}</td>
                                                <td className="employee-table-cell employee-action-cell">
                                                    <div className="employee-action-wrapper">
                                                        <button
                                                            onClick={(e) => toggleActionMenu(employee._id, e, index)}
                                                            className="employee-action-button"
                                                        >
                                                            ⋮
                                                        </button>
                                                        {openActionMenu === employee._id && (
                                                            <div className={`employee-action-menu`}>
                                                                <ul className="employee-action-list">
                                                                    <li
                                                                        className="employee-action-item"
                                                                        onClick={() => handleEditEmployee(employee)}
                                                                    >
                                                                        Edit
                                                                    </li>
                                                                    <li
                                                                        className="employee-action-item employee-action-delete"
                                                                        onClick={() => handleDeleteEmployee(employee._id)}
                                                                    >
                                                                        Delete
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="employee-no-data">
                                                No employees found matching your search criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>

    )
}

export default Employees;
