const Proposal = require('../models/Proposal');
const Job = require('../models/Job');

// @desc    Submit a proposal for a job
// @route   POST /api/proposals
// @access  Private (Freelancer only)
const submitProposal = async (req, res) => {
    try {
        // Sirf freelancer hi proposal bhej sakta hai
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can submit proposals' });
        }

        const { job: jobId, coverLetter, proposedBudget, deliveryDays } = req.body;

        // Check if job exists and is open
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status !== 'open') return res.status(400).json({ message: 'This job is not open for proposals' });

        // Check if user already submitted a proposal for this job
        // Ek freelancer ek job pe ek hi proposal bhej sakta hai
        const alreadySubmitted = await Proposal.findOne({
            job: jobId,
            freelancer: req.user.id
        });

        if (alreadySubmitted) {
            return res.status(400).json({ message: 'You have already submitted a proposal for this job' });
        }

        // Create new proposal
        const proposal = new Proposal({
            job: jobId,
            freelancer: req.user.id,
            coverLetter,
            proposedBudget,
            deliveryDays
        });

        const createdProposal = await proposal.save();
        res.status(201).json(createdProposal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all proposals for a specific job
// @route   GET /api/proposals/job/:jobId
// @access  Private (Only Job Owner)
const getProposalsForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if logged in user is the owner of the job
        // Sirf client jisne job post ki hai wahi proposals dekh sakta hai
        if (job.client.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to see proposals for this job' });
        }

        // Fetch proposals and populate freelancer details
        const proposals = await Proposal.find({ job: jobId }).populate('freelancer', 'name email skills rating');
        res.json(proposals);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in freelancer's proposals
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer only)
const getMyProposals = async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers have their own proposals' });
        }

        // Find all proposals submitted by this freelancer
        const proposals = await Proposal.find({ freelancer: req.user.id }).populate('job', 'title status');
        res.json(proposals);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept a proposal
// @route   PUT /api/proposals/:id/accept
// @access  Private (Client only)
const acceptProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id).populate('job');

        if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

        // Check if the current user is the owner of the job
        if (proposal.job.client.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update proposal status
        // Proposal ko 'accepted' mark kar do
        proposal.status = 'accepted';
        await proposal.save();

        // Update Job status to 'in-progress'
        // Job status ko 'in-progress' kar do kyunki kaam start ho gaya
        const job = await Job.findById(proposal.job._id);
        job.status = 'in-progress';
        await job.save();

        // Optional: Reject all other proposals for this job
        // Baaki saare proposals ko 'rejected' mark kardo
        await Proposal.updateMany(
            { job: job._id, _id: { $ne: proposal._id } },
            { $set: { status: 'rejected' } }
        );

        res.json({ message: 'Proposal accepted', proposal });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject a proposal
// @route   PUT /api/proposals/:id/reject
// @access  Private (Client only)
const rejectProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id).populate('job');

        if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

        // Check if the current user is the owner of the job
        if (proposal.job.client.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        proposal.status = 'rejected';
        await proposal.save();

        res.json({ message: 'Proposal rejected', proposal });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitProposal,
    getProposalsForJob,
    getMyProposals,
    acceptProposal,
    rejectProposal
};
