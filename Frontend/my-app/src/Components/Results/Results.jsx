import React, { useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import {
  PieChart,
  Pie as RechartsPie,
  Cell,
  Tooltip as RechartsTooltip
} from 'recharts'
import axios from 'axios'
import swal from 'sweetalert'
import './Results.css'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
  Title
} from 'chart.js'
import { Link } from 'react-router-dom'
import unavailable from '../Assests/unavailable.png'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
  Title
)

const Results = () => {
  const [electionType, setElectionType] = useState('')
  const [elections, setElections] = useState([])
  const [selectedElectionId, setSelectedElectionId] = useState('')
  const [electionDetails, setElectionDetails] = useState(null)
  const [isBlurred, setIsBlurred] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (electionType) {
      const fetchElections = async () => {
        try {
          let url = ''
          switch (electionType) {
            case 'general':
              url = 'http://localhost:5000/api/v1/elections'
              break
            case 'presidential':
              url = 'http://localhost:5000/api/v1/presidentialElections'
              break
            case 'parlimentary':
              url = 'http://localhost:5000/api/v1/parlimentaryElections'
              break
            case 'provincial':
              url = 'http://localhost:5000/api/v1/provincialElections'
              break
            default:
              break
          }

          const response = await axios.get(url)
          setElections(response.data.data)
        } catch (error) {
          console.error('Error fetching elections:', error)
        }
      }

      fetchElections()
    }
  }, [electionType])

  useEffect(() => {
    if (selectedElectionId && electionType) {
      const fetchElectionDetails = async () => {
        try {
          let url = ''
          switch (electionType) {
            case 'general':
              url = `http://localhost:5000/api/v1/results/general/${selectedElectionId}`
              break
            case 'presidential':
              url = `http://localhost:5000/api/v1/results/presidential/${selectedElectionId}`
              break
            case 'parlimentary':
              url = `http://localhost:5000/api/v1/results/parlimentary/${selectedElectionId}`
              break
            case 'provincial':
              url = `http://localhost:5000/api/v1/results/provincial/${selectedElectionId}`
              break
            default:
              console.error('Invalid election type selected')
              return
          }

          const response = await axios.get(url)
          console.log('API Response:', response.data.data)

          // Transform or validate the data if necessary
          setElectionDetails(response.data.data || null)
        } catch (error) {
          console.error('Error fetching election details:', error)
        }
      }

      fetchElectionDetails()
    }
  }, [selectedElectionId, electionType])

  useEffect(() => {
    if (electionDetails) {
      console.log('Updated Election Details:', electionDetails)
    }
  }, [electionDetails])

  const handleElectionTypeChange = e => {
    const electionType = e.target.value
    setElectionType(electionType)
    console.log(electionType)

    setElections([])
    setSelectedElectionId('')
    setElectionDetails(null)
  }

  const handleElectionChange = event => {
    const selectedId = event.target.value
    setSelectedElectionId(selectedId)

    // Find the selected election
    const selectedElection = elections.find(
      election => election._id === selectedId
    )

    if (selectedElection) {
      const status = getElectionStatus(
        selectedElection.startTime,
        selectedElection.endTime
      )

      if (status === 'Upcoming') {
        setIsBlurred(true) // Activate blur effect
        swal('Warning', 'The Election is still not Started', 'warning').then(
          () => {
            navigate('/') // Use the navigate hook here
          }
        )
        return // Stop further execution
      }

      if (status === 'Ongoing') {
        swal(
          'Notice',
          'The Election is Ongoing, Please Check the result after it finishes',
          'info'
        ).then(() => {
          navigate('/') // Use the navigate hook here
        })
        return // Stop further execution
      }

      // Proceed to fetch and display election details if it's "Finished"
      setSelectedElectionId(selectedId)
    }
  }
  // Calculate total votes
  const calculateTotalVotes = () => {
    if (!electionDetails || !electionDetails.results?.voteDistribution) return 0
    return electionDetails.results.voteDistribution.reduce(
      (total, item) => total + item.votes,
      0
    )
  }

  // Find the winner
  const findWinner = () => {
    if (!electionDetails || !electionDetails.results?.voteDistribution)
      return null
    const sortedCandidates = [...electionDetails.results.voteDistribution].sort(
      (a, b) => b.votes - a.votes
    )
    const winner = sortedCandidates[0]?.candidateId?.user

    if (winner) {
      return `${winner.firstName} ${winner.lastName}` // Concatenate first and last names
    }
    return 'Unknown'
  }
  // Find the winning party
  const findWinningParty = () => {
    if (!electionDetails || !electionDetails.results?.voteDistribution)
      return 'No party declared'

    const partyVotes = {}
    electionDetails.results.voteDistribution.forEach(item => {
      const party = item.candidateId?.party?.name || 'Unknown Party'
      partyVotes[party] = (partyVotes[party] || 0) + item.votes
    })

    const sortedParties = Object.entries(partyVotes).sort((a, b) => b[1] - a[1])
    return sortedParties[0]?.[0] || 'No party declared'
  }
  const COLORS = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40'
  ]

  const voteDistribution = electionDetails?.results.voteDistribution || [] // Ensure it's an array
  const pieChartData = {
    labels: voteDistribution.map(
      item => item.candidateId?.user?.firstName || 'Unknown'
    ),
    datasets: [
      {
        data: voteDistribution.map(item => item.votes),
        backgroundColor: COLORS
      }
    ]
  }

  const barChartData = {
    labels: voteDistribution.map(
      item => item.candidateId?.user.firstName || 'Unknown'
    ),
    datasets: [
      {
        label: 'Votes',
        data: voteDistribution.map(item => item.votes),
        backgroundColor: COLORS
      }
    ]
  }

  const rechartsData = voteDistribution.map(item => ({
    name: item.candidateId?.user.firstName || 'Unknown',
    votes: item.votes
  }))

  const allProvinces = [
    'Western Province',
    'Central Province',
    'Southern Province',
    'Northern Province',
    'Eastern Province',
    'North Western Province',
    'North Central Province',
    'Uva Province',
    'Sabaragamuwa Province'
  ]

  const allDistricts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle'
  ]

  // Initialize district and province data with all provinces/districts set to 0
  const districtData = Object.fromEntries(
    allDistricts.map(district => [district, 0])
  )
  const provinceData = Object.fromEntries(
    allProvinces.map(province => [province, 0])
  )

  // Update data with actual voter counts
  voteDistribution.forEach(item => {
    item.voters.forEach(voter => {
      // Increment district counts
      if (districtData[voter.district] !== undefined) {
        districtData[voter.district] += 1
      }

      // Increment province counts
      if (provinceData[voter.province] !== undefined) {
        provinceData[voter.province] += 1
      }
    })
  })
  // Transform district and province data for the charts
  const districtChartData = {
    labels: allDistricts,
    datasets: [
      {
        label: 'Voters by District',
        data: allDistricts.map(district => districtData[district]),
         backgroundColor: COLORS.slice(0, allDistricts.length)
      }
    ]
  }
  const provinceChartData = {
    labels: allProvinces,
    datasets: [
      {
        label: 'Voters by Province',
        data: allProvinces.map(province => provinceData[province]),
        backgroundColor: COLORS.slice(0, allProvinces.length)
      }
    ]
  }
  const getElectionStatus = (startTime, endTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now < start) return 'Upcoming'
    if (now >= start && now <= end) return 'Ongoing'
    return 'Finished'
  }
}
