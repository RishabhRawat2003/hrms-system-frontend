
import { toast } from 'react-toastify';
import Logo from '../assets/images/Logo.png';
import { useEffect, useRef, useState } from 'react';
import {
    FaTimes,
    FaBars,
    FaSignOutAlt,
    FaRegBell,
    FaChevronDown,
    FaSearch
} from 'react-icons/fa';
import { MdOutlineEmail } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { RxExit } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi";
import { BsBarChart, BsStars } from "react-icons/bs";
import { LoadingSpinnerWithOverlay } from '../components/global/Loading';
import { Link } from 'react-router';
import PopupModal from '../components/global/Popup';
import '../assets/styles/dashboard/dashboard.css';

const Candidates = () => <SectionPlaceholder title="Candidates" />;
const Employees = () => <SectionPlaceholder title="Employees" />;
const Attendance = () => <SectionPlaceholder title="Attendance" />;
const Leaves = () => <SectionPlaceholder title="Leaves" />;

const SectionPlaceholder = ({ title }) => (
    <div className="dashboard-section-placeholder">
        <h2 className="dashboard-section-title">{title}</h2>
        <div className="dashboard-section-content">Content will be displayed here</div>
    </div>

);

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState('candidates');
    const [logoutPopup, setLogoutPopup] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);


    const renderSection = () => {
        switch (activeSection) {
            case 'candidates': return <Candidates />;
            case 'employees': return <Employees />;
            case 'attendance': return <Attendance />;
            case 'leaves': return <Leaves />;
            default: return <Candidates />;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Type assertion to satisfy .contains()
            if (
                dropdownRef.current &&
                event.target instanceof Node &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const recurimentItems = [
        {
            title: 'Candidates',
            link: '/candidate',
            label: 'candidates',
            icon: TiUserAddOutline
        }
    ]

    const organisationItems = [
        {
            title: 'Employees',
            link: '/employee',
            label: 'employees',
            icon: HiOutlineUsers
        },
        {
            title: 'Attendance',
            link: '/attendance',
            label: 'attendance',
            icon: BsBarChart
        },
        {
            title: 'Leaves',
            link: '/leaves',
            label: 'leaves',
            icon: BsStars
        }
    ]

    function handleLogout() {
        toast.success('Logged out successfully')
    }

    return (
        <div className="dashboard-container">
            {
                loading
                    ? <LoadingSpinnerWithOverlay />
                    : <>
                        {/* Mobile sidebar toggle button */}
                        <button
                            className="mobile-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? (
                                <FaTimes className="toggle-icon" />
                            ) : (
                                <FaBars className="toggle-icon" />
                            )}
                        </button>


                        {/* Sidebar */}
                        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                            <div className="logo-container">
                                <img src={Logo} alt="logo" className='sidebar-logo' />
                            </div>

                            <div className="search-container">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="search-input"
                                />
                            </div>

                            <div className='nav-section'>
                                <h1 className='nav-heading'>Recruitment</h1>
                                {recurimentItems.map((item, index) => {
                                    const isActive = activeSection === item.label;

                                    return (
                                        <div
                                            key={index}
                                            className={`nav-item nav-item-recruitment ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                                            onClick={() => setActiveSection(item.label)}
                                        >
                                            {isActive && <div className='nav-indicator'></div>}
                                            <div className="nav-icon">
                                                <item.icon size={20} />
                                            </div>
                                            <Link className="nav-link">
                                                {item.title}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className='nav-section'>
                                <h1 className='nav-heading'>Organization</h1>
                                {organisationItems.map((item, index) => {
                                    const isActive = activeSection === item.label;

                                    return (
                                        <div
                                            key={index}
                                            className={`nav-item nav-item-organization ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                                            onClick={() => setActiveSection(item.label)}
                                        >
                                            {isActive && <div className='nav-indicator'></div>}
                                            <div className="nav-icon">
                                                <item.icon size={20} />
                                            </div>
                                            <Link className="nav-link">
                                                {item.title}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className='nav-section'>
                                <h1 className='nav-heading'>Others</h1>
                                <div
                                    className="nav-item nav-item-recruitment nav-item-inactive"
                                    onClick={() => setLogoutPopup(true)}
                                >
                                    <div className="nav-icon">
                                        <RxExit size={20} />
                                    </div>
                                    <Link className="nav-link">
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </aside>


                        <main className="dashboard-main-container">
                            <header className="dashboard-header-section">
                                <h1 className="dashboard-page-title">
                                    {[...recurimentItems, ...organisationItems].find(item => item.label === activeSection)?.label || 'Dashboard'}
                                </h1>
                                <div className="dashboard-header-actions" ref={dropdownRef}>
                                    <div className="dashboard-notification-container">
                                        <MdOutlineEmail className="dashboard-notification-icon" />
                                        <span className="dashboard-notification-badge"></span>
                                    </div>

                                    <div className="dashboard-notification-container">
                                        <FaRegBell className="dashboard-notification-icon" />
                                        <span className="dashboard-notification-badge"></span>
                                    </div>

                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="dashboard-profile-button"
                                        aria-haspopup="true"
                                        aria-expanded={isOpen}
                                    >
                                        <img
                                            src="https://randomuser.me/api/portraits/women/44.jpg"
                                            alt="User"
                                            className="dashboard-profile-image"
                                        />
                                        <FaChevronDown className="dashboard-profile-chevron" />
                                    </button>

                                    {isOpen && (
                                        <div className="dashboard-dropdown-menu">
                                            <button
                                                onClick={() => setLogoutPopup(true)}
                                                className="dashboard-dropdown-item"
                                            >
                                                <FaSignOutAlt className="dashboard-dropdown-icon" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </header>

                            <div className="dashboard-content-area">
                                {renderSection()}
                            </div>
                        </main>


                        {/* logout popup */}
                        {
                            logoutPopup && (
                                <PopupModal
                                    isOpen={logoutPopup}
                                    title="Logout"
                                    message="Are you sure you want to logout?"
                                    onCancel={() => setLogoutPopup(false)}
                                    onConfirm={handleLogout}
                                    confirmText="Logout"
                                    cancelText="Cancel"
                                />
                            )
                        }
                    </>
            }

        </div>
    );
}