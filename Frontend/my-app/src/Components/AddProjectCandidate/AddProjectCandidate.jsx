import axios from 'axios';
import Swal from 'sweetalert2';
import './AddProjectCandidate.css';

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
      return (
        <div className="add-project-container">
            <form>
                <h2>Add new Project</h2>
                <div className="form-group">
                    <label>Title</label>
                </div>
                <div className="form-group">
                    <label>Description</label>
                </div>
                <div className="form-group">
                    <label>Links</label>
                </div>
                <div className="form-group">
                    <label>Attachments</label>
                </div>
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
};


export default AddProjectCandidate;