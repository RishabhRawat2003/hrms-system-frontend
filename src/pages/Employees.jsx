import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import EditEmployeeModal from '../components/employee/EditEmployeeModal';
import '../assets/styles/employee/employee.css';

const employeesData = [
    {
        id: 1,
        name: "Jacob William",
        email: "jacob.william@example.com",
        phone: "(252) 555-0111",
        position: "Senior Developer",
        department: "IT",
        dateOfJoining: "2023-01-15",
    },
    {
        id: 2,
        name: "Guy Hawkins",
        email: "guy.hawkins@example.com",
        phone: "(907) 555-0101",
        position: "HR Manager",
        department: "Human Resources",
        dateOfJoining: "2022-08-20",
    },
    {
        id: 3,
        name: "Arlene McCoy",
        email: "arlene.mccoy@example.com",
        phone: "(302) 555-0107",
        position: "UI/UX Designer",
        department: "Design",
        dateOfJoining: "2023-03-10",
    },
    {
        id: 4,
        name: "Leslie Alexander",
        email: "leslie.alexander@example.com",
        phone: "(207) 555-0119",
        position: "Full Stack Developer",
        department: "IT",
        dateOfJoining: "2022-11-05",
    },
    {
        id: 5,
        name: "Devon Lane",
        email: "devon.lane@example.com",
        phone: "(555) 123-4567",
        position: "Marketing Specialist",
        department: "Marketing",
        dateOfJoining: "2023-02-28",
    },
];


function Employees() {
    const [employees, setEmployees] = useState(employeesData);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editEmployeePopup, setEditEmployeePopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const positionOptions = ["Senior Developer", "HR Manager", "UI/UX Designer", "Full Stack Developer", "Marketing Specialist"];

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await new Promise((resolve) =>
                setTimeout(() => resolve(positionOptions), 500)
            );
            setPositions(response);
        };

        fetchPositions();
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
        console.log(`Editing employee: ${employee.name}`);
        setOpenActionMenu(null);
    };

    const handleDeleteEmployee = (employeeId) => {
        const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
        setEmployees(updatedEmployees);
        setOpenActionMenu(null);
    };

    const shouldOpenUpward = (index) => {
        return index >= employees.length - 2;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm);
        const matchesPosition = selectedPosition === "" || employee.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

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
                                {positions.map((position) => (
                                    <option key={position} value={position}>
                                        {position}
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

            {editEmployeePopup && <EditEmployeeModal isOpen={editEmployeePopup} onClose={() => setEditEmployeePopup(false)} employee={null} />}

            <div className='employee-table-wrapper'>
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
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee, index) => (
                                    <tr key={employee.id} className="employee-table-row">
                                        <td className="employee-table-cell">{`0${index + 1}`}</td>
                                        <td className="employee-table-cell employee-name-cell">{employee.name}</td>
                                        <td className="employee-table-cell">{employee.email}</td>
                                        <td className="employee-table-cell">{employee.phone}</td>
                                        <td className="employee-table-cell">{employee.position}</td>
                                        <td className="employee-table-cell">
                                            {employee.department}
                                        </td>
                                        <td className="employee-table-cell">{formatDate(employee.dateOfJoining)}</td>
                                        <td className="employee-table-cell employee-action-cell">
                                            <div className="employee-action-wrapper">
                                                <button
                                                    onClick={(e) => toggleActionMenu(employee.id, e, index)}
                                                    className="employee-action-button"
                                                >
                                                    ⋮
                                                </button>
                                                {openActionMenu === employee.id && (
                                                    <div className={`employee-action-menu ${shouldOpenUpward(index) ? 'employee-action-menu-up' : 'employee-action-menu-down'}`}>
                                                        <ul className="employee-action-list">
                                                            <li
                                                                className="employee-action-item"
                                                                onClick={() => handleEditEmployee(employee)}
                                                            >
                                                                Edit
                                                            </li>
                                                            <li
                                                                className="employee-action-item employee-action-delete"
                                                                onClick={() => handleDeleteEmployee(employee.id)}
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
        </div>

    )
}

export default Employees;
