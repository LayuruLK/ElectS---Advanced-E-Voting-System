import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie as RechartsPie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import axios from 'axios';
import swal from 'sweetalert';
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
import { Link } from 'react-router-dom';
import unavailable from '../Assests/unavailable.png'

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement, Title);

const Results = () => {
    const [electionType, setElectionType] = useState('');
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [electionDetails, setElectionDetails] = useState(null);
    const [isBlurred, setIsBlurred] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (electionType) {
            const fetchElections = async () => {
                try {
                    let url = '';
                    switch (electionType) {
                        case 'general':
                            url = 'http://localhost:5000/api/v1/elections';
                            break;
                        case 'presidential':
                            url = 'http://localhost:5000/api/v1/presidentialElections';
                            break;
                        case 'parlimentary':
                            url = 'http://localhost:5000/api/v1/parlimentaryElections';
                            break;
                        case 'provincial':
                            url = 'http://localhost:5000/api/v1/provincialElections';
                            break;
                        default:
                            break;
                    }

                    const response = await axios.get(url);
                    setElections(response.data.data);
                } catch (error) {
                    console.error('Error fetching elections:', error);
                }
            };

            fetchElections();
        }
    }, [electionType]);

    useEffect(() => {
        if (selectedElectionId && electionType) {
            const fetchElectionDetails = async () => {
                try {
                    let url = '';
                    switch (electionType) {
                        case 'general':
                            url = `http://localhost:5000/api/v1/results/general/${selectedElectionId}`;
                            break;
                        case 'presidential':
                            url = `http://localhost:5000/api/v1/results/presidential/${selectedElectionId}`;
                            break;
                        case 'parlimentary':
                            url = `http://localhost:5000/api/v1/results/parlimentary/${selectedElectionId}`;
                            break;
                        case 'provincial':
                            url = `http://localhost:5000/api/v1/results/provincial/${selectedElectionId}`;
                            break;
                        default:
                            console.error('Invalid election type selected');
                            return;
                    }

                    const response = await axios.get(url);
                    console.log('API Response:', response.data.data);

                    // Transform or validate the data if necessary
                    setElectionDetails(response.data.data || null);
                } catch (error) {
                    console.error('Error fetching election details:', error);
                }
            };

            fetchElectionDetails();
        }
    }, [selectedElectionId, electionType]);
}