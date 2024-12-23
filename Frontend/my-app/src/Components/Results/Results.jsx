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
};
