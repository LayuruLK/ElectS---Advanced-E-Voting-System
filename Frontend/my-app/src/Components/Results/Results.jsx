import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { PieChart, Pie as RechartsPie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import axios from 'axios';
import './Results.css';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    BarElement,
    Title,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement, Title);

const Results = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [electionDetails, setElectionDetails] = useState(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/elections');
                setElections(response.data.data);
            } catch (error) {
                console.error('Error fetching elections:', error);
            }
        };

        fetchElections();
    }, []);

    useEffect(() => {
        if (selectedElectionId) {
            const fetchElectionDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/v1/results/results/${selectedElectionId}`);
                    setElectionDetails(response.data.data || null);
                } catch (error) {
                    console.error('Error fetching election details:', error);
                }
            };

            fetchElectionDetails();
        }
    }, [selectedElectionId]);

    const handleElectionChange = (e) => {
        setSelectedElectionId(e.target.value);
        setElectionDetails(null);
    };
    
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const voteDistribution = electionDetails?.voteDistribution || [];
const pieChartData = {
    labels: voteDistribution.map((item) => item.candidateId?.user?.firstName || 'Unknown'),
    datasets: [
        {
            data: voteDistribution.map((item) => item.votes),
            backgroundColor: COLORS,
        },
    ],
};

const barChartData = {
    labels: voteDistribution.map((item) => item.candidateId?.name || 'Unknown'),
    datasets: [
        {
            label: 'Votes',
            data: voteDistribution.map((item) => item.votes),
            backgroundColor: COLORS,
        },
    ],
};

const rechartsData = voteDistribution.map((item) => ({
    name: item.candidateId?.name || 'Unknown',
    votes: item.votes,
}));


    return (
        <div className="results-container">
            <h1>Election Results</h1>
            <div className="form-container">
                <label htmlFor="election">Select an Election</label>
                <select id="election" value={selectedElectionId} onChange={handleElectionChange}>
                    <option value="">Select an Election</option>
                    {elections.map((election) => (
                        <option key={election._id} value={election._id}>
                            {election.name}
                        </option>
                    ))}
                </select>
            </div>

            {electionDetails && (
    <div className="results-details">
        <h2>{electionDetails.name}</h2>
        <p>{electionDetails.description}</p>
        <div className="results-summary">
            <h3>Total Votes: {electionDetails.totalVotes}</h3>
            <h3>Winner: {electionDetails.winningCandidate?.name || 'No winner yet'}</h3>
            <h3>Winning Party: {electionDetails.winningParty?.name || 'No party declared'}</h3>
        </div>
        <div className="charts">
    <div className="chart">
        <h3>Pie Chart</h3>
        <Pie data={pieChartData} />
    </div>
    <div className="chart">
        <h3>Bar Chart</h3>
        <Bar data={barChartData} />
    </div>
    <div className="chart">
        <h3>Recharts Pie Chart</h3>
        <PieChart width={400} height={400}>
            <RechartsPie
                data={rechartsData}
                dataKey="votes"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
            >
                {rechartsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </RechartsPie>
            <RechartsTooltip />
            <Legend />
        </PieChart>
    </div>
</div>

    </div>
)}

        </div>
    );
    
};
