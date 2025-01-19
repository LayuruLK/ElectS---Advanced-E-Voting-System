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