import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import AddCandidateModal from '../components/candidates/AddCandidateForm';
import '../assets/styles/candidate/candidate.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { LoadingSpinnerWithoutOverlay } from '../components/global/Loading';

const backend = import.meta.env.VITE_BACKEND

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'selected', label: 'Selected' }
];

const statusColors = {
    ['new']: "border-gray-400 text-black",
    ['scheduled']: "border-blue-500 text-blue-500",
    ['ongoing']: "border-yellow-500 text-yellow-500",
    ['rejected']: "border-red-600 text-red-600",
    ['selected']: "border-purple-700 text-purple-700",
};

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [allCandidates, setAllCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [addCandidatePopup, setAddCandidatePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCandidates();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedStatus, selectedPosition, searchQuery, allCandidates]);

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenActionMenu(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    async function getCandidates() {
        try {
            setLoading(true);

            const response = await axios.post(`${backend}/candidate/list`, {
                pageNum: 1,
                pageSize: 10,
                filter: {}
            });

            const candidateList = response.data.data.candidateList || [];
            const activeCandidates = candidateList.filter(candidate => !candidate.is_deleted);
            setAllCandidates(activeCandidates);
            const uniquePositions = [...new Set(activeCandidates.map(candidate => candidate.position))];
            setPositions(uniquePositions);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    function applyFilters() {
        let filteredCandidates = [...allCandidates];

        if (selectedStatus) {
            filteredCandidates = filteredCandidates.filter(candidate =>
                candidate.status === selectedStatus
            );
        }

        if (selectedPosition) {
            filteredCandidates = filteredCandidates.filter(candidate =>
                candidate.position === selectedPosition
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredCandidates = filteredCandidates.filter(candidate =>
                candidate.full_name.toLowerCase().includes(query) ||
                candidate.email.toLowerCase().includes(query) ||
                candidate.phone_number.toLowerCase().includes(query)
            );
        }

        setCandidates(filteredCandidates);
    }

    const toggleActionMenu = (candidateId, event, index) => {
        event.stopPropagation();
        setOpenActionMenu(openActionMenu === candidateId ? null : candidateId);
    };

    const handleDownloadResume = async (candidate) => {
        try {
            if (!candidate.resume_url) {
                toast.error('Resume not available for this candidate');
                return;
            }
            const loadingToast = toast.loading('Downloading resume...');
            const response = await fetch(candidate.resume_url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${candidate.full_name.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.dismiss(loadingToast);
            toast.success(`Resume downloaded for ${candidate.full_name}`);

        } catch (error) {
            console.error('Error downloading resume:', error);
            toast.error('Failed to download resume. The file might be unavailable or you may not have permission to access it.');
        }
        setOpenActionMenu(null);
    };

    const handleDeleteCandidate = async (candidateId) => {
        try {
            toast.dismiss()
            setLoading(true);
            await axios.post(`${backend}/candidate/${candidateId}/update`, { is_deleted: true });
            toast.success('Candidate deleted successfully');
            setLoading(false);
            getCandidates();
        } catch (error) {
            console.error('Error deleting candidate:', error);
            setLoading(false);
            toast.error(error.response?.data?.data?.message || error.message);
        }
        setOpenActionMenu(null);
    };

    const handleStatusChange = async (candidateId, newStatus, index) => {
        try {
            toast.dismiss()
            setLoading(true);
            const updatedAllCandidates = allCandidates.map(candidate =>
                candidate._id === candidateId
                    ? { ...candidate, status: newStatus }
                    : candidate
            );
            setAllCandidates(updatedAllCandidates);
            await axios.post(`${backend}/candidate/${candidateId}/update`, { status: newStatus });
            toast.success('Status updated successfully');
            setLoading(false);
            getCandidates();
        } catch (error) {
            console.error('Error updating status:', error);
            setLoading(false);
            toast.error(error.response?.data?.data?.message || error.message);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
    };

    const handlePositionFilter = (position) => {
        setSelectedPosition(position);
    };

    return (
        <div className='candidate-container'>
            <div className='candidate-header'>
                <div className='candidate-actions-wrapper'>
                    <div className="candidate-search-container">
                        <FaSearch className="candidate-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone"
                            className="candidate-search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button onClick={() => setAddCandidatePopup(true)} className='candidate-add-btn'>Add Candidate</button>
                </div>
                <div className='candidate-filters-wrapper'>
                    <div className="candidate-filters-container">
                        <div className="candidate-filter-select-wrapper">
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="candidate-filter-select"
                            >
                                <option value="">All Status</option>
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>

                            <div className="candidate-select-arrow candidate-select-arrow-status">
                                <svg
                                    className="candidate-arrow-icon"
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

                        <div className="candidate-filter-select-wrapper">
                            <select
                                value={selectedPosition}
                                onChange={(e) => handlePositionFilter(e.target.value)}
                                className="candidate-filter-select candidate-position-select"
                            >
                                <option value="">All Positions</option>
                                {positions.map((position) => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>

                            <div className="candidate-select-arrow candidate-select-arrow-position">
                                <svg
                                    className="candidate-arrow-icon"
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
            {
                addCandidatePopup && <AddCandidateModal isOpen={addCandidatePopup} onClose={() => {
                    setAddCandidatePopup(false);
                    getCandidates();
                }} />
            }
            <div className='candidate-table-wrapper'>
                <div className="candidate-table-container">
                    {loading ? (
                        <LoadingSpinnerWithoutOverlay />
                    ) : (
                        <table className="candidate-table">
                            <thead className="candidate-table-header">
                                <tr>
                                    <th className="candidate-table-th">Sr no.</th>
                                    <th className="candidate-table-th">Candidates Name</th>
                                    <th className="candidate-table-th">Email Address</th>
                                    <th className="candidate-table-th">Phone Number</th>
                                    <th className="candidate-table-th">Position</th>
                                    <th className="candidate-table-th">Status</th>
                                    <th className="candidate-table-th">Experience</th>
                                    <th className="candidate-table-th">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.length > 0 ? (
                                    candidates.map((candidate, index) => (
                                        <tr key={candidate._id} className="candidate-table-row">
                                            <td className="candidate-table-td">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>
                                            <td className="candidate-table-td">{candidate.full_name}</td>
                                            <td className="candidate-table-td">{candidate.email}</td>
                                            <td className="candidate-table-td">{candidate.phone_number}</td>
                                            <td className="candidate-table-td">{candidate.position}</td>
                                            <td className="candidate-table-td">
                                                <div className="candidate-status-wrapper">
                                                    <select
                                                        className={`candidate-status-select ${statusColors[candidate.status]}`}
                                                        value={candidate.status}
                                                        onChange={(e) => handleStatusChange(candidate._id, e.target.value, index)}
                                                    >
                                                        {statusOptions.map((status) => (
                                                            <option key={status.value} value={status.value}>
                                                                {status.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="candidate-status-arrow">
                                                        <svg
                                                            className="candidate-status-arrow-icon"
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
                                            <td className="candidate-table-td">{candidate.experience}</td>
                                            <td className="candidate-table-td candidate-action-cell">
                                                <div className="candidate-action-wrapper">
                                                    <button
                                                        onClick={(e) => toggleActionMenu(candidate._id, e, index)}
                                                        className="candidate-action-btn"
                                                    >
                                                        ⋮
                                                    </button>
                                                    {openActionMenu === candidate._id && (
                                                        <div className={`candidate-action-menu`}>
                                                            <ul className="candidate-action-list">
                                                                <li
                                                                    className="candidate-action-item"
                                                                    onClick={() => handleDownloadResume(candidate)}
                                                                >
                                                                    Download Resume
                                                                </li>
                                                                <li
                                                                    className="candidate-action-item candidate-action-delete"
                                                                    onClick={() => handleDeleteCandidate(candidate._id)}
                                                                >
                                                                    Delete Candidate
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
                                        <td colSpan="8" className="candidate-table-td candidate-no-data">
                                            {searchQuery || selectedStatus || selectedPosition
                                                ? 'No candidates match the current filters'
                                                : 'No candidates found'
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Candidates
