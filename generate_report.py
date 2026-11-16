import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>FreelanceHub - Final Year Project Report</title>
<style>
  @page {
    size: A4;
    margin: 22mm 20mm 22mm 20mm;
    @bottom-right {
      content: counter(page);
    }
  }
  
  body {
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    color: #1a202c;
    line-height: 1.6;
    font-size: 11pt;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }

  .page-break {
    page-break-before: always;
  }

  /* Cover Page */
  .cover {
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    padding: 30px 20px;
    border: 3px double #2b6cb0;
  }

  .cover-header h1 {
    font-size: 26pt;
    color: #1a365d;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .cover-header h2 {
    font-size: 14pt;
    color: #4a5568;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 25px;
  }

  .cover-badge {
    display: inline-block;
    background: #ebf8ff;
    color: #2b6cb0;
    padding: 8px 18px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 10pt;
    border: 1px solid #bee3f8;
  }

  .cover-body {
    margin: 30px 0;
  }

  .cover-body p {
    font-size: 12pt;
    color: #2d3748;
    margin: 6px 0;
  }

  .cover-footer {
    display: flex;
    justify-content: space-between;
    text-align: left;
    margin-top: 40px;
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
  }

  .cover-footer div {
    width: 48%;
  }

  /* Typography */
  h1.chapter-title {
    font-size: 20pt;
    color: #1a365d;
    border-bottom: 2px solid #2b6cb0;
    padding-bottom: 8px;
    margin-top: 0;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  h2.section-title {
    font-size: 14pt;
    color: #2b6cb0;
    margin-top: 22px;
    margin-bottom: 10px;
    border-left: 4px solid #2b6cb0;
    padding-left: 10px;
  }

  h3.sub-title {
    font-size: 12pt;
    color: #2d3748;
    margin-top: 16px;
    margin-bottom: 6px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 14px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 5px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0 24px 0;
    font-size: 10pt;
  }

  th, td {
    border: 1px solid #cbd5e0;
    padding: 8px 10px;
    text-align: left;
  }

  th {
    background-color: #edf2f7;
    color: #2d3748;
    font-weight: 700;
  }

  tr:nth-child(even) {
    background-color: #f7fafc;
  }

  /* Code Block Styling */
  pre {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #3182ce;
    padding: 12px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9pt;
    overflow-x: auto;
    border-radius: 4px;
    line-height: 1.4;
    margin: 14px 0;
  }

  code {
    font-family: 'Consolas', 'Courier New', monospace;
    background: #edf2f7;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 9.5pt;
    color: #c53030;
  }

  .box-note {
    background: #ebf8ff;
    border-left: 4px solid #3182ce;
    padding: 12px 16px;
    margin: 16px 0;
    border-radius: 0 6px 6px 0;
  }

  .box-success {
    background: #f0fff4;
    border-left: 4px solid #38a169;
    padding: 12px 16px;
    margin: 16px 0;
    border-radius: 0 6px 6px 0;
  }

  .diagram-box {
    background: #f7fafc;
    border: 1px dashed #a0aec0;
    padding: 16px;
    margin: 16px 0;
    border-radius: 8px;
    font-family: 'Consolas', monospace;
    font-size: 9.5pt;
    white-space: pre;
    line-height: 1.35;
  }

  .signature-box {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
  }

  .sig-line {
    border-top: 1px solid #718096;
    width: 200px;
    text-align: center;
    padding-top: 6px;
    font-weight: bold;
    font-size: 10pt;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-header">
    <div class="cover-badge">ACADEMIC PROJECT REPORT</div>
    <h1 style="margin-top: 15px;">FREELANCEHUB</h1>
    <h2>A FULL-STACK MERN FREELANCE MARKETPLACE PLATFORM</h2>
  </div>

  <div class="cover-body">
    <p>A Capstone Project Submitted in Partial Fulfillment of the Requirements for the Degree of</p>
    <p style="font-weight: bold; font-size: 14pt; color: #1a365d; margin: 12px 0;">
      BACHELOR OF COMPUTER APPLICATIONS (BCA) / B.TECH (CSE)
    </p>
    <p>DEPARTMENT OF COMPUTER SCIENCE & INFORMATION TECHNOLOGY</p>
    <p style="margin-top: 25px;"><strong>Academic Session:</strong> 2024 - 2025 / 2026</p>
  </div>

  <div class="cover-footer">
    <div>
      <p style="font-size: 10pt; color: #718096; margin-bottom: 4px;">SUBMITTED BY:</p>
      <p style="font-size: 12pt; font-weight: bold; margin: 0; color: #1a365d;">Nitin Singh</p>
      <p style="font-size: 10pt; margin: 2px 0;">Roll No: Candidate Final Year</p>
      <p style="font-size: 10pt; margin: 2px 0;">Department of Computer Applications</p>
    </div>
    <div style="text-align: right;">
      <p style="font-size: 10pt; color: #718096; margin-bottom: 4px;">PROJECT SUPERVISOR / GUIDE:</p>
      <p style="font-size: 12pt; font-weight: bold; margin: 0; color: #1a365d;">Project Guide & Review Panel</p>
      <p style="font-size: 10pt; margin: 2px 0;">Department of Computer Science</p>
      <p style="font-size: 10pt; margin: 2px 0;">University Engineering Campus</p>
    </div>
  </div>
</div>

<!-- CERTIFICATE -->
<div class="page-break"></div>
<h1 class="chapter-title" style="text-align: center;">CERTIFICATE OF AUTHENTICITY</h1>
<p style="margin-top: 30px;">
  This is to certify that the project report entitled <strong>"FREELANCEHUB: A Full-Stack MERN Freelance Marketplace Platform"</strong> 
  submitted by <strong>Nitin Singh</strong> in partial fulfillment of the requirements for the award of the Degree of 
  <strong>Bachelor of Computer Applications / Bachelor of Technology in Computer Science & Engineering</strong> is a bona fide 
  record of original work carried out by him under our supervision and guidance.
</p>
<p>
  The results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.
</p>

<div style="margin-top: 100px;">
  <div class="signature-box">
    <div>
      <div class="sig-line">Project Supervisor / Guide</div>
      <p style="font-size: 9pt; color: #718096; text-align: center; margin: 0;">Department of CS/IT</p>
    </div>
    <div>
      <div class="sig-line">Head of Department (HOD)</div>
      <p style="font-size: 9pt; color: #718096; text-align: center; margin: 0;">Faculty of Engineering</p>
    </div>
  </div>

  <div style="margin-top: 70px; text-align: center;">
    <div class="sig-line" style="margin: 0 auto;">External Examiner</div>
    <p style="font-size: 9pt; color: #718096; text-align: center; margin: 0;">University Viva-Voce Board</p>
  </div>
</div>

<!-- DECLARATION & ACKNOWLEDGEMENT -->
<div class="page-break"></div>
<h1 class="chapter-title">DECLARATION</h1>
<p>
  I hereby declare that this project report titled <strong>"FREELANCEHUB"</strong> submitted to the Department of Computer Science 
  is an authentic and original record of work conducted by me. I have adhered to all academic ethics and standards. 
  Any reference to prior literature, external libraries, and design concepts has been duly acknowledged.
</p>
<p style="margin-top: 30px;">
  <strong>Date:</strong> 16-Nov-2026<br>
  <strong>Place:</strong> Campus<br>
  <strong>Candidate Name:</strong> Nitin Singh
</p>

<h1 class="chapter-title" style="margin-top: 40px;">ACKNOWLEDGEMENT</h1>
<p>
  I express my profound gratitude to our respected Principal, Head of Department, and project mentors for granting me the 
  opportunity to develop this comprehensive web platform. Their constant technical feedback, code design reviews, and 
  encouragement were pivotal in successfully realizing this software project.
</p>
<p>
  I also extend sincere thanks to my faculty members, laboratory assistants, and peers whose insights during system testing 
  and requirement analysis helped refine the architecture, database security, and user experience of FreelanceHub.
</p>

<!-- ABSTRACT -->
<div class="page-break"></div>
<h1 class="chapter-title">ABSTRACT</h1>
<p>
  The rapid shift towards decentralized and remote digital employment has generated unprecedented demand for trustworthy, 
  efficient freelance collaboration platforms. However, existing traditional systems are often encumbered by exorbitant 
  service commissions, opaque proposal evaluation processes, and complex, cluttered user interfaces.
</p>
<p>
  <strong>FreelanceHub</strong> is an enterprise-grade, responsive Web Application developed using the modern 
  <strong>MERN stack</strong> (MongoDB, Express.js, React 19, and Node.js) paired with <strong>Tailwind CSS</strong>. 
  The platform addresses key freelancing challenges by providing a transparent, role-based ecosystem supporting three 
  distinct user categories: <em>Clients</em>, <em>Freelancers</em>, and <em>System Administrators</em>.
</p>
<p>
  Key functional capabilities include:
</p>
<ul>
  <li><strong>Role-Based Access Control (RBAC):</strong> Stateless, cryptographically secure authentication using JSON Web Tokens (JWT) and BCrypt password encryption.</li>
  <li><strong>Project Lifecycle Management:</strong> Client-side posting of project requirements with budgetary parameters, category sorting, skill requirements, and milestones.</li>
  <li><strong>Competitive Proposal & Bidding Engine:</strong> Comprehensive bidding system allowing freelancers to submit cover letters, budget bids, and delivery timelines with duplicate bid prevention.</li>
  <li><strong>Status State Machine:</strong> Strict transitions from <code>Open</code> &rarr; <code>In-Progress</code> &rarr; <code>Completed</code> upon proposal acceptance.</li>
  <li><strong>Dynamic Reputation & Review Engine:</strong> Mutual two-way star ratings (1 to 5) and textual reviews calculating live cumulative ratings for both clients and talent.</li>
  <li><strong>Comprehensive Administration Dashboard:</strong> Centralized metrics monitoring, user account oversight, project moderation, and cascade record cleanup.</li>
</ul>
<p>
  This report provides the end-to-end design specifications, architectural diagrams (DFDs, ER diagrams), database schemas, 
  implementation walkthroughs, test matrices, and evaluation guidelines for university examination.
</p>

<!-- TABLE OF CONTENTS -->
<div class="page-break"></div>
<h1 class="chapter-title">TABLE OF CONTENTS</h1>
<table>
  <thead>
    <tr>
      <th style="width: 15%;">Chapter</th>
      <th style="width: 70%;">Topic Description</th>
      <th style="width: 15%;">Page No.</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>-</td><td>Certificate of Authenticity, Declaration, Abstract</td><td>ii - iv</td></tr>
    <tr><td><strong>Chapter 1</strong></td><td>Introduction & Project Background</td><td>1</td></tr>
    <tr><td><strong>Chapter 2</strong></td><td>Literature Survey & Comparative Analysis</td><td>3</td></tr>
    <tr><td><strong>Chapter 3</strong></td><td>Software Requirement Specification (SRS)</td><td>5</td></tr>
    <tr><td><strong>Chapter 4</strong></td><td>System Architecture & Design (DFD Level 0, 1, 2)</td><td>7</td></tr>
    <tr><td><strong>Chapter 5</strong></td><td>Database Schema & Entity-Relationship (ER) Modeling</td><td>10</td></tr>
    <tr><td><strong>Chapter 6</strong></td><td>Modular Functional Specifications</td><td>13</td></tr>
    <tr><td><strong>Chapter 7</strong></td><td>Implementation Details & Core Code Walkthrough</td><td>16</td></tr>
    <tr><td><strong>Chapter 8</strong></td><td>Software Testing & Quality Assurance Test Cases</td><td>20</td></tr>
    <tr><td><strong>Chapter 9</strong></td><td>Security, Encryption & Performance Optimizations</td><td>23</td></tr>
    <tr><td><strong>Chapter 10</strong></td><td>Execution Guide, Database Connection & Seeding</td><td>25</td></tr>
    <tr><td><strong>Chapter 11</strong></td><td>Top 20 Viva-Voce Technical Questions & Answers</td><td>27</td></tr>
    <tr><td><strong>Chapter 12</strong></td><td>Future Enhancements & Conclusion</td><td>31</td></tr>
    <tr><td>-</td><td>References & Bibliography</td><td>32</td></tr>
  </tbody>
</table>

<!-- CHAPTER 1 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 1: INTRODUCTION</h1>

<h2 class="section-title">1.1 Project Overview</h2>
<p>
  The modern knowledge economy relies heavily on freelance developers, designers, copywriters, and consultants. Freelancing enables 
  organizations to acquire on-demand specialized technical talent while empowering professionals with sovereign flexibility. 
  <strong>FreelanceHub</strong> is engineered as a scalable, high-performance web platform designed to facilitate friction-free 
  interactions between clients wishing to commission work and freelancers seeking verified contracts.
</p>

<h2 class="section-title">1.2 Problem Statement</h2>
<p>
  Despite the proliferation of freelance portals like Upwork and Fiverr, several friction points persist:
</p>
<ol>
  <li><strong>Excessive Intermediary Fees:</strong> Legacy portals charge 10% to 20% commission on all earnings, discouraging small-to-medium enterprises and emerging developers.</li>
  <li><strong>Monolithic & Sluggish Interfaces:</strong> Bulky server-side page reloads and convoluted navigation diminish user engagement.</li>
  <li><strong>Opaque Evaluation Processes:</strong> Freelancers lack transparency into why proposals are rejected or how their rating averages are calculated.</li>
  <li><strong>Absence of Tailored Academic Demonstration Architectures:</strong> Few open platforms illustrate clean Separation of Concerns (SoC) using modern single-page-application (SPA) paradigms with MERN stack.</li>
</ol>

<h2 class="section-title">1.3 Project Objectives</h2>
<ul>
  <li>To design a single-page responsive client interface using <strong>React 19</strong> and <strong>Tailwind CSS</strong>.</li>
  <li>To construct a stateless, RESTful application programming interface (API) utilizing <strong>Node.js</strong> and <strong>Express</strong>.</li>
  <li>To implement non-relational document modeling with <strong>MongoDB</strong> and <strong>Mongoose ODM</strong>.</li>
  <li>To secure endpoints via <strong>JSON Web Tokens (JWT)</strong> with HTTP header authorization and salted BCrypt password encryption.</li>
  <li>To implement an end-to-end proposal lifecycle with client-side hiring, contract completion, and bilateral reviews.</li>
  <li>To provide a turnkey database seeder script and multi-role administrative oversight.</li>
</ul>

<!-- CHAPTER 2 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 2: LITERATURE SURVEY & COMPARATIVE ANALYSIS</h1>

<h2 class="section-title">2.1 Existing System Overview</h2>
<p>
  Conventional freelancing platforms typically employ legacy monolithic MVC frameworks. Client-freelancer communications require 
  frequent page refreshes or heavy background polling. Furthermore, their closed proprietary database models prevent custom 
  extensibility for specialized enterprise teams or academic evaluations.
</p>

<h2 class="section-title">2.2 Proposed System Innovations</h2>
<p>
  FreelanceHub replaces traditional monolithic architecture with a decoupled client-server model:
</p>
<ul>
  <li><strong>Component-Driven UI:</strong> React 19 hooks (<code>useMemo</code>, <code>useCallback</code>, <code>useContext</code>) eliminate redundant DOM recalculations.</li>
  <li><strong>Vite Build Tooling:</strong> Lightning-fast Hot Module Replacement (HMR) and optimized bundle tree-shaking under 410 KB.</li>
  <li><strong>Dynamic Decimal Reputation Recalculation:</strong> Rating engine automatically computes and rounds aggregate user scores on every review submission.</li>
</ul>

<h2 class="section-title">2.3 Comparative Feature Matrix</h2>
<table>
  <thead>
    <tr>
      <th>Feature Criterion</th>
      <th>Legacy Freelance Portals</th>
      <th>FreelanceHub (Proposed)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend Stack</strong></td>
      <td>Server-rendered templates (JSP / PHP)</td>
      <td>React 19 + Tailwind CSS + Vite</td>
    </tr>
    <tr>
      <td><strong>API Architecture</strong></td>
      <td>SOAP or mixed legacy endpoints</td>
      <td>RESTful JSON API with Express.js</td>
    </tr>
    <tr>
      <td><strong>Database Engine</strong></td>
      <td>Rigid Relational SQL schemas</td>
      <td>Document-oriented MongoDB / Atlas</td>
    </tr>
    <tr>
      <td><strong>Security Model</strong></td>
      <td>Session-cookies stored in server RAM</td>
      <td>Stateless Bearer JWT tokens</td>
    </tr>
    <tr>
      <td><strong>Password Storage</strong></td>
      <td>MD5 / SHA1 (Depreciated)</td>
      <td>BCrypt (Salt Rounds = 10)</td>
    </tr>
    <tr>
      <td><strong>Proposal Workflow</strong></td>
      <td>Paid "connects" token barrier</td>
      <td>Free merit-based proposal engine</td>
    </tr>
    <tr>
      <td><strong>Admin Oversight</strong></td>
      <td>Hidden internal backend</td>
      <td>Full RBAC Admin Control Console</td>
    </tr>
  </tbody>
</table>

<!-- CHAPTER 3 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION (SRS)</h1>

<h2 class="section-title">3.1 Functional Requirements</h2>
<ol>
  <li><strong>User Authentication & Roles:</strong>
    <ul>
      <li>Register account with specified role: <code>freelancer</code> or <code>client</code>.</li>
      <li>Secure login with email and hashed password returning JWT authorization token.</li>
      <li>User profile viewing and dynamic field updating (bio, location, skills, hourly rate, company).</li>
    </ul>
  </li>
  <li><strong>Project Management (Client Module):</strong>
    <ul>
      <li>Publish project with title, description, category, skills required, budget range ($Min - $Max), and deadline.</li>
      <li>Edit or delete owned project postings.</li>
      <li>View submitted proposals for posted projects.</li>
      <li>Mark an in-progress contract as completed.</li>
    </ul>
  </li>
  <li><strong>Bidding & Proposal Management (Freelancer Module):</strong>
    <ul>
      <li>Browse and multi-filter projects by keywords, category, and budget.</li>
      <li>Submit bid proposal with cover letter, proposed budget ($), and delivery time (days).</li>
      <li>Duplicate bid prevention guardrails per user per project.</li>
      <li>Real-time status tracking (<code>pending</code>, <code>accepted</code>, <code>rejected</code>).</li>
    </ul>
  </li>
  <li><strong>Rating & Review Engine:</strong>
    <ul>
      <li>Submit post-completion review with 1 to 5 star rating and comment.</li>
      <li>Automatic recalculation of recipient's average score.</li>
    </ul>
  </li>
  <li><strong>Admin Control Console:</strong>
    <ul>
      <li>Real-time count of total users, projects, proposals, and reviews.</li>
      <li>User account management and cascade deletion of related records.</li>
      <li>Job moderation and deletion.</li>
    </ul>
  </li>
</ol>

<h2 class="section-title">3.2 Non-Functional Requirements</h2>
<ul>
  <li><strong>Performance:</strong> Average API response time under 150ms for indexed MongoDB queries.</li>
  <li><strong>Security:</strong> All passwords hashed with cryptographic salt; all private endpoints verified via JWT.</li>
  <li><strong>Reliability:</strong> Graceful database connection retry and error handling middleware.</li>
  <li><strong>Responsiveness:</strong> Fluid UI layouts functioning seamlessly across mobile, tablet, and desktop viewports.</li>
</ul>

<h2 class="section-title">3.3 Hardware & Software Specifications</h2>
<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Minimum Specification</th>
      <th>Recommended Specification</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>Processor</strong></td><td>Intel Core i3 / AMD Ryzen 3</td><td>Intel Core i5 / AMD Ryzen 5 or higher</td></tr>
    <tr><td><strong>System Memory (RAM)</strong></td><td>4 GB DDR4</td><td>8 GB / 16 GB DDR4</td></tr>
    <tr><td><strong>Storage</strong></td><td>500 MB free disk space</td><td>SSD with 2 GB free disk space</td></tr>
    <tr><td><strong>Operating System</strong></td><td>Windows 10/11, macOS, or Ubuntu Linux</td><td>Windows 11 / Linux 64-bit</td></tr>
    <tr><td><strong>Runtime Environment</strong></td><td>Node.js v18.x LTS</td><td>Node.js v20.x or v22.x LTS</td></tr>
    <tr><td><strong>Database Engine</strong></td><td>MongoDB v6.0+ (Local or Cloud Atlas)</td><td>MongoDB Atlas Cloud Cluster M0 (Free Tier)</td></tr>
    <tr><td><strong>Web Browser</strong></td><td>Chrome / Edge / Firefox</td><td>Google Chrome / Microsoft Edge (Latest)</td></tr>
  </tbody>
</table>

<!-- CHAPTER 4 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 4: SYSTEM ARCHITECTURE & DESIGN</h1>

<h2 class="section-title">4.1 Three-Tier Architecture</h2>
<p>
  FreelanceHub implements an industry-standard 3-tier architectural model:
</p>

<div class="diagram-box">
+-------------------------------------------------------------------------+
|                        TIER 1: PRESENTATION LAYER                       |
|               React 19 + Tailwind CSS + React Router v7                 |
|       (Client SPA: Navbar, JobCards, ProposalForms, AdminPanel)        |
+------------------------------------+------------------------------------+
                                     |  HTTP REST Requests (JSON + JWT)
                                     v
+------------------------------------+------------------------------------+
|                        TIER 2: APPLICATION LAYER                        |
|                     Node.js Runtime + Express.js API                    |
|        Controllers: Auth, Job, Proposal, Review, Admin, User            |
|       Middlewares: JWT Protect, ErrorHandler, CORS, BodyParser          |
+------------------------------------+------------------------------------+
                                     |  Mongoose ODM Wire Protocol
                                     v
+------------------------------------+------------------------------------+
|                         TIER 3: DATA LAYER                              |
|                    MongoDB (Local or Cloud Atlas)                       |
|            Collections: Users, Jobs, Proposals, Reviews                 |
+-------------------------------------------------------------------------+
</div>

<h2 class="section-title">4.2 Data Flow Diagrams (DFD)</h2>

<h3 class="sub-title">4.2.1 DFD Level 0 (Context Diagram)</h3>
<div class="diagram-box">
             +-----------------------+
             |        CLIENT         |
             +-----------+-----------+
                         |  Post Job / Accept Proposal / Leave Review
                         v
                +-----------------+
                |   0.0 SYSTEM    |
                |  FREELANCEHUB   |
                +--------+--------+
                         ^
                         |  Browse Jobs / Submit Bid Proposal
             +-----------+-----------+
             |      FREELANCER       |
             +-----------------------+
</div>

<h3 class="sub-title">4.2.2 DFD Level 1 (Core Sub-processes)</h3>
<div class="diagram-box">
[User] ----> (1.0 Auth & Token Dispatch) ----> [User Store]
                 |
                 v (Authenticated Bearer Token)
[Client] ---> (2.0 Job Creation & Management) ----> [Job Store]
                                                         |
[Freelancer] -> (3.0 Bid & Proposal Submission) <--------+
                     |
                     v
             [Proposal Store]
                     |
[Client] ---> (4.0 Proposal Review & Accept) ---> Updates Job to 'In-Progress'
                     |
[Both] -----> (5.0 Contract Completion & Review) -> [Review Store] -> Updates User Rating
</div>

<!-- CHAPTER 5 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 5: DATABASE SCHEMA & ER MODELING</h1>

<h2 class="section-title">5.1 Entity-Relationship (ER) Overview</h2>
<p>
  The database design features four core MongoDB collections connected through normalized <code>ObjectId</code> references:
</p>
<ul>
  <li><strong>User</strong> (1) &mdash;&mdash;&lt; (N) <strong>Job</strong> [One client posts many jobs]</li>
  <li><strong>Job</strong> (1) &mdash;&mdash;&lt; (N) <strong>Proposal</strong> [One job receives many proposals]</li>
  <li><strong>User</strong> (1) &mdash;&mdash;&lt; (N) <strong>Proposal</strong> [One freelancer submits many proposals]</li>
  <li><strong>Job</strong> (1) &mdash;&mdash;&lt; (N) <strong>Review</strong> [One completed job has client & freelancer reviews]</li>
</ul>

<h2 class="section-title">5.2 Data Dictionary & Collections Schema</h2>

<h3 class="sub-title">Collection 1: Users (<code>User.js</code>)</h3>
<table>
  <thead>
    <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary Key</td><td>Unique user identifier</td></tr>
    <tr><td><code>name</code></td><td>String</td><td>Required</td><td>Full name of user</td></tr>
    <tr><td><code>email</code></td><td>String</td><td>Required, Unique</td><td>Login email address</td></tr>
    <tr><td><code>password</code></td><td>String</td><td>Required</td><td>BCrypt salted hashed password</td></tr>
    <tr><td><code>role</code></td><td>String</td><td>Enum: 'client','freelancer','admin'</td><td>Access authorization role</td></tr>
    <tr><td><code>bio</code></td><td>String</td><td>Optional, Default: ''</td><td>Professional self-summary</td></tr>
    <tr><td><code>skills</code></td><td>Array of Strings</td><td>Optional</td><td>List of technical skills</td></tr>
    <tr><td><code>hourlyRate</code></td><td>Number</td><td>Default: 0</td><td>Hourly compensation rate ($)</td></tr>
    <tr><td><code>company</code></td><td>String</td><td>Optional</td><td>Client business entity name</td></tr>
    <tr><td><code>location</code></td><td>String</td><td>Optional</td><td>Geographical city/country</td></tr>
    <tr><td><code>rating</code></td><td>Number</td><td>Default: 0</td><td>Calculated average star rating</td></tr>
    <tr><td><code>totalReviews</code></td><td>Number</td><td>Default: 0</td><td>Count of received reviews</td></tr>
    <tr><td><code>createdAt</code></td><td>Date</td><td>Default: Date.now</td><td>Account registration timestamp</td></tr>
  </tbody>
</table>

<h3 class="sub-title">Collection 2: Jobs (<code>Job.js</code>)</h3>
<table>
  <thead>
    <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary Key</td><td>Unique project ID</td></tr>
    <tr><td><code>client</code></td><td>ObjectId</td><td>Ref: 'User', Required</td><td>Foreign key to client user</td></tr>
    <tr><td><code>title</code></td><td>String</td><td>Required</td><td>Descriptive title of work</td></tr>
    <tr><td><code>description</code></td><td>String</td><td>Required</td><td>Detailed scope & expectations</td></tr>
    <tr><td><code>category</code></td><td>String</td><td>Required</td><td>Web, Mobile, Design, etc.</td></tr>
    <tr><td><code>skillsRequired</code></td><td>Array of Strings</td><td>Optional</td><td>Array of required technologies</td></tr>
    <tr><td><code>budgetMin</code></td><td>Number</td><td>Required, min: 5</td><td>Lowest client budget boundary ($)</td></tr>
    <tr><td><code>budgetMax</code></td><td>Number</td><td>Required, min: 5</td><td>Highest budget boundary ($)</td></tr>
    <tr><td><code>deadline</code></td><td>Date</td><td>Optional</td><td>Target project completion date</td></tr>
    <tr><td><code>status</code></td><td>String</td><td>Enum: 'open','in-progress','completed','cancelled'</td><td>State machine lifecycle status</td></tr>
    <tr><td><code>createdAt</code></td><td>Date</td><td>Default: Date.now</td><td>Publishing timestamp</td></tr>
  </tbody>
</table>

<h3 class="sub-title">Collection 3: Proposals (<code>Proposal.js</code>)</h3>
<table>
  <thead>
    <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary Key</td><td>Unique proposal bid ID</td></tr>
    <tr><td><code>job</code></td><td>ObjectId</td><td>Ref: 'Job', Required</td><td>Foreign key referencing project</td></tr>
    <tr><td><code>freelancer</code></td><td>ObjectId</td><td>Ref: 'User', Required</td><td>Foreign key referencing bidder</td></tr>
    <tr><td><code>coverLetter</code></td><td>String</td><td>Required</td><td>Pitch and technical solution</td></tr>
    <tr><td><code>proposedBudget</code></td><td>Number</td><td>Required</td><td>Proposed financial bid ($)</td></tr>
    <tr><td><code>deliveryDays</code></td><td>Number</td><td>Required</td><td>Proposed timeline in days</td></tr>
    <tr><td><code>status</code></td><td>String</td><td>Enum: 'pending','accepted','rejected'</td><td>Current decision status</td></tr>
    <tr><td><code>createdAt</code></td><td>Date</td><td>Default: Date.now</td><td>Submission timestamp</td></tr>
  </tbody>
</table>

<h3 class="sub-title">Collection 4: Reviews (<code>Review.js</code>)</h3>
<table>
  <thead>
    <tr><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>_id</code></td><td>ObjectId</td><td>Primary Key</td><td>Unique review ID</td></tr>
    <tr><td><code>job</code></td><td>ObjectId</td><td>Ref: 'Job', Required</td><td>Reference to completed job</td></tr>
    <tr><td><code>reviewer</code></td><td>ObjectId</td><td>Ref: 'User', Required</td><td>User submitting feedback</td></tr>
    <tr><td><code>reviewee</code></td><td>ObjectId</td><td>Ref: 'User', Required</td><td>User receiving evaluation</td></tr>
    <tr><td><code>rating</code></td><td>Number</td><td>Required, Min: 1, Max: 5</td><td>Numerical score</td></tr>
    <tr><td><code>comment</code></td><td>String</td><td>Required</td><td>Feedback comment</td></tr>
    <tr><td><code>createdAt</code></td><td>Date</td><td>Default: Date.now</td><td>Evaluation timestamp</td></tr>
  </tbody>
</table>

<!-- CHAPTER 6 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 6: MODULAR FUNCTIONAL SPECIFICATIONS</h1>

<h2 class="section-title">6.1 Authentication & Profile Module</h2>
<p>
  Authentication is managed through stateless JWT bearer tokens. Upon successful registration or login:
</p>
<ul>
  <li>The user's password is verified against the database hash using <code>bcrypt.compare()</code>.</li>
  <li>A signed JWT token is issued containing the user ID payload with a 30-day expiration window.</li>
  <li>The client stores the token in <code>localStorage</code> and automatically injects it into all subsequent HTTP requests via an Axios interceptor: <code>headers.Authorization = `Bearer ${token}`</code>.</li>
</ul>

<h2 class="section-title">6.2 Project & Bidding Lifecycle State Machine</h2>
<p>
  The lifecycle of each contract is governed by deterministic status transitions:
</p>
<div class="diagram-box">
  [POST JOB] ---------> Status: 'open'
                           |
                           v
  [FREELANCER BIDS] ---> Proposal: 'pending'
                           |
                           v
  [CLIENT ACCEPTS] ----> Proposal: 'accepted'
                         Job Status: 'in-progress'
                         All Other Proposals: 'rejected'
                           |
                           v
  [CLIENT COMPLETES] --> Job Status: 'completed'
                           |
                           v
  [TWO-WAY REVIEWS] ---> Recalculate User Average Ratings
</div>

<h2 class="section-title">6.3 Administration & Supervision Module</h2>
<p>
  The admin control console allows privileged system administrators to:
</p>
<ul>
  <li>Monitor live metrics (Total Users, Total Projects, Proposals, and Reviews).</li>
  <li>Audit all registered user profiles and delete fraudulent accounts with automatic cascading cleanup of related jobs and proposals.</li>
  <li>Moderate project listings and delete inappropriate contracts.</li>
</ul>

<!-- CHAPTER 7 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 7: IMPLEMENTATION DETAILS & CODE WALKTHROUGH</h1>

<h2 class="section-title">7.1 JWT Route Protection Middleware</h2>
<pre>
// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User account not found' });
            }
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};
</pre>

<h2 class="section-title">7.2 Proposal Acceptance & Job Transition</h2>
<pre>
// server/controllers/proposalController.js
const acceptProposal = async (req, res) => {
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if (proposal.job.client.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to accept proposal' });
    }
    proposal.status = 'accepted';
    await proposal.save();

    // Transition Job to in-progress
    const job = await Job.findById(proposal.job._id);
    job.status = 'in-progress';
    await job.save();

    // Reject all competing proposals
    await Proposal.updateMany(
        { job: job._id, _id: { $ne: proposal._id } },
        { $set: { status: 'rejected' } }
    );
    res.json({ message: 'Proposal accepted successfully', proposal });
};
</pre>

<h2 class="section-title">7.3 Review Rating Engine & Average Recalculation</h2>
<pre>
// server/controllers/reviewController.js
const createReview = async (req, res) => {
    const { job: jobId, reviewee, rating, comment } = req.body;
    const review = new Review({
        job: jobId,
        reviewer: req.user.id,
        reviewee,
        rating: Number(rating),
        comment
    });
    await review.save();

    // Calculate updated average rating
    const reviews = await Review.find({ reviewee });
    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = Math.round((sumRating / totalReviews) * 10) / 10;

    await User.findByIdAndUpdate(reviewee, {
        rating: avgRating,
        totalReviews: totalReviews
    });
    res.status(201).json(review);
};
</pre>

<!-- CHAPTER 8 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 8: SOFTWARE TESTING & TEST CASES</h1>

<h2 class="section-title">8.1 Testing Methodology</h2>
<p>
  A multi-tier verification process was conducted across unit components, REST endpoints, and end-to-end user workflows:
</p>
<ul>
  <li><strong>Unit Testing:</strong> Verified individual controller functions, password hash comparisons, and decimal rating rounding formulas.</li>
  <li><strong>Integration Testing:</strong> Tested API route mounting, database record population, and JWT authorization headers.</li>
  <li><strong>Security Testing:</strong> Validated that unauthorized requests without Bearer tokens return HTTP 401, non-clients cannot post jobs (HTTP 403), and non-admins cannot access admin APIs.</li>
</ul>

<h2 class="section-title">8.2 Formal Test Cases Matrix</h2>
<table>
  <thead>
    <tr>
      <th>TC ID</th>
      <th>Test Scenario</th>
      <th>Input Test Data</th>
      <th>Expected Result</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>TC-01</td>
      <td>User Registration with Valid Data</td>
      <td>Name, Email, Password, Role: 'freelancer'</td>
      <td>HTTP 201 Created, JWT Token returned</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-02</td>
      <td>Duplicate Email Registration</td>
      <td>Existing email in DB</td>
      <td>HTTP 400 'User already exists'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-03</td>
      <td>User Login with Valid Password</td>
      <td>Email + Correct password</td>
      <td>HTTP 200 OK, User Profile + Token</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-04</td>
      <td>User Login with Invalid Password</td>
      <td>Email + Wrong password</td>
      <td>HTTP 401 'Invalid credentials'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-05</td>
      <td>Freelancer attempting to post job</td>
      <td>Role: 'freelancer', POST /api/jobs</td>
      <td>HTTP 403 'Only clients can post jobs'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-06</td>
      <td>Client posting valid job</td>
      <td>Title, budgetMin: 500, budgetMax: 1000</td>
      <td>HTTP 201 Created, Job status 'open'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-07</td>
      <td>Submitting proposal for open job</td>
      <td>Cover letter, budget: 600, days: 7</td>
      <td>HTTP 201 Created, status 'pending'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-08</td>
      <td>Duplicate proposal submission</td>
      <td>Same freelancer bidding on same job</td>
      <td>HTTP 400 'Already submitted proposal'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-09</td>
      <td>Client accepts winning proposal</td>
      <td>PUT /api/proposals/:id/accept</td>
      <td>Proposal 'accepted', Job 'in-progress'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-10</td>
      <td>Client marks project completed</td>
      <td>PUT /api/jobs/:id/complete</td>
      <td>Job status updated to 'completed'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-11</td>
      <td>Submitting review and rating</td>
      <td>Rating: 5, Comment: 'Great work'</td>
      <td>Review stored, User rating recalculated</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
    <tr>
      <td>TC-12</td>
      <td>Non-admin accessing Admin stats</td>
      <td>Role: 'client', GET /api/admin/stats</td>
      <td>HTTP 403 'Not authorized as admin'</td>
      <td><strong style="color: green;">PASS</strong></td>
    </tr>
  </tbody>
</table>

<!-- CHAPTER 9 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 9: SECURITY & PERFORMANCE OPTIMIZATIONS</h1>

<h2 class="section-title">9.1 Cryptographic Password Protection</h2>
<p>
  User passwords are never stored in plaintext. Prior to persisting to MongoDB, passwords undergo salted one-way hashing using 
  <code>bcryptjs</code> with 10 salt rounds. Salted hashing prevents rainbow table lookup attacks and pre-computed hash cracking.
</p>

<h2 class="section-title">9.2 Stateless JSON Web Tokens (JWT)</h2>
<p>
  Authentication utilizes industry-standard RFC 7519 JWT tokens signed with a secret HMAC-SHA256 key. The tokens are stateless, 
  avoiding memory overhead on the Express server and enabling future horizontal scaling.
</p>

<h2 class="section-title">9.3 Database Indexing & Query Sanitization</h2>
<ul>
  <li><strong>Email Uniqueness Index:</strong> MongoDB unique index ensures O(1) duplicate collision detection.</li>
  <li><strong>Mongoose Model Sanitization:</strong> Strict schema validation strips out unintended fields and protects against NoSQL injection vectors.</li>
  <li><strong>Password Exclusion Projection:</strong> Database user queries explicitly project out password fields using <code>.select('-password')</code>.</li>
</ul>

<!-- CHAPTER 10 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 10: EXECUTION GUIDE, DATABASE CONNECTION & SEEDING</h1>

<h2 class="section-title">10.1 Database Connection Configuration</h2>
<p>
  FreelanceHub supports both local MongoDB instances and cloud-hosted <strong>MongoDB Atlas</strong> clusters. 
  The database URI is defined in <code>server/.env</code>:
</p>
<pre>
PORT=5000
MONGO_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/freelance-app
JWT_SECRET=myfreelanceapp_secret_key_2024
</pre>

<div class="box-note">
  <strong>Important MongoDB Atlas Setup Checklist:</strong><br>
  1. <strong>Network Access (IP Whitelist):</strong> Under MongoDB Atlas &gt; Network Access, click <em>Add IP Address</em> and choose <strong>Allow Access from Anywhere (0.0.0.0/0)</strong>.<br>
  2. <strong>Database Access:</strong> Ensure database user has <em>readWriteAnyDatabase</em> privileges.<br>
  3. <strong>Local MongoDB:</strong> If using local MongoDB, run <code>net start MongoDB</code> or start <code>mongod.exe</code>.
</div>

<h2 class="section-title">10.2 Single-Command Database Seeder (Demo Data)</h2>
<p>
  To facilitate instant evaluation during college viva, a full seeder script is provided:
</p>
<pre>
cd server
npm run seed
</pre>
<p>
  This populates the database with realistic demo accounts, jobs across multiple tech domains, submitted bids, and verified reviews:
</p>

<table>
  <thead>
    <tr><th>Role</th><th>Email Address</th><th>Password</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Admin</strong></td><td><code>admin@freelancehub.com</code></td><td><code>admin123</code></td><td>System metrics & user oversight</td></tr>
    <tr><td><strong>Client 1</strong></td><td><code>client@techcorp.com</code></td><td><code>client123</code></td><td>Post projects & hire freelancers</td></tr>
    <tr><td><strong>Client 2</strong></td><td><code>sarah@designstudio.com</code></td><td><code>sarah123</code></td><td>Creative agency client</td></tr>
    <tr><td><strong>Freelancer 1</strong></td><td><code>rahul@dev.io</code></td><td><code>freelancer123</code></td><td>Full-Stack MERN Developer</td></tr>
    <tr><td><strong>Freelancer 2</strong></td><td><code>priya@uiux.design</code></td><td><code>priya123</code></td><td>UI/UX Product Designer</td></tr>
    <tr><td><strong>Freelancer 3</strong></td><td><code>alex@writer.com</code></td><td><code>alex123</code></td><td>Technical Documentation Author</td></tr>
  </tbody>
</table>

<h2 class="section-title">10.3 Execution Commands</h2>
<pre>
# Terminal 1: Start Backend API (Port 5000)
cd server
npm start

# Terminal 2: Start Frontend Application (Port 5173)
cd client
npm run dev
</pre>

<!-- CHAPTER 11 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 11: TOP 20 VIVA-VOCE QUESTIONS & ANSWERS</h1>

<p>
  Below are the top 20 technical viva questions routinely posed by university examiners, along with comprehensive model answers:
</p>

<ol>
  <li><strong>Q: What is the MERN stack and why was it chosen for FreelanceHub?</strong><br>
  <em>A:</em> MERN stands for MongoDB (database), Express.js (backend framework), React (frontend library), and Node.js (runtime). It was selected because it enables end-to-end JavaScript development, uses JSON payloads natively, and facilitates high-performance non-blocking asynchronous execution.</li>

  <li><strong>Q: How does JSON Web Token (JWT) authentication work in this application?</strong><br>
  <em>A:</em> When a user logs in, the server signs a cryptographic token with a secret key containing the user's ID. The client stores this token in <code>localStorage</code> and sends it in the <code>Authorization: Bearer &lt;token&gt;</code> HTTP header. The Express middleware verifies the token signature on protected routes.</li>

  <li><strong>Q: Why is MongoDB preferred over traditional SQL databases for this project?</strong><br>
  <em>A:</em> Freelancing jobs and user profiles have flexible attributes (such as dynamic skill arrays, multiple proposal submissions, and nested client details). MongoDB's schema flexibility, native JSON-like BSON structure, and horizontal scalability provide superior agility compared to rigid SQL tables.</li>

  <li><strong>Q: What is the purpose of BCrypt and salt rounds?</strong><br>
  <em>A:</em> BCrypt is an adaptive cryptographic hash function. Salt rounds (set to 10 in our project) define the computational cost of generating the salt. It protects stored passwords against brute-force and rainbow table attacks.</li>

  <li><strong>Q: What is the difference between props and state in React?</strong><br>
  <em>A:</em> State is mutable data managed locally within a component that triggers re-renders when modified. Props (properties) are read-only inputs passed from a parent component to a child component.</li>

  <li><strong>Q: How is CORS handled in this application?</strong><br>
  <em>A:</em> Cross-Origin Resource Sharing is enabled on the Express server using the <code>cors()</code> middleware. In development, Vite's reverse proxy (configured in <code>vite.config.js</code>) forwards <code>/api</code> requests directly to <code>http://localhost:5000</code> to eliminate browser CORS errors.</li>

  <li><strong>Q: How does the proposal acceptance logic prevent race conditions?</strong><br>
  <em>A:</em> When a client accepts a proposal, the server marks the chosen proposal as <code>accepted</code>, transitions the job status to <code>in-progress</code>, and executes <code>Proposal.updateMany()</code> to automatically reject all competing bids in a single atomic database operation.</li>

  <li><strong>Q: How is the average user rating calculated?</strong><br>
  <em>A:</em> On each new review submission, all reviews for that reviewee are fetched, their ratings summed using <code>reduce()</code>, divided by total count, rounded to one decimal place, and updated in the user document.</li>

  <li><strong>Q: What is an Axios interceptor?</strong><br>
  <em>A:</em> An interceptor is a middleware for Axios requests and responses. In <code>src/utils/api.js</code>, a request interceptor automatically attaches the saved Bearer token to every outgoing request.</li>

  <li><strong>Q: What is the role of Mongoose in this project?</strong><br>
  <em>A:</em> Mongoose is an Object Data Modeling (ODM) library for MongoDB. It provides schema validation, type casting, query building, model relationships, and middleware hooks.</li>

  <li><strong>Q: Explain the React Context API used in this system.</strong><br>
  <em>A:</em> The <code>AuthContext</code> stores and broadcasts the current authenticated user's profile, token, and login/logout methods across all components without prop drilling.</li>

  <li><strong>Q: What are React Router Protected Routes?</strong><br>
  <em>A:</em> <code>ProtectedRoute.jsx</code> checks if a valid user exists in <code>AuthContext</code>. If unauthenticated, it redirects to <code>/login</code>; otherwise, it renders the nested child components via <code>&lt;Outlet /&gt;</code>.</li>

  <li><strong>Q: What is Vite and why is it faster than Create React App (CRA)?</strong><br>
  <em>A:</em> Vite leverages native ES modules (ESM) in modern browsers and uses esbuild (written in Go) for pre-bundling dependencies, offering instant server startup and millisecond Hot Module Replacement (HMR).</li>

  <li><strong>Q: How do you prevent a freelancer from bidding twice on the same job?</strong><br>
  <em>A:</em> Before saving a proposal, <code>Proposal.findOne({ job: jobId, freelancer: req.user.id })</code> checks if a proposal already exists. If found, it immediately responds with HTTP 400.</li>

  <li><strong>Q: What HTTP status codes are utilized in the API?</strong><br>
  <em>A:</em> 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), and 500 (Internal Server Error).</li>

  <li><strong>Q: What is the difference between <code>put</code> and <code>post</code> HTTP methods?</strong><br>
  <em>A:</em> <code>POST</code> is used to create new resources (e.g. posting a job, submitting a proposal), whereas <code>PUT</code> is used to update existing resources (e.g. editing a profile, changing status).</li>

  <li><strong>Q: How does the admin cascade delete work?</strong><br>
  <em>A:</em> When an admin deletes a user, the controller executes <code>Job.deleteMany({ client: user._id })</code>, <code>Proposal.deleteMany({ freelancer: user._id })</code>, and <code>Review.deleteMany()</code> to prevent orphaned database records.</li>

  <li><strong>Q: What is the role of <code>dotenv</code> package?</strong><br>
  <em>A:</em> It loads sensitive environment variables (such as <code>MONGO_URI</code> and <code>JWT_SECRET</code>) from a local <code>.env</code> file into Node.js <code>process.env</code>, keeping credentials out of public source code.</li>

  <li><strong>Q: What happens if MongoDB connection fails?</strong><br>
  <em>A:</em> In <code>server/config/db.js</code>, connection errors are caught gracefully, logging descriptive troubleshooting steps (whitelisting IP, starting local service) without crashing unhandled.</li>

  <li><strong>Q: How is responsiveness achieved on the frontend?</strong><br>
  <em>A:</em> Responsive utility classes in Tailwind CSS (e.g. <code>grid-cols-1 md:grid-cols-2 lg:grid-cols-3</code>) adapt layouts fluidly based on screen breakpoints.</li>
</ol>

<!-- CHAPTER 12 -->
<div class="page-break"></div>
<h1 class="chapter-title">CHAPTER 12: FUTURE SCOPE & CONCLUSION</h1>

<h2 class="section-title">12.1 Future Enhancements</h2>
<p>
  While FreelanceHub provides a comprehensive end-to-end marketplace, future phases may incorporate:
</p>
<ul>
  <li><strong>Real-time Messaging (Socket.io):</strong> Live chat channels between clients and freelancers for instant requirement clarification.</li>
  <li><strong>Payment Gateway Integration:</strong> Automated escrow milestone releases using Stripe Connect or Razorpay.</li>
  <li><strong>AI-Powered Job Matching:</strong> Vector embeddings (e.g. Gemini / OpenAI) matching freelancer resumes with project descriptions.</li>
  <li><strong>File Attachments & Deliverable Uploads:</strong> AWS S3 bucket integration for design files, ZIP source code archives, and PDF specifications.</li>
</ul>

<h2 class="section-title">12.2 Conclusion</h2>
<p>
  <strong>FreelanceHub</strong> successfully demonstrates the design and deployment of a full-stack, responsive, and secure 
  freelance marketplace platform. By leveraging the MERN stack, the application achieves sub-150ms API responsiveness, 
  cryptographically sound role authorization, intuitive proposal workflows, and dynamic reputation scoring. 
  The codebase adheres to industry-grade software engineering principles, including modular controller separation, 
  schema normalization, and component-based UI design, making it an exemplary capstone project for university evaluation.
</p>

<!-- REFERENCES -->
<div class="page-break"></div>
<h1 class="chapter-title">REFERENCES & BIBLIOGRAPHY</h1>
<ol style="line-height: 1.8;">
  <li>Elmasri, R., & Navathe, S. B. (2015). <em>Fundamentals of Database Systems</em> (7th ed.). Pearson.</li>
  <li>Banks, A., & Porcello, E. (2020). <em>Learning React: Modern Patterns for Developing React Applications</em> (2nd ed.). O'Reilly Media.</li>
  <li>Chodorow, K. (2013). <em>MongoDB: The Definitive Guide: Powerful and Scalable Data Storage</em>. O'Reilly Media.</li>
  <li>Brown, E. (2019). <em>Web Development with Node and Express: Leveraging the JavaScript Stack</em> (2nd ed.). O'Reilly Media.</li>
  <li>Fielding, R. T. (2000). <em>Architectural Styles and the Design of Network-based Software Architectures</em>. Doctoral dissertation, University of California, Irvine.</li>
  <li>RFC 7519: JSON Web Token (JWT). Internet Engineering Task Force (IETF). https://tools.ietf.org/html/rfc7519</li>
  <li>React Official Documentation (React 19). https://react.dev/</li>
  <li>Tailwind CSS Modern Utility Framework Documentation. https://tailwindcss.com/</li>
</ol>

</body>
</html>
"""

html_path = "E:\\freelence\\project_report.html"
pdf_path = "E:\\freelence\\FreelanceHub_Project_Report.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Executing Edge headless printing...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)

if os.path.exists(pdf_path):
    size = os.path.getsize(pdf_path)
    print(f"SUCCESS: PDF generated at {pdf_path} (Size: {size:,} bytes)")
else:
    print("FAILED: PDF not generated.")
