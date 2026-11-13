require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Job = require('./models/Job');
const Proposal = require('./models/Proposal');
const Review = require('./models/Review');

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/freelance-app';
        console.log(`Connecting to database at ${uri}...`);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected for seeding.');

        // Clear existing data
        console.log('Clearing old collections...');
        await User.deleteMany({});
        await Job.deleteMany({});
        await Proposal.deleteMany({});
        await Review.deleteMany({});

        console.log('Hashing passwords...');
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const clientPass = await bcrypt.hash('client123', salt);
        const sarahPass = await bcrypt.hash('sarah123', salt);
        const freelancerPass = await bcrypt.hash('freelancer123', salt);
        const priyaPass = await bcrypt.hash('priya123', salt);
        const alexPass = await bcrypt.hash('alex123', salt);

        console.log('Creating demo users...');
        const adminUser = await User.create({
            name: 'Platform Administrator',
            email: 'admin@freelancehub.com',
            password: adminPass,
            role: 'admin',
            bio: 'System Administrator with full platform monitoring privileges.',
            location: 'New Delhi, India'
        });

        const client1 = await User.create({
            name: 'Vikram Malhotra',
            email: 'client@techcorp.com',
            password: clientPass,
            role: 'client',
            company: 'NexGen Tech Solutions Pvt Ltd',
            bio: 'Tech entrepreneur hiring seasoned engineers for enterprise software and web scale applications.',
            location: 'Bangalore, India',
            rating: 5.0,
            totalReviews: 2
        });

        const client2 = await User.create({
            name: 'Sarah Jenkins',
            email: 'sarah@designstudio.com',
            password: sarahPass,
            role: 'client',
            company: 'Studio Apex Creative Agency',
            bio: 'Creative Director looking for talented UI/UX designers, copywriters, and front-end developers.',
            location: 'San Francisco, CA, USA',
            rating: 4.9,
            totalReviews: 4
        });

        const freelancer1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul@dev.io',
            password: freelancerPass,
            role: 'freelancer',
            bio: 'Full-Stack MERN & Cloud Engineer. Experienced in building responsive web applications, secure REST APIs, and microservices.',
            skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS', 'TypeScript', 'Docker', 'REST API'],
            hourlyRate: 45,
            location: 'Bangalore, India',
            rating: 4.9,
            totalReviews: 14
        });

        const freelancer2 = await User.create({
            name: 'Priya Patel',
            email: 'priya@uiux.design',
            password: priyaPass,
            role: 'freelancer',
            bio: 'Senior UI/UX Designer & Design Systems Architect. Dedicated to accessible, user-centric web and mobile experiences.',
            skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping', 'User Research', 'TailwindCSS'],
            hourlyRate: 40,
            location: 'Mumbai, India',
            rating: 5.0,
            totalReviews: 9
        });

        const freelancer3 = await User.create({
            name: 'Alex Rivera',
            email: 'alex@writer.com',
            password: alexPass,
            role: 'freelancer',
            bio: 'Technical Writer & API Documentation Specialist. Passionate about translating complex engineering concepts into readable developer guides.',
            skills: ['Technical Writing', 'API Documentation', 'Markdown', 'GitBook', 'SEO Strategy', 'Content Writing'],
            hourlyRate: 35,
            location: 'Austin, TX, USA',
            rating: 4.8,
            totalReviews: 6
        });

        console.log('Creating demo jobs...');
        const job1 = await Job.create({
            client: client1._id,
            title: 'Full Stack MERN E-Commerce Platform with Stripe Checkout',
            description: 'We are developing a multi-vendor marketplace platform and need an experienced MERN stack engineer to build the frontend dashboard, cart synchronization, product review module, and Stripe payment gateway integration. The code must be cleanly structured with reusable components, proper error boundaries, and state management.',
            category: 'Web Development',
            skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS', 'Stripe'],
            budgetMin: 800,
            budgetMax: 1500,
            deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            status: 'open'
        });

        const job2 = await Job.create({
            client: client2._id,
            title: 'Figma UI/UX Redesign for B2B SaaS Analytics Dashboard',
            description: 'Looking for a talented product designer to completely revamp our existing analytics web platform. Deliverables include user research findings, interactive Figma component libraries, responsive desktop and tablet layouts, and handoff documentation for developers.',
            category: 'Design',
            skillsRequired: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping'],
            budgetMin: 500,
            budgetMax: 900,
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            status: 'in-progress'
        });

        const job3 = await Job.create({
            client: client1._id,
            title: 'Cross-Platform Mobile App for Food Delivery Tracking',
            description: 'Require a mobile app developer to build a real-time order tracking and rider dispatch application using React Native or Flutter. Should feature Google Maps live tracking, push notifications, and offline caching.',
            category: 'Mobile App',
            skillsRequired: ['React Native', 'Flutter', 'Firebase', 'Google Maps API', 'Mobile UI'],
            budgetMin: 1200,
            budgetMax: 2200,
            deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            status: 'open'
        });

        const job4 = await Job.create({
            client: client1._id,
            title: 'Developer Documentation & Interactive API Guides for FinTech Platform',
            description: 'Need a technical author to audit and document our RESTful payment APIs. The project includes writing curl examples, request/response payload schemas, authentication workflows, and webhook implementation guides.',
            category: 'Writing',
            skillsRequired: ['Technical Writing', 'API Documentation', 'Markdown', 'Postman'],
            budgetMin: 400,
            budgetMax: 750,
            deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'completed'
        });

        const job5 = await Job.create({
            client: client2._id,
            title: 'Modern Brand Identity & Landing Page Design for AI Startup',
            description: 'Create a distinctive brand style guide, color palette, logo assets, and modern conversion-focused landing page mockup for an upcoming generative AI productivity tool.',
            category: 'Design',
            skillsRequired: ['Graphic Design', 'Figma', 'Branding', 'Typography'],
            budgetMin: 350,
            budgetMax: 650,
            deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
            status: 'open'
        });

        console.log('Creating demo proposals...');
        // Proposal 1: Rahul on Job 1 (Pending)
        await Proposal.create({
            job: job1._id,
            freelancer: freelancer1._id,
            coverLetter: 'Hi Vikram, I have 4+ years of professional experience building MERN stack marketplaces. I have previously integrated Stripe Connect for multi-vendor checkout and can deliver high-performance React components with Tailwind CSS styling. Looking forward to discussing project milestones!',
            proposedBudget: 1200,
            deliveryDays: 14,
            status: 'pending'
        });

        // Proposal 2: Priya on Job 2 (Accepted)
        await Proposal.create({
            job: job2._id,
            freelancer: freelancer2._id,
            coverLetter: 'Hello Sarah, I specialize in B2B SaaS dashboards and comprehensive design systems. I will create clean typography hierarchies, dark/light theme tokens, and developer-ready Figma prototypes within 8 days.',
            proposedBudget: 750,
            deliveryDays: 8,
            status: 'accepted'
        });

        // Proposal 3: Alex on Job 4 (Accepted - Completed Job)
        await Proposal.create({
            job: job4._id,
            freelancer: freelancer3._id,
            coverLetter: 'Hi Vikram, I have extensive experience crafting developer-first API documentation for financial applications. I will structure clear quickstart guides, error code references, and ready-to-test Postman collections.',
            proposedBudget: 550,
            deliveryDays: 5,
            status: 'accepted'
        });

        console.log('Creating demo reviews...');
        // Review for completed job 4
        await Review.create({
            job: job4._id,
            reviewer: client1._id,
            reviewee: freelancer3._id,
            rating: 5,
            comment: 'Alex delivered top-tier developer documentation ahead of schedule. The API walkthroughs and request samples were crystal clear. Highly recommended!'
        });

        await Review.create({
            job: job4._id,
            reviewer: freelancer3._id,
            reviewee: client1._id,
            rating: 5,
            comment: 'Vikram was very clear with project specifications and prompt with feedback. Excellent client to work with!'
        });

        // Additional review for Priya
        await Review.create({
            job: job2._id,
            reviewer: client2._id,
            reviewee: freelancer2._id,
            rating: 5,
            comment: 'Priya is an exceptional designer. Her design system and user research exceeded all expectations. 10/10!'
        });

        console.log('\n======================================================');
        console.log('Demo Seed Data Successfully Populated!');
        console.log('======================================================');
        console.log('Test Accounts Available for Evaluation:');
        console.log('1. Admin:      admin@freelancehub.com   / admin123');
        console.log('2. Client:     client@techcorp.com      / client123');
        console.log('3. Client:     sarah@designstudio.com   / sarah123');
        console.log('4. Freelancer: rahul@dev.io             / freelancer123');
        console.log('5. Freelancer: priya@uiux.design        / priya123');
        console.log('6. Freelancer: alex@writer.com          / alex123');
        console.log('======================================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
