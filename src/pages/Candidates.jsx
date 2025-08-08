import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import AddCandidateModal from '../components/candidates/AddCandidateForm';
import '../assets/styles/candidate/candidate.css';

const candidatesData = [
    {
        id: 1,
        name: "Jacob William",
        email: "jacob.william@example.com",
        phone: "(252) 555-0111",
        position: "Senior Developer",
        status: "New",
        experience: "1+",
    },
    {
        id: 2,
        name: "Guy Hawkins",
        email: "kenzi.lawson@example.com",
        phone: "(907) 555-0101",
        position: "Human Resource Intern",
        status: "New",
        experience: "1",
    },
    {
        id: 3,
        name: "Arlene McCoy",
        email: "arlene.mccoy@example.com",
        phone: "(302) 555-0107",
        position: "Full Time Designer",
        status: "Selected",
        experience: "3",
    },
    {
        id: 4,
        name: "Leslie Alexander",
        email: "willie.jennings@example.com",
        phone: "(207) 555-0119",
        position: "Full Time Developer",
        status: "Rejected",
        experience: "0",
    },
];

const statusColors = {
    New: "border-gray-400 text-black",
    Selected: "border-purple-700 text-purple-700",
    Rejected: "border-red-600 text-red-600",
};

function Candidates() {
    const [candidates, setCandidates] = useState(candidatesData);
    const [positions, setPositions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [addCandidatePopup, setAddCandidatePopup] = useState(false);

    const statusOptions = ["Active", "Inactive", "Pending"];

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await new Promise((resolve) =>
                setTimeout(() => resolve(["Manager", "Developer", "Designer"]), 500)
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

    const toggleActionMenu = (candidateId, event, index) => {
        event.stopPropagation();
        setOpenActionMenu(openActionMenu === candidateId ? null : candidateId);
    };

    const handleDownloadResume = (candidate) => {
        console.log(`Downloading resume for ${candidate.name}`);
        setOpenActionMenu(null);
    };

    const handleDeleteCandidate = (candidateId) => {
        const updatedCandidates = candidates.filter(candidate => candidate.id !== candidateId);
        setCandidates(updatedCandidates);
        setOpenActionMenu(null);
    };

    const shouldOpenUpward = (index) => {
        return index >= candidates.length - 2;
    };

    return (
        <div className='candidate-container'>
            <div className='candidate-header'>
                <div className='candidate-actions-wrapper'>
                    <div className="candidate-search-container">
                        <FaSearch className="candidate-search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="candidate-search-input"
                        />
                    </div>
                    <button onClick={() => setAddCandidatePopup(true)} className='candidate-add-btn'>Add Candidate</button>
                </div>
                <div className='candidate-filters-wrapper'>
                    <div className="candidate-filters-container">
                        <div className="candidate-filter-select-wrapper">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="candidate-filter-select"
                            >
                                <option value="">Status</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
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
                                onChange={(e) => setSelectedPosition(e.target.value)}
                                className="candidate-filter-select candidate-position-select"
                            >
                                <option value="">Position</option>
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
                addCandidatePopup && <AddCandidateModal isOpen={addCandidatePopup} onClose={() => setAddCandidatePopup(false)} />
            }
            <div className='candidate-table-wrapper'>
                <div className="candidate-table-container">
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
                            {candidates.map((candidate, index) => (
                                <tr key={candidate.id} className="candidate-table-row">
                                    <td className="candidate-table-td">{`0${index + 1}`}</td>
                                    <td className="candidate-table-td">{candidate.name}</td>
                                    <td className="candidate-table-td">{candidate.email}</td>
                                    <td className="candidate-table-td">{candidate.phone}</td>
                                    <td className="candidate-table-td">{candidate.position}</td>
                                    <td className="candidate-table-td">
                                        <div className="candidate-status-wrapper">
                                            <select
                                                className={`candidate-status-select ${statusColors[candidate.status]}`}
                                                value={candidate.status}
                                                onChange={(e) => {
                                                    const updated = [...candidates];
                                                    updated[index].status = e.target.value;
                                                    setCandidates(updated);
                                                }}
                                            >
                                                <option value="New">New</option>
                                                <option value="Selected">Selected</option>
                                                <option value="Rejected">Rejected</option>
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
                                                onClick={(e) => toggleActionMenu(candidate.id, e, index)}
                                                className="candidate-action-btn"
                                            >
                                                ⋮
                                            </button>
                                            {openActionMenu === candidate.id && (
                                                <div className={`candidate-action-menu ${shouldOpenUpward(index) ? 'candidate-action-menu-up' : 'candidate-action-menu-down'}`}>
                                                    <ul className="candidate-action-list">
                                                        <li
                                                            className="candidate-action-item"
                                                            onClick={() => handleDownloadResume(candidate)}
                                                        >
                                                            Download Resume
                                                        </li>
                                                        <li
                                                            className="candidate-action-item candidate-action-delete"
                                                            onClick={() => handleDeleteCandidate(candidate.id)}
                                                        >
                                                            Delete Candidate
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

export default Candidates
