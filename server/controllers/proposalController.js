const Proposal = require('../models/Proposal');
const Job = require('../models/Job');

// @desc    Submit a proposal for a job
// @route   POST /api/proposals
// @access  Private (Freelancer only)
const submitProposal = async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can submit proposals' });
        }

        const jobId = req.body.job || req.body.jobId;
        const proposedBudget = req.body.proposedBudget !== undefined ? req.body.proposedBudget : req.body.budget;
        const { coverLetter, deliveryDays } = req.body;

        if (!jobId || !coverLetter || proposedBudget === undefined || deliveryDays === undefined) {
            return res.status(400).json({ message: 'Please provide all proposal fields' });
        }

        // Check if job exists and is open
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status !== 'open') return res.status(400).json({ message: 'This job is no longer accepting proposals' });

        // Check if user already submitted a proposal for this job
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
            proposedBudget: Number(proposedBudget),
            deliveryDays: Number(deliveryDays)
        });

        const createdProposal = await proposal.save();
        res.status(201).json(createdProposal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all proposals for a specific job
// @route   GET /api/proposals/job/:jobId
// @access  Private (Only Job Owner or Admin)
const getProposalsForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to see proposals for this job' });
        }

        // Fetch proposals and populate freelancer details
        const proposals = await Proposal.find({ job: jobId })
            .populate('freelancer', 'name email skills hourlyRate rating totalReviews avatar bio location')
            .sort({ createdAt: -1 });

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
        if (req.user.role !== 'freelancer' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only freelancers can view submitted proposals' });
        }

        // Find all proposals submitted by this freelancer
        const proposals = await Proposal.find({ freelancer: req.user.id })
            .populate({
                path: 'job',
                select: 'title status budgetMin budgetMax category client deadline',
                populate: { path: 'client', select: 'name company avatar' }
            })
            .sort({ createdAt: -1 });

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

        if (proposal.job.client.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to accept this proposal' });
        }

        proposal.status = 'accepted';
        await proposal.save();

        // Update Job status to 'in-progress'
        const job = await Job.findById(proposal.job._id);
        job.status = 'in-progress';
        await job.save();

        // Reject other proposals for this job
        await Proposal.updateMany(
            { job: job._id, _id: { $ne: proposal._id } },
            { $set: { status: 'rejected' } }
        );

        res.json({ message: 'Proposal accepted successfully', proposal });

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

        if (proposal.job.client.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to reject this proposal' });
        }

        proposal.status = 'rejected';
        await proposal.save();

        res.json({ message: 'Proposal rejected', proposal });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update proposal status (Unified endpoint for frontend compatibility)
// @route   PUT /api/proposals/:id/status
// @access  Private (Client only)
const updateProposalStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (status === 'accepted') {
            return acceptProposal(req, res);
        } else if (status === 'rejected') {
            return rejectProposal(req, res);
        } else {
            return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitProposal,
    getProposalsForJob,
    getMyProposals,
    acceptProposal,
    rejectProposal,
    updateProposalStatus
};
