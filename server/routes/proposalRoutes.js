const express = require('express');
const router = express.Router();
const { 
    submitProposal, 
    getProposalsForJob, 
    getMyProposals, 
    acceptProposal, 
    rejectProposal,
    updateProposalStatus
} = require('../controllers/proposalController');
const { protect } = require('../middleware/auth');

// Proposal se related saare routes

// POST /api/proposals -> Submit proposal (needs login)
router.post('/', protect, submitProposal);

// GET /api/proposals/my-proposals -> Freelancer's proposals
router.get('/my-proposals', protect, getMyProposals);

// GET /api/proposals/job/:jobId -> Client sees proposals for a job
router.get('/job/:jobId', protect, getProposalsForJob);

// PUT /api/proposals/:id/status -> Unified status updater (accept / reject)
router.put('/:id/status', protect, updateProposalStatus);

// PUT /api/proposals/:id/accept -> Client accepts proposal
router.put('/:id/accept', protect, acceptProposal);

// PUT /api/proposals/:id/reject -> Client rejects proposal
router.put('/:id/reject', protect, rejectProposal);

module.exports = router;
