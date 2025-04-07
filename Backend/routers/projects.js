const express = require('express');
const router = express.Router();
const {Project} = require('../models/project');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');

const multer = require('multer');
const cloudinaryStorage = require('../helpers/cloudinaryStorage');
const uploadfile = multer({ storage: cloudinaryStorage });

const name = 'Project'

//Get Projects
router.get('/', async(req,res) => {
    Service.getAll(res, Project, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

//Get Project Populated by user
router.get('/all', async(req,res) => {
    try {
        const projects = await Project.find().populate('user')

        if(!projects) {
            return res.status(404).json({ success: false, message: 'No projects found' });
        }
        
        res.status(200).json({ success: true, data: projects });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
})

//Get Project By id
router.get('/pjct/:id', async(req,res) =>{
    Service.getById(req, res, Project, name).catch((error) =>{
        res.status(500).send(error+ " Server Error")
    })
})

//Delete an Project
router.delete('/:id',(req,res)=>{
    Service.deleteById(req,res,Project,name).catch((error) => {
        res.status(500).send(error+" Server Error")
    })
})


//getCount
router.get('/get/count', (req,res) => {
    Service.getCount(res, Project, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})


// Create a new Project with file handling for images, PDFs, and videos
router.post('/', uploadfile.array('attachments', 10), async (req, res) => {
    try {
        const { title, description, links, user} = req.body;
        

        // Store file paths
        const attachments = req.files.map(file => file.path);

        const project = new Project({
            user,
            title,
            description,
            links,
            attachments
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        return res.status(500).send(error + " Server Error");
    }
});


// Get projects by candidate ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const projects = await Project.find({ user: id });
      if (!projects) {
        return res.status(404).json({ success: false, message: 'No projects found' });
      }
      res.status(200).json({ success: true, data: projects });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });


  // Update an existing Project
router.put('/:id', uploadfile.array('attachments', 10), async (req, res) => {
    try {
        const { title, description, links } = req.body;
        const { id } = req.params;

        // Find the existing project by ID
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Update the project fields
        project.title = title || project.title;
        project.description = description || project.description;
        project.links = links || project.links;

        // Update attachments if new files are uploaded
        if (req.files.length > 0) {
            project.attachments = req.files.map(file => file.path);
        }

        // Save the updated project
        const updatedProject = await project.save();
        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
});

// Get projects pending review
router.get('/show/pending-reviews', async (req, res) => {
    try {
        // Fetch projects where isApproved is null (pending)
        const pendingProjects = await Project.find({ isReviewed: false })
            .populate('user', 'firstName lastName email') // Ensure `name` and `email` exist in the `User` schema
            .exec();


        res.status(200).json({ success: true, data: pendingProjects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Update project review status
router.put('/review/:id', async (req, res) => {
    const { id } = req.params;
    const { isReviewed, reviewComments } = req.body;

    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Update the approval status
        project.isReviewed = isReviewed;
        project.reviewComments = reviewComments;
        
        const updatedProject = await project.save();

        res.status(200).json({ success: true, message: 'Project reviewed successfully', data: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



router.get('/get/pendingverifications/count', async (req, res) => {
    try {
      const pendingUsersCount = await Project.countDocuments({ isReviewed: false });
      res.status(200).json({ success: true, count: pendingUsersCount });
    } catch (error) {
      console.error('Error fetching pending verifications count:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


module.exports = router;