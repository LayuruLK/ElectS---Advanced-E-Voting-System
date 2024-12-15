import axios from 'axios';
import Swal from 'sweetalert2';

const AddProjectCandidate = () => {
    const checkIfUserIsCandidate = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/users/profile/${userId}`);
          return response.data.isCandidate;
        } catch (err) {
          Swal.fire('Error', 'Failed to check user status', 'error');
          return false;
        }
      };
};

export default AddProjectCandidate;