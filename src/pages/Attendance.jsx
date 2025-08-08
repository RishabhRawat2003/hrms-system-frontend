import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import EditAttendanceModal from '../components/attendance/EditAttendance';
import '../assets/styles/attendance/attendance.css';

const attendanceData = [
    {
        id: 1,
        name: "Jacob William",
        email: "jacob.william@example.com",
        phone: "(252) 555-0111",
        position: "Senior Developer",
        department: "IT",
        dateOfJoining: "2023-01-15",
        task: "Frontend Development",
        status: "Present",
    },
    {
        id: 2,
        name: "Guy Hawkins",
        email: "guy.hawkins@example.com",
        phone: "(907) 555-0101",
        position: "HR Manager",
        department: "Human Resources",
        dateOfJoining: "2022-08-20",
        task: "Employee Onboarding",
        status: "Work From Home",
    },
    {
        id: 3,
        name: "Arlene McCoy",
        email: "arlene.mccoy@example.com",
        phone: "(302) 555-0107",
        position: "UI/UX Designer",
        department: "Design",
        dateOfJoining: "2023-03-10",
        task: "UI Mockup Design",
        status: "Present",
    },
    {
        id: 4,
        name: "Leslie Alexander",
        email: "leslie.alexander@example.com",
        phone: "(207) 555-0119",
        position: "Full Stack Developer",
        department: "IT",
        dateOfJoining: "2022-11-05",
        task: "API Development",
        status: "Medical Leave",
    },
    {
        id: 5,
        name: "Devon Lane",
        email: "devon.lane@example.com",
        phone: "(555) 123-4567",
        position: "Marketing Specialist",
        department: "Marketing",
        dateOfJoining: "2023-02-28",
        task: "Campaign Analysis",
        status: "Absent",
    }
];

const statusColors = {
    Present: "border-green-500 text-green-700 bg-green-50",
    Absent: "border-red-500 text-red-700 bg-red-50",
    "Medical Leave": "border-blue-500 text-blue-700 bg-blue-50",
    "Work From Home": "border-purple-500 text-purple-700 bg-purple-50",
};

function Attendance() {
    const [employees, setEmployees] = useState(attendanceData);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editEmployeePopup, setEditEmployeePopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const statusOptions = ["Present", "Absent", "Medical Leave", "Work From Home"];

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

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "" || employee.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className='attendance-container'>
            <div className='attendance-header'>
                <div className='attendance-search-wrapper'>
                    <div className="attendance-search-box">
                        <FaSearch className="attendance-search-icon" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="attendance-search-input"
                        />
                    </div>
                </div>
                <div className='attendance-filter-wrapper'>
                    <div className="attendance-filter-container">
                        <div className="attendance-select-wrapper">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="attendance-status-select"
                            >
                                <option value="">All Status</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <div className="attendance-select-arrow">
                                <svg
                                    className="attendance-arrow-icon"
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

            {editEmployeePopup && <EditAttendanceModal isOpen={editEmployeePopup} onClose={() => setEditEmployeePopup(false)} employee={selectedEmployee} />}

            <div className='attendance-table-wrapper'>
                <div className="attendance-table-container">
                    <table className="attendance-table">
                        <thead className="attendance-table-head">
                            <tr>
                                <th className="attendance-table-header">Sr no.</th>
                                <th className="attendance-table-header">Employee Name</th>
                                <th className="attendance-table-header">Position</th>
                                <th className="attendance-table-header">Department</th>
                                <th className="attendance-table-header">Task</th>
                                <th className="attendance-table-header">Status</th>
                                <th className="attendance-table-header">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee, index) => (
                                    <tr key={employee.id} className="attendance-table-row">
                                        <td className="attendance-table-cell">{`0${index + 1}`}</td>
                                        <td className="attendance-table-cell attendance-employee-name">{employee.name}</td>
                                        <td className="attendance-table-cell">{employee.position}</td>
                                        <td className="attendance-table-cell">{employee.department}</td>
                                        <td className="attendance-table-cell">{employee.task}</td>
                                        <td className="attendance-table-cell">
                                            <div className="attendance-status-dropdown-wrapper">
                                                <select
                                                    className={`attendance-status-dropdown ${statusColors[employee.status]}`}
                                                    value={employee.status}
                                                    onChange={(e) => {
                                                        const updated = [...employees];
                                                        updated[index].status = e.target.value;
                                                        setEmployees(updated);
                                                    }}
                                                >
                                                    <option value="Present">Present</option>
                                                    <option value="Absent">Absent</option>
                                                    <option value="Medical Leave">Medical Leave</option>
                                                    <option value="Work From Home">Work From Home</option>
                                                </select>
                                                <div className="attendance-status-arrow">
                                                    <svg
                                                        className="attendance-status-arrow-icon"
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
                                        </td>
                                        <td className="attendance-table-cell attendance-action-cell">
                                            <div className="attendance-action-wrapper">
                                                <button
                                                    onClick={(e) => toggleActionMenu(employee.id, e, index)}
                                                    className="attendance-action-button"
                                                >
                                                    ⋮
                                                </button>
                                                {openActionMenu === employee.id && (
                                                    <div className={`attendance-action-menu ${shouldOpenUpward(index) ? 'attendance-action-menu-up' : 'attendance-action-menu-down'}`}>
                                                        <ul className="attendance-action-list">
                                                            <li
                                                                className="attendance-action-item"
                                                                onClick={() => handleEditEmployee(employee)}
                                                            >
                                                                Edit
                                                            </li>
                                                            <li
                                                                className="attendance-action-item attendance-action-delete"
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
                                    <td colSpan="7" className="attendance-no-data">
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

export default Attendance;
