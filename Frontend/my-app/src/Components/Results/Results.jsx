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
