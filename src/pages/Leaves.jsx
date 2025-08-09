import { useState, useMemo, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import '../assets/styles/leaves/leaves.css';
import AddLeavesModal from '../components/leaves/AddLeavesModal';


const LeaveCalendar = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [leavesByDate, setLeavesByDate] = useState({});
    const [loading, setLoading] = useState(false);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const simulateApiCall = (month, year) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeLeaveData = {};
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                for (let day = 1; day <= daysInMonth; day++) {
                    if (Math.random() < 0.15) {
                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const numLeaves = Math.floor(Math.random() * 3) + 1;

                        fakeLeaveData[dateKey] = [];
                        for (let i = 0; i < numLeaves; i++) {
                            fakeLeaveData[dateKey].push({
                                id: `leave-${day}-${i}`,
                                name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'][Math.floor(Math.random() * 5)],
                                designation: ['Software Engineer', 'Project Manager', 'UI/UX Designer', 'DevOps Engineer', 'Business Analyst'][Math.floor(Math.random() * 5)],
                                leaveType: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Personal Leave'][Math.floor(Math.random() * 4)],
                                reason: ['Medical checkup', 'Family function', 'Personal work', 'Vacation', 'Emergency'][Math.floor(Math.random() * 5)],
                                status: 'Approved',
                                startDate: dateKey,
                                endDate: dateKey
                            });
                        }
                    }
                }
                resolve(fakeLeaveData);
            }, 500);
        });
    };

    useEffect(() => {
        const fetchLeaves = async () => {
            setLoading(true);
            try {
                const data = await simulateApiCall(currentMonth, currentYear);
                setLeavesByDate(data);
            } catch (error) {
                console.error('Error fetching leaves:', error);
                setLeavesByDate({});
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, [currentMonth, currentYear]);

    const calendarData = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            const dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
            const isCurrentMonth = current.getMonth() === currentMonth;
            const isToday = current.toDateString() === today.toDateString();
            const hasLeaves = leavesByDate[dateKey] && leavesByDate[dateKey].length > 0;

            days.push({
                date: new Date(current),
                dateKey,
                day: current.getDate(),
                isCurrentMonth,
                isToday,
                hasLeaves,
                leavesCount: hasLeaves ? leavesByDate[dateKey].length : 0
            });

            current.setDate(current.getDate() + 1);
        }

        return days;
    }, [currentMonth, currentYear, leavesByDate]);

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const selectedLeaves = selectedDate ? (leavesByDate[selectedDate] || []) : [];

    const approvedLeavesForMonth = useMemo(() => {
        const leaves = [];
        calendarData
            .filter(day => day.isCurrentMonth && day.hasLeaves)
            .forEach(day => {
                const dayLeaves = leavesByDate[day.dateKey] || [];
                dayLeaves.forEach(leave => {
                    if (leave.status === 'Approved') {
                        leaves.push({
                            ...leave,
                            date: day.date
                        });
                    }
                });
            });
        return leaves.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [calendarData, leavesByDate]);

    return (
        <div className="leave-calendar-wrapper">
            <div className="leave-calendar-container">
                <div className="leave-calendar-grid">
                    <div className="leave-calendar-main-section">
                        <div className="leave-calendar-card">
                            <div className="leave-calendar-header">
                                <div className="leave-calendar-nav">
                                    <button
                                        onClick={goToPreviousMonth}
                                        disabled={loading}
                                        className="leave-calendar-nav-button"
                                    >
                                        <HiChevronLeft className="leave-calendar-nav-icon" />
                                    </button>
                                    <h2 className="leave-calendar-title">
                                        {monthNames[currentMonth]} {currentYear}
                                        {loading && <span className="leave-calendar-loading">Loading...</span>}
                                    </h2>
                                    <button
                                        onClick={goToNextMonth}
                                        disabled={loading}
                                        className="leave-calendar-nav-button"
                                    >
                                        <HiChevronRight className="leave-calendar-nav-icon" />
                                    </button>
                                </div>
                            </div>

                            <div className="leave-calendar-content">
                                <div className="leave-calendar-days-header">
                                    {dayNames.map((day) => (
                                        <div key={day} className="leave-calendar-day-name">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="leave-calendar-days-grid">
                                    {calendarData.map((dayData, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (dayData.isCurrentMonth && dayData.hasLeaves) {
                                                    setSelectedDate(dayData.dateKey);
                                                }
                                            }}
                                            className={`leave-calendar-day ${dayData.isCurrentMonth
                                                    ? 'leave-calendar-day-current'
                                                    : 'leave-calendar-day-other'
                                                } ${dayData.isToday
                                                    ? 'leave-calendar-day-today'
                                                    : ''
                                                } ${dayData.hasLeaves && dayData.isCurrentMonth
                                                    ? 'leave-calendar-day-has-leaves'
                                                    : ''
                                                } ${selectedDate === dayData.dateKey
                                                    ? 'leave-calendar-day-selected'
                                                    : ''
                                                }`}
                                        >
                                            <span className="leave-calendar-day-number">
                                                {dayData.day}
                                            </span>

                                            {dayData.hasLeaves && dayData.isCurrentMonth && (
                                                <div className="leave-calendar-leave-indicator">
                                                    <div className="leave-calendar-leave-dot"></div>
                                                    {dayData.leavesCount > 1 && (
                                                        <span className="leave-calendar-leave-count">
                                                            {dayData.leavesCount}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedDate && selectedLeaves.length > 0 && (
                            <div className="leave-calendar-selected-details">
                                <div className="leave-calendar-selected-content">
                                    <h3 className="leave-calendar-selected-title">
                                        Leaves on {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h3>
                                    <div className="leave-calendar-selected-list">
                                        {selectedLeaves.map((leave) => (
                                            <div key={leave.id} className="leave-calendar-selected-item">
                                                <div className="leave-calendar-selected-item-content">
                                                    <div className="leave-calendar-selected-item-info">
                                                        <h4 className="leave-calendar-selected-item-name">{leave.name}</h4>
                                                        <p className="leave-calendar-selected-item-designation">{leave.designation}</p>
                                                        <p className="leave-calendar-selected-item-type">{leave.leaveType}</p>
                                                        <p className="leave-calendar-selected-item-reason">{leave.reason}</p>
                                                    </div>
                                                    <span className="leave-calendar-selected-item-status">
                                                        {leave.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="leave-calendar-sidebar">
                        <div className="leave-calendar-approved-section">
                            <div className="leave-calendar-approved-content">
                                <h3 className="leave-calendar-approved-title">
                                    Approved Leaves
                                </h3>

                                {loading ? (
                                    <div className="leave-calendar-loading-container">
                                        <div className="leave-calendar-loading-spinner"></div>
                                    </div>
                                ) : approvedLeavesForMonth.length > 0 ? (
                                    <div className="leave-calendar-approved-list">
                                        {approvedLeavesForMonth.map((leave) => (
                                            <div key={`${leave.id}-${leave.date}`} className="leave-calendar-approved-item">
                                                <div className="leave-calendar-approved-item-header">
                                                    <div className="leave-calendar-approved-item-info">
                                                        <h4 className="leave-calendar-approved-item-name">{leave.name}</h4>
                                                        <p className="leave-calendar-approved-item-designation">{leave.designation}</p>
                                                    </div>
                                                    <span className="leave-calendar-approved-item-date">
                                                        {new Date(leave.date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="leave-calendar-approved-item-details">
                                                    <p className="leave-calendar-approved-item-type">{leave.leaveType}</p>
                                                    <p className="leave-calendar-approved-item-reason">{leave.reason}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="leave-calendar-no-leaves">
                                        <p className="leave-calendar-no-leaves-text">No approved leaves this month</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


function Leaves() {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [addLeavePopup, setAddLeavePopup] = useState(false);

    const [leaves, setLeaves] = useState([
        {
            id: 1,
            name: "Jane Cooper",
            designation: "Full Time Designer",
            date: "10/09/24",
            reason: "Visiting House",
            status: "Approved",
            profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        },
        {
            id: 2,
            name: "Cody Fisher",
            designation: "Senior Backend Developer",
            date: "8/09/24",
            reason: "Visiting House",
            status: "Approved",
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        }
    ]);

    const handleStatusChange = (id, newStatus) => {
        setLeaves(leaves.map(leave =>
            leave.id === id ? { ...leave, status: newStatus } : leave
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const statusOptions = ['Approved', 'Pending', 'Rejected'];

    return (
        <div className='leave-container'>
            <div className='leave-header'>
                <div className='leave-actions-wrapper'>
                    <div className="leave-search-container">
                        <FaSearch className="leave-search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="leave-search-input"
                        />
                    </div>
                    <button onClick={() => setAddLeavePopup(true)} className='leave-add-btn'>Add Leave</button>
                </div>

                <div className='leave-filters-wrapper'>
                    <div className="leave-filters-container">
                        <div className="leave-filter-select-wrapper">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="leave-filter-select"
                            >
                                <option value="">Status</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <div className="leave-select-arrow">
                                <svg className="leave-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
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

            {/* Modal */}
            {addLeavePopup && (
                <AddLeavesModal
                    isOpen={addLeavePopup}
                    onClose={() => setAddLeavePopup(false)}
                />
            )}


            <div className='leaves-table-wrapper'>
                <div className='leaves-table-container'>
                    <div className='leaves-table-inner-container'>
                        <div className="leaves-table-card">
                            <div className="leaves-table-header">
                                <h2 className="leaves-table-title">Applied Leaves</h2>
                            </div>

                            <div className="leaves-table-scroll-container">
                                <table className="leaves-table">
                                    <thead className="leaves-table-thead">
                                        <tr>
                                            <th className="leaves-table-th">Sr. No.</th>
                                            <th className="leaves-table-th">Name</th>
                                            <th className="leaves-table-th">Date</th>
                                            <th className="leaves-table-th">Reason</th>
                                            <th className="leaves-table-th">Status</th>
                                            <th className="leaves-table-th">Docs</th>
                                        </tr>
                                    </thead>

                                    <tbody className="leaves-table-tbody">
                                        {leaves.map((leave, index) => (
                                            <tr key={leave.id} className="leaves-table-row">
                                                <td className="leaves-table-td">
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="leaves-table-td">
                                                    <div>
                                                        <div className="leaves-employee-name">{leave.name}</div>
                                                        <div className="leaves-employee-designation">{leave.designation}</div>
                                                    </div>
                                                </td>
                                                <td className="leaves-table-td">
                                                    <div className="leaves-date-text">{leave.date}</div>
                                                </td>
                                                <td className="leaves-table-td">
                                                    <div className="leaves-reason-text">{leave.reason}</div>
                                                </td>
                                                <td className="leaves-table-td">
                                                    <div className="leaves-status-wrapper">
                                                        <select
                                                            value={leave.status}
                                                            onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                                                            className={`leaves-status-select ${getStatusColor(leave.status)}`}
                                                        >
                                                            <option value="Approved">Approved</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                        <div className="leaves-status-arrow">
                                                            <svg className="leaves-status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="leaves-table-td">
                                                    <button className="leaves-docs-button">
                                                        <svg className="leaves-docs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <LeaveCalendar />
            </div>

        </div>
    );
}

export default Leaves;
