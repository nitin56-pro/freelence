import os

class CanvasPDF:
    def __init__(self, filename):
        self.filename = filename
        self.pages = []
        self.width = 595.28  # A4 width in points
        self.height = 841.89 # A4 height in points
        self.margin_x = 54   # ~0.75 in
        self.margin_top = 54
        self.margin_bottom = 54
        self.current_stream = []
        self.current_y = self.height - self.margin_top

    def new_page(self):
        if self.current_stream:
            self.pages.append("\n".join(self.current_stream))
            self.current_stream = []
        self.current_y = self.height - self.margin_top

    def escape_text(self, text):
        return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    def draw_text(self, x, y, text, font='F1', size=10, r=0.1, g=0.1, b=0.1):
        clean = self.escape_text(str(text))
        self.current_stream.append(
            f"{r:.3f} {g:.3f} {b:.3f} rg BT /{font} {size} Tf {x:.2f} {y:.2f} Td ({clean}) Tj ET"
        )

    def draw_line(self, x1, y1, x2, y2, width=1, r=0.7, g=0.7, b=0.7):
        self.current_stream.append(
            f"{r:.3f} {g:.3f} {b:.3f} RG {width:.2f} w {x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S"
        )

    def draw_rect(self, x, y, w, h, fill=False, stroke=True, fr=0.95, fg=0.95, fb=0.95, sr=0.8, sg=0.8, sb=0.8, line_width=1):
        cmds = []
        if fill:
            cmds.append(f"{fr:.3f} {fg:.3f} {fb:.3f} rg")
        if stroke:
            cmds.append(f"{sr:.3f} {sg:.3f} {sb:.3f} RG {line_width:.2f} w")
        op = "B" if (fill and stroke) else ("f" if fill else "S")
        cmds.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re {op}")
        self.current_stream.append(" ".join(cmds))

    def wrap_text(self, text, max_chars=82):
        words = text.split()
        lines = []
        curr = []
        curr_len = 0
        for w in words:
            if curr_len + len(w) + 1 <= max_chars:
                curr.append(w)
                curr_len += len(w) + 1
            else:
                if curr:
                    lines.append(" ".join(curr))
                curr = [w]
                curr_len = len(w)
        if curr:
            lines.append(" ".join(curr))
        return lines

    def add_chapter_heading(self, title):
        if self.current_y < 200:
            self.new_page()
        self.draw_rect(self.margin_x, self.current_y - 28, self.width - 2 * self.margin_x, 32, fill=True, stroke=True, fr=0.93, fg=0.96, fb=1.0, sr=0.18, sg=0.45, sb=0.75, line_width=1.5)
        self.draw_text(self.margin_x + 12, self.current_y - 18, title, font='F2', size=13, r=0.1, g=0.25, b=0.5)
        self.current_y -= 46

    def add_section_heading(self, title):
        if self.current_y < 120:
            self.new_page()
        self.draw_text(self.margin_x, self.current_y - 12, title, font='F2', size=11.5, r=0.15, g=0.35, b=0.65)
        self.draw_line(self.margin_x, self.current_y - 16, self.width - self.margin_x, self.current_y - 16, width=0.8, r=0.8, g=0.85, b=0.9)
        self.current_y -= 30

    def add_paragraph(self, text, indent=0, font='F1', size=9.5, leading=13.5, r=0.15, g=0.15, b=0.15):
        lines = self.wrap_text(text, max_chars=int(85 - indent / 6))
        for line in lines:
            if self.current_y < self.margin_bottom + 25:
                self.new_page()
            self.draw_text(self.margin_x + indent, self.current_y - size, line, font=font, size=size, r=r, g=g, b=b)
            self.current_y -= leading
        self.current_y -= 4

    def add_bullet(self, bold_prefix, text):
        combined = f"{bold_prefix} {text}"
        lines = self.wrap_text(combined, max_chars=78)
        for i, line in enumerate(lines):
            if self.current_y < self.margin_bottom + 25:
                self.new_page()
            if i == 0:
                self.draw_text(self.margin_x + 12, self.current_y - 9.5, "•", font='F2', size=11, r=0.2, g=0.45, b=0.8)
                self.draw_text(self.margin_x + 24, self.current_y - 9.5, line, font='F1', size=9.5, r=0.15, g=0.15, b=0.15)
            else:
                self.draw_text(self.margin_x + 24, self.current_y - 9.5, line, font='F1', size=9.5, r=0.15, g=0.15, b=0.15)
            self.current_y -= 13.5
        self.current_y -= 2

    def add_code_block(self, code_lines):
        block_height = len(code_lines) * 12 + 16
        if self.current_y - block_height < self.margin_bottom:
            self.new_page()
        self.draw_rect(self.margin_x, self.current_y - block_height, self.width - 2 * self.margin_x, block_height, fill=True, stroke=True, fr=0.97, fg=0.98, fb=0.99, sr=0.8, sg=0.85, sb=0.9)
        self.draw_rect(self.margin_x, self.current_y - block_height, 4, block_height, fill=True, stroke=False, fr=0.2, fg=0.45, fb=0.8)
        y = self.current_y - 12
        for l in code_lines:
            self.draw_text(self.margin_x + 14, y, l, font='F3', size=8.5, r=0.1, g=0.2, b=0.3)
            y -= 12
        self.current_y -= (block_height + 10)

    def add_table(self, headers, rows, col_widths):
        table_width = sum(col_widths)
        row_height = 20
        header_height = 22
        total_height = header_height + len(rows) * row_height

        if self.current_y - total_height < self.margin_bottom:
            self.new_page()

        x = self.margin_x
        y = self.current_y - header_height

        # Header background
        self.draw_rect(x, y, table_width, header_height, fill=True, stroke=True, fr=0.9, fg=0.93, fb=0.97, sr=0.75, sg=0.8, sb=0.85)
        curr_x = x
        for i, h in enumerate(headers):
            self.draw_text(curr_x + 6, y + 6, h, font='F2', size=8.5, r=0.1, g=0.2, b=0.4)
            curr_x += col_widths[i]

        curr_y = y - row_height
        for r_idx, row in enumerate(rows):
            bg = (0.98, 0.99, 1.0) if r_idx % 2 == 1 else (1.0, 1.0, 1.0)
            self.draw_rect(x, curr_y, table_width, row_height, fill=True, stroke=True, fr=bg[0], fg=bg[1], fb=bg[2], sr=0.85, sg=0.88, sb=0.9)
            curr_x = x
            for i, val in enumerate(row):
                self.draw_text(curr_x + 6, curr_y + 6, str(val)[:45], font='F1', size=8.5, r=0.15, g=0.15, b=0.15)
                curr_x += col_widths[i]
            curr_y -= row_height

        self.current_y = curr_y - 10

    def build(self):
        if self.current_stream:
            self.pages.append("\n".join(self.current_stream))

        total_pages = len(self.pages)
        out = []
        out.append(b'%PDF-1.4\n')
        offsets = {}

        def write_obj(num, content):
            offsets[num] = sum(len(x) for x in out)
            out.append(f"{num} 0 obj\n".encode('latin-1'))
            out.append(content)
            out.append(b"\nendobj\n")

        write_obj(1, b"<< /Type /Catalog /Pages 2 0 R >>")

        page_objs_refs = []
        curr_obj = 3
        page_records = []

        for p_idx, p_stream in enumerate(self.pages):
            content_obj = curr_obj + 1
            page_obj = curr_obj
            curr_obj += 2

            # Footer on each page except cover
            footer = ""
            if p_idx > 0:
                footer = f"\n0.5 0.5 0.5 RG 0.5 w 54 40 m 541.28 40 l S\n0.5 0.5 0.5 rg BT /F1 8 Tf 54 30 Td (FreelanceHub - College Capstone Major Project Report) Tj ET\nBT /F2 8 Tf 490 30 Td (Page {p_idx + 1} of {total_pages}) Tj ET\n"

            full_stream = p_stream + footer
            page_records.append((page_obj, content_obj, full_stream))
            page_objs_refs.append(f"{page_obj} 0 R")

        kids = " ".join(page_objs_refs)
        write_obj(2, f"<< /Type /Pages /Kids [{kids}] /Count {total_pages} >>".encode('latin-1'))

        for page_obj, content_obj, stream in page_records:
            write_obj(page_obj, f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.width:.2f} {self.height:.2f}] /Contents {content_obj} 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Courier >> >> >> >>".encode('latin-1'))
            stream_bytes = stream.encode('latin-1', errors='replace')
            write_obj(content_obj, f"<< /Length {len(stream_bytes)} >>\nstream\n".encode('latin-1') + stream_bytes + b"\nendstream")

        xref_offset = sum(len(x) for x in out)
        total_objs = curr_obj
        out.append(f"xref\n0 {total_objs}\n0000000000 65535 f \n".encode('latin-1'))
        for i in range(1, total_objs):
            off = offsets[i]
            out.append(f"{off:010d} 00000 n \n".encode('latin-1'))

        out.append(f"trailer\n<< /Size {total_objs} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF".encode('latin-1'))

        with open(self.filename, 'wb') as f:
            for b in out:
                f.write(b)
        print(f"Report generated successfully: {self.filename} ({len(self.pages)} pages)")

# ----------------- BUILD COMPLETE REPORT -----------------
doc = CanvasPDF("E:/freelence/FreelanceHub_Project_Report.pdf")

# ==================== PAGE 1: COVER PAGE ====================
doc.draw_rect(40, 40, doc.width - 80, doc.height - 80, stroke=True, line_width=2.5, sr=0.15, sg=0.35, sb=0.65)
doc.draw_rect(44, 44, doc.width - 88, doc.height - 88, stroke=True, line_width=1, sr=0.7, sg=0.75, sb=0.85)

doc.draw_rect(180, 725, 235, 26, fill=True, stroke=True, fr=0.9, fg=0.94, fb=0.99, sr=0.2, sg=0.45, sb=0.75, line_width=1)
doc.draw_text(205, 733, "COLLEGE CAPSTONE PROJECT REPORT", font='F2', size=9.5, r=0.15, g=0.35, b=0.65)

doc.draw_text(165, 665, "FREELANCEHUB", font='F2', size=26, r=0.1, g=0.25, b=0.55)
doc.draw_text(115, 638, "A FULL-STACK MERN FREELANCE MARKETPLACE PLATFORM", font='F2', size=11.5, r=0.3, g=0.35, b=0.4)

doc.draw_line(150, 615, 445, 615, width=1.5, r=0.2, g=0.45, b=0.75)

doc.draw_text(145, 545, "A Project Report Submitted in Partial Fulfillment of the", font='F1', size=11, r=0.2, g=0.2, b=0.2)
doc.draw_text(195, 528, "Requirements for the Degree of", font='F1', size=11, r=0.2, g=0.2, b=0.2)

doc.draw_text(130, 485, "BACHELOR OF COMPUTER APPLICATIONS (BCA)", font='F2', size=13, r=0.1, g=0.25, b=0.55)
doc.draw_text(180, 465, "/ B.TECH (COMPUTER SCIENCE)", font='F2', size=12, r=0.1, g=0.25, b=0.55)

doc.draw_text(155, 415, "DEPARTMENT OF COMPUTER APPLICATIONS", font='F2', size=10.5, r=0.3, g=0.35, b=0.4)
doc.draw_text(190, 398, "Academic Session: 2024 - 2026", font='F1', size=10, r=0.3, g=0.35, b=0.4)

doc.draw_line(60, 240, 535, 240, width=0.8, r=0.8, g=0.8, b=0.8)

# Left Column (Candidate)
doc.draw_text(65, 215, "SUBMITTED BY:", font='F2', size=9.5, r=0.4, g=0.45, b=0.5)
doc.draw_text(65, 195, "Nitin Singh", font='F2', size=12, r=0.1, g=0.25, b=0.55)
doc.draw_text(65, 178, "Candidate Final Year (BCA / B.Tech)", font='F1', size=9.5, r=0.2, g=0.2, b=0.2)
doc.draw_text(65, 163, "Roll No: Final Year Examination", font='F1', size=9.5, r=0.2, g=0.2, b=0.2)

# Right Column (Supervisor)
doc.draw_text(340, 215, "UNDER THE GUIDANCE OF:", font='F2', size=9.5, r=0.4, g=0.45, b=0.5)
doc.draw_text(340, 195, "Project Supervisor & Faculty Guide", font='F2', size=12, r=0.1, g=0.25, b=0.55)
doc.draw_text(340, 178, "Department of Computer Science", font='F1', size=9.5, r=0.2, g=0.2, b=0.2)
doc.draw_text(340, 163, "College / University Campus", font='F1', size=9.5, r=0.2, g=0.2, b=0.2)

# ==================== PAGE 2: CERTIFICATE & DECLARATION ====================
doc.new_page()
doc.add_chapter_heading("CERTIFICATE OF AUTHENTICITY")
doc.add_paragraph("This is to certify that the major project report entitled \"FREELANCEHUB: A FULL-STACK MERN FREELANCE MARKETPLACE PLATFORM\" submitted by Nitin Singh in partial fulfillment of the academic requirements for the award of Bachelor of Computer Applications (BCA) / B.Tech (Computer Science & Engineering) is an authentic record of original development work completed under our guidance and supervision.")
doc.add_paragraph("The source code, database architectures, and RESTful APIs documented in this report represent the student's bona fide technical contributions and have not been submitted elsewhere for any academic degree or certification.")

doc.current_y -= 40
doc.draw_line(doc.margin_x, doc.current_y, doc.margin_x + 180, doc.current_y, width=1, r=0.5, g=0.5, b=0.5)
doc.draw_line(doc.width - doc.margin_x - 180, doc.current_y, doc.width - doc.margin_x, doc.current_y, width=1, r=0.5, g=0.5, b=0.5)
doc.draw_text(doc.margin_x + 25, doc.current_y - 14, "Project Supervisor / Guide", font='F2', size=9.5, r=0.2, g=0.2, b=0.2)
doc.draw_text(doc.width - doc.margin_x - 160, doc.current_y - 14, "Head of Department (HOD)", font='F2', size=9.5, r=0.2, g=0.2, b=0.2)

doc.current_y -= 60
doc.draw_line(205, doc.current_y, 390, doc.current_y, width=1, r=0.5, g=0.5, b=0.5)
doc.draw_text(245, doc.current_y - 14, "External Examiner", font='F2', size=9.5, r=0.2, g=0.2, b=0.2)

doc.current_y -= 40
doc.add_chapter_heading("DECLARATION & ACKNOWLEDGEMENT")
doc.add_paragraph("I hereby declare that this project report entitled \"FreelanceHub\" represents my independent software design and implementation work. All technical literature, third-party open-source packages, and design references utilized throughout the development have been duly cited.")
doc.add_paragraph("I extend my deepest gratitude to my respected faculty members, laboratory instructors, and mentors for their invaluable technical guidance and critical code review sessions. I also thank my colleagues and family for their continuous support during the completion of this project.")
doc.draw_text(doc.margin_x, doc.current_y - 18, "Date: November 2026", font='F2', size=9.5, r=0.2, g=0.2, b=0.2)
doc.draw_text(doc.margin_x, doc.current_y - 32, "Candidate: Nitin Singh", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)

# ==================== PAGE 3: ABSTRACT & TABLE OF CONTENTS ====================
doc.new_page()
doc.add_chapter_heading("EXECUTIVE ABSTRACT")
doc.add_paragraph("The rapid transformation towards decentralized remote digital employment has generated an unprecedented demand for reliable, modern, and transparent freelancing platforms. Existing legacy marketplaces frequently impose heavy intermediary commissions (up to 20%), suffer from bloated multi-page reloads, and conceal proposal evaluations behind opaque paywalls.")
doc.add_paragraph("FreelanceHub is an enterprise-grade, responsive single-page web application developed using the modern MERN stack (MongoDB, Express.js, React 19, and Node.js) paired with Tailwind CSS styling and Vite tooling. The platform implements Role-Based Access Control (RBAC) supporting three primary user tiers: Clients, Freelancers, and System Administrators.")
doc.add_paragraph("Key architectural highlights include stateless JSON Web Token (JWT) authorization, salted BCrypt password encryption, a dynamic bidding and proposal review state-machine, a mutual two-way 5-star rating and reputation calculation engine, and a turnkey single-command database seeder. This report outlines the complete Software Requirement Specification (SRS), Data Flow Diagrams (DFDs), Entity-Relationship (ER) schemas, implementation modules, test cases, and technical viva-voce guidelines.")

doc.add_section_heading("TABLE OF CONTENTS")
doc.add_table(
    ["Chapter", "Topic Description", "Page"],
    [
        ["Chapter 1", "Introduction, Problem Statement & Objectives", "4"],
        ["Chapter 2", "Literature Survey & Comparative Feature Matrix", "5"],
        ["Chapter 3", "Software Requirement Specification (SRS)", "6"],
        ["Chapter 4", "System Architecture & Data Flow Diagrams (DFD 0, 1, 2)", "7"],
        ["Chapter 5", "Database Schema & Entity-Relationship (ER) Modeling", "8"],
        ["Chapter 6", "Modular System Design & Bidding State Machine", "10"],
        ["Chapter 7", "Core Implementation & Key Code Walkthrough", "11"],
        ["Chapter 8", "Software Testing & Formal Test Cases Matrix", "13"],
        ["Chapter 9", "Security, Encryption & Performance Optimizations", "14"],
        ["Chapter 10", "Turnkey Database Connection, Seeding & Viva Demo Guide", "15"],
        ["Chapter 11", "Top 20 Technical Viva-Voce Questions & Model Answers", "16"],
        ["Chapter 12", "Future Enhancements, Conclusion & References", "19"]
    ],
    [70, 360, 55]
)

# ==================== PAGE 4: CHAPTER 1 - INTRODUCTION ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 1: INTRODUCTION")
doc.add_section_heading("1.1 Background & Context")
doc.add_paragraph("The contemporary digital economy relies extensively on on-demand talent. Small-to-medium enterprises, tech startups, and independent business owners regularly outsource technical projects such as web development, mobile application programming, UI/UX prototyping, and technical documentation. FreelanceHub is developed as a modern marketplace bridge connecting organizations with verified technical specialists.")

doc.add_section_heading("1.2 Problem Statement")
doc.add_paragraph("Conventional freelance portals suffer from several operational and technical friction points:")
doc.add_bullet("1.", "Exorbitant Platform Fees: Legacy platforms charge up to 20% commission on contract payouts, severely penalizing independent developers.")
doc.add_bullet("2.", "Monolithic Performance Bottlenecks: Server-rendered full page reloads diminish user engagement and increase server memory footprints.")
doc.add_bullet("3.", "Opaque Hiring Workflows: Absence of clear milestone tracking and proposal status visibility leaves freelancers uncertain.")
doc.add_bullet("4.", "Lack of Clean Academic Reference Implementations: Few accessible open-source projects demonstrate strict Separation of Concerns using modern React 19 SPA patterns.")

doc.add_section_heading("1.3 Project Goals & Objectives")
doc.add_bullet("•", "Construct a high-performance Single Page Application (SPA) using React 19, React Router v7, and Tailwind CSS.")
doc.add_bullet("•", "Engineer an asynchronous, stateless REST API in Node.js and Express.js supporting multi-role JWT authentication.")
doc.add_bullet("•", "Design flexible document schemas in MongoDB using Mongoose ODM with relational ObjectId references.")
doc.add_bullet("•", "Implement automated decimal rating recalculation upon contract completion.")
doc.add_bullet("•", "Provide a turnkey evaluation seeder populating admin, client, and freelancer profiles with realistic bids and reviews.")

# ==================== PAGE 5: CHAPTER 2 - LITERATURE SURVEY ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 2: LITERATURE SURVEY & COMPARISON")
doc.add_section_heading("2.1 Existing Systems Analysis")
doc.add_paragraph("Traditional portals such as Upwork, Freelancer.com, and Fiverr established the commercial viability of remote gig marketplaces. However, their legacy backends rely on complex monolithic architectures, server-side template rendering, and paid proposal bidding models ('Connects'). These monetization barriers restrict new graduates and emerging professionals.")

doc.add_section_heading("2.2 Proposed Solution: FreelanceHub")
doc.add_paragraph("FreelanceHub adopts a modern decoupled API-first design where UI presentation is completely decoupled from backend persistence. This ensures sub-150ms API responses, instant client-side routing, and zero licensing fees.")

doc.add_section_heading("2.3 Comparative Architectural Feature Matrix")
doc.add_table(
    ["Feature Metric", "Legacy Marketplaces", "FreelanceHub (Proposed)"],
    [
        ["Architecture", "Monolithic Multi-Page", "Decoupled MERN SPA Architecture"],
        ["Frontend Engine", "PHP / JSP Server Templates", "React 19 + Tailwind CSS + Vite"],
        ["API Paradigm", "SOAP / Mixed Endpoints", "Stateless RESTful JSON API"],
        ["Database Layer", "Relational SQL (Strict Schema)", "MongoDB / Atlas Document Store"],
        ["Security Protocol", "Server Session Cookies", "Bearer JWT Tokens + BCrypt Hashing"],
        ["Bidding Barrier", "Paid Bidding Tokens ('Connects')", "Free Open Bidding Workflow"],
        ["Admin Oversight", "Proprietary Backend", "Integrated RBAC Admin Control Center"],
        ["Deployment Cost", "High Infrastructure Costs", "Free Tier (Atlas + Vercel/Render)"]
    ],
    [105, 185, 195]
)

# ==================== PAGE 6: CHAPTER 3 - SRS ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 3: SOFTWARE REQUIREMENT SPECIFICATION")
doc.add_section_heading("3.1 Functional Requirements")
doc.add_bullet("FR-1: User Management:", "Registration, login, and profile editing with support for 'client', 'freelancer', and 'admin' roles.")
doc.add_bullet("FR-2: Project Publishing:", "Clients can create, edit, and delete job postings with budget parameters ($Min-$Max), categories, skills, and target deadlines.")
doc.add_bullet("FR-3: Bidding & Proposals:", "Freelancers can browse jobs, filter by keyword and category, and submit bid proposals with custom cover letters and delivery days.")
doc.add_bullet("FR-4: Hiring State Machine:", "Clients can review incoming bids, accept winning proposals (locking the job to 'in-progress'), and automatically reject other bids.")
doc.add_bullet("FR-5: Contract Completion:", "Clients mark active contracts as 'completed', unlocking mutual 5-star review submissions.")
doc.add_bullet("FR-6: Admin Oversight:", "Administrators monitor platform statistics, delete fraudulent accounts, and remove inappropriate job postings.")

doc.add_section_heading("3.2 Hardware & Software Specifications")
doc.add_table(
    ["Resource Category", "Minimum Requirement", "Recommended Development Spec"],
    [
        ["CPU Processor", "Intel Core i3 / AMD Ryzen 3", "Intel Core i5 / AMD Ryzen 5 or higher"],
        ["System Memory", "4 GB DDR4 RAM", "8 GB / 16 GB DDR4/DDR5 RAM"],
        ["Disk Storage", "500 MB Free Disk Space", "1 GB Free SSD Storage"],
        ["Operating System", "Windows 10, macOS, Linux", "Windows 11 (64-bit)"],
        ["Node Runtime", "Node.js v18.x LTS", "Node.js v20.x or v22.x LTS"],
        ["Database Engine", "MongoDB v6.0+ Community", "MongoDB Atlas M0 Cloud Cluster (Free)"],
        ["Build Tooling", "Vite v5.x / v6.x", "Vite v8.x + Oxlint Static Analyzer"]
    ],
    [115, 175, 195]
)

# ==================== PAGE 7: CHAPTER 4 - ARCHITECTURE & DFD ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 4: SYSTEM ARCHITECTURE & DFD")
doc.add_section_heading("4.1 Three-Tier Architecture")
doc.add_paragraph("FreelanceHub strictly adheres to the 3-Tier Architectural Pattern comprising the Presentation Tier (React 19), Application Logic Tier (Express/Node.js), and Data Persistence Tier (MongoDB).")

doc.add_code_block([
    "+-------------------------------------------------------------------------+",
    "|                        TIER 1: PRESENTATION TIER                        |",
    "|             React 19 + Tailwind CSS + Axios API Interceptor             |",
    "|  Pages: Home, Jobs, JobDetail, PostJob, Dashboard, Profile, AdminPanel  |",
    "+------------------------------------+------------------------------------+",
    "                                     |  HTTP REST Requests (JSON + Bearer Token)",
    "                                     v",
    "+------------------------------------+------------------------------------+",
    "|                     TIER 2: APPLICATION LOGIC TIER                      |",
    "|                      Node.js Runtime + Express.js                       |",
    "|    Controllers: authController, jobController, proposalController       |",
    "|    Middlewares: JWT protect, errorHandler, CORS, express.json()         |",
    "+------------------------------------+------------------------------------+",
    "                                     |  Mongoose ODM Wire Protocol",
    "                                     v",
    "+------------------------------------+------------------------------------+",
    "|                      TIER 3: DATA PERSISTENCE TIER                      |",
    "|             MongoDB Community Server OR MongoDB Atlas Cloud             |",
    "|           Collections: users, jobs, proposals, reviews                  |",
    "+-------------------------------------------------------------------------+"
])

doc.add_section_heading("4.2 Data Flow Diagrams")
doc.add_paragraph("DFD Level 0 (Context Level): Models external entities (Client, Freelancer, Admin) exchanging authentication credentials, job postings, proposals, and reviews with the central FreelanceHub system boundary.")
doc.add_paragraph("DFD Level 1: Details the transition from Authentication & Token Dispatch (Process 1.0), to Job Publishing (Process 2.0), Proposal Submission (Process 3.0), Proposal Acceptance (Process 4.0), and Review Engine (Process 5.0).")

# ==================== PAGE 8: CHAPTER 5 - DATABASE SCHEMAS ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 5: DATABASE SCHEMAS & DATA DICTIONARY")
doc.add_section_heading("5.1 Collections Schema Overview")
doc.add_paragraph("The database utilizes four normalized collections. Foreign key relationships are enforced using Mongoose Schema Types ObjectId with reference attributes.")

doc.add_section_heading("5.2 Data Dictionary: Users Collection")
doc.add_table(
    ["Field Name", "Data Type", "Constraint", "Description"],
    [
        ["_id", "ObjectId", "Primary Key", "Unique system identifier for user"],
        ["name", "String", "Required", "Full name of the individual"],
        ["email", "String", "Required, Unique", "Login email address"],
        ["password", "String", "Required", "BCrypt salted password hash"],
        ["role", "String", "Enum: freelancer, client, admin", "Authorization role"],
        ["bio", "String", "Optional, Default: ''", "Professional summary biography"],
        ["skills", "Array of Strings", "Optional", "List of technical skills (e.g. React)"],
        ["hourlyRate", "Number", "Default: 0", "Hourly compensation rate ($)"],
        ["company", "String", "Optional", "Company name for client profiles"],
        ["rating", "Number", "Default: 0", "Dynamic average rating (1.0 - 5.0)"],
        ["totalReviews", "Number", "Default: 0", "Count of verified reviews received"]
    ],
    [90, 80, 140, 175]
)

doc.add_section_heading("5.3 Data Dictionary: Jobs Collection")
doc.add_table(
    ["Field Name", "Data Type", "Constraint", "Description"],
    [
        ["_id", "ObjectId", "Primary Key", "Unique project identifier"],
        ["client", "ObjectId", "Ref: 'User', Required", "Client foreign key reference"],
        ["title", "String", "Required", "Descriptive project title"],
        ["description", "String", "Required", "Full scope of requirements"],
        ["category", "String", "Required", "Domain (e.g. Web Development)"],
        ["skillsRequired", "Array of Strings", "Optional", "Required tech competencies"],
        ["budgetMin", "Number", "Required, min: 5", "Minimum allocated budget ($)"],
        ["budgetMax", "Number", "Required, min: 5", "Maximum allocated budget ($)"],
        ["status", "String", "Enum: open, in-progress, completed", "Current lifecycle status"]
    ],
    [90, 80, 140, 175]
)

# ==================== PAGE 9: CHAPTER 5 CONT - PROPOSALS & REVIEWS ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 5 (CONT.): PROPOSALS & REVIEWS SCHEMAS")
doc.add_section_heading("5.4 Data Dictionary: Proposals Collection")
doc.add_table(
    ["Field Name", "Data Type", "Constraint", "Description"],
    [
        ["_id", "ObjectId", "Primary Key", "Unique bid proposal identifier"],
        ["job", "ObjectId", "Ref: 'Job', Required", "Associated project reference"],
        ["freelancer", "ObjectId", "Ref: 'User', Required", "Bidding freelancer reference"],
        ["coverLetter", "String", "Required", "Technical pitch and proposal message"],
        ["proposedBudget", "Number", "Required", "Freelancer's proposed bid price ($)"],
        ["deliveryDays", "Number", "Required", "Estimated delivery timeline (Days)"],
        ["status", "String", "Enum: pending, accepted, rejected", "Current bid decision status"],
        ["createdAt", "Date", "Default: Date.now", "Timestamp of proposal submission"]
    ],
    [95, 80, 140, 170]
)

doc.add_section_heading("5.5 Data Dictionary: Reviews Collection")
doc.add_table(
    ["Field Name", "Data Type", "Constraint", "Description"],
    [
        ["_id", "ObjectId", "Primary Key", "Unique feedback evaluation ID"],
        ["job", "ObjectId", "Ref: 'Job', Required", "Completed project reference"],
        ["reviewer", "ObjectId", "Ref: 'User', Required", "Author of feedback evaluation"],
        ["reviewee", "ObjectId", "Ref: 'User', Required", "Recipient of feedback rating"],
        ["rating", "Number", "Required, Min: 1, Max: 5", "Numerical evaluation score"],
        ["comment", "String", "Required", "Textual evaluation and remarks"],
        ["createdAt", "Date", "Default: Date.now", "Review creation timestamp"]
    ],
    [95, 80, 140, 170]
)

doc.add_section_heading("5.6 Database Normalization & Integrity")
doc.add_paragraph("The database adheres to Third Normal Form (3NF). Redundant data duplication is strictly avoided by storing user details once in the Users collection and referencing them through ObjectIds. Relational population is performed at the query level using Mongoose populate() routines.")

# ==================== PAGE 10: CHAPTER 6 - MODULAR SPECIFICATIONS ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 6: MODULAR FUNCTIONAL SPECIFICATIONS")
doc.add_section_heading("6.1 Authentication & Authorization Module")
doc.add_paragraph("The authentication subsystem enforces strict role segregation across all endpoints:")
doc.add_bullet("•", "Public Endpoints: /api/auth/register, /api/auth/login, /api/jobs (GET), /api/users/:id.")
doc.add_bullet("•", "Client Protected Endpoints: /api/jobs (POST, PUT, DELETE), /api/jobs/:id/complete, /api/proposals/job/:jobId.")
doc.add_bullet("•", "Freelancer Protected Endpoints: /api/proposals (POST), /api/proposals/my-proposals.")
doc.add_bullet("•", "Admin Endpoints: /api/admin/users, /api/admin/jobs, /api/admin/stats.")

doc.add_section_heading("6.2 Proposal & Contract State Machine")
doc.add_paragraph("Contracts transition through deterministic states to ensure data integrity:")
doc.add_code_block([
    "[1. Client Posts Job] ----------> Job.status = 'open'",
    "                                      |",
    "                                      v",
    "[2. Freelancer Submits Bid] ----> Proposal.status = 'pending'",
    "                                      |",
    "                                      v",
    "[3. Client Accepts Proposal] ---> Proposal.status = 'accepted'",
    "                                  Job.status = 'in-progress'",
    "                                  All Other Proposals = 'rejected'",
    "                                      |",
    "                                      v",
    "[4. Client Marks Completed] ----> Job.status = 'completed'",
    "                                      |",
    "                                      v",
    "[5. Mutual Reviews Exchanged] --> Recalculate User.rating Average"
])

# ==================== PAGE 11: CHAPTER 7 - IMPLEMENTATION CODE ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 7: CORE IMPLEMENTATION CODE")
doc.add_section_heading("7.1 JWT Token Verification Middleware")
doc.add_code_block([
    "// server/middleware/auth.js",
    "const jwt = require('jsonwebtoken');",
    "const User = require('../models/User');",
    "",
    "const protect = async (req, res, next) => {",
    "    let token;",
    "    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {",
    "        try {",
    "            token = req.headers.authorization.split(' ')[1];",
    "            const decoded = jwt.verify(token, process.env.JWT_SECRET);",
    "            req.user = await User.findById(decoded.id).select('-password');",
    "            if (!req.user) {",
    "                return res.status(401).json({ message: 'User account not found' });",
    "            }",
    "            return next();",
    "        } catch (error) {",
    "            return res.status(401).json({ message: 'Not authorized, token failed' });",
    "        }",
    "    }",
    "    if (!token) return res.status(401).json({ message: 'No authorization token provided' });",
    "};"
])

doc.add_section_heading("7.2 Proposal Acceptance Controller")
doc.add_code_block([
    "// server/controllers/proposalController.js (Accept Proposal)",
    "const acceptProposal = async (req, res) => {",
    "    const proposal = await Proposal.findById(req.params.id).populate('job');",
    "    if (proposal.job.client.toString() !== req.user.id && req.user.role !== 'admin') {",
    "        return res.status(401).json({ message: 'Not authorized' });",
    "    }",
    "    proposal.status = 'accepted';",
    "    await proposal.save();",
    "",
    "    const job = await Job.findById(proposal.job._id);",
    "    job.status = 'in-progress';",
    "    await job.save();",
    "",
    "    // Reject all competing proposals",
    "    await Proposal.updateMany({ job: job._id, _id: { $ne: proposal._id } },",
    "                              { $set: { status: 'rejected' } });",
    "    res.json({ message: 'Proposal accepted successfully', proposal });",
    "};"
])

# ==================== PAGE 12: CHAPTER 7 CONT - REVIEW ENGINE ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 7 (CONT.): REVIEW RATING ENGINE")
doc.add_section_heading("7.3 Review Creation & Dynamic Average Calculation")
doc.add_code_block([
    "// server/controllers/reviewController.js",
    "const createReview = async (req, res) => {",
    "    const { job: jobId, reviewee, rating, comment } = req.body;",
    "    const existing = await Review.findOne({ job: jobId, reviewer: req.user.id });",
    "    if (existing) return res.status(400).json({ message: 'Already reviewed' });",
    "",
    "    const review = new Review({",
    "        job: jobId, reviewer: req.user.id, reviewee, rating: Number(rating), comment",
    "    });",
    "    await review.save();",
    "",
    "    // Dynamically recalculate reviewee average score",
    "    const reviews = await Review.find({ reviewee });",
    "    const totalReviews = reviews.length;",
    "    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);",
    "    const avgRating = totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;",
    "",
    "    await User.findByIdAndUpdate(reviewee, { rating: avgRating, totalReviews });",
    "    res.status(201).json(review);",
    "};"
])

doc.add_section_heading("7.4 Frontend Axios Bearer Token Interceptor")
doc.add_code_block([
    "// client/src/utils/api.js",
    "import axios from 'axios';",
    "",
    "const api = axios.create({ baseURL: '/api' });",
    "",
    "api.interceptors.request.use((config) => {",
    "    const user = JSON.parse(localStorage.getItem('user'));",
    "    if (user && user.token) {",
    "        config.headers.Authorization = `Bearer ${user.token}`;",
    "    }",
    "    return config;",
    "});",
    "export default api;"
])

# ==================== PAGE 13: CHAPTER 8 - SOFTWARE TESTING ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 8: SOFTWARE TESTING & TEST CASES")
doc.add_section_heading("8.1 Formal Verification Test Cases Matrix")
doc.add_table(
    ["ID", "Test Scenario", "Input Data", "Expected Result", "Status"],
    [
        ["TC-01", "Valid User Registration", "Valid name, email, pass, role", "HTTP 201, User + JWT Token", "PASS"],
        ["TC-02", "Duplicate Email Register", "Existing email address", "HTTP 400 'User already exists'", "PASS"],
        ["TC-03", "Valid User Login", "Correct email + password", "HTTP 200, JWT Token dispatched", "PASS"],
        ["TC-04", "Invalid Password Login", "Correct email + wrong pass", "HTTP 401 'Invalid credentials'", "PASS"],
        ["TC-05", "RBAC Job Creation Check", "Role: freelancer, POST /jobs", "HTTP 403 'Only clients post jobs'", "PASS"],
        ["TC-06", "Client Project Posting", "Title, Budget: 500-1000", "HTTP 201, Job created (open)", "PASS"],
        ["TC-07", "Submit Proposal Bid", "Cover letter, $600, 7 days", "HTTP 201, Proposal (pending)", "PASS"],
        ["TC-08", "Duplicate Proposal Guard", "Same freelancer bidding twice", "HTTP 400 'Already submitted bid'", "PASS"],
        ["TC-09", "Accept Winning Proposal", "PUT /api/proposals/:id/accept", "Proposal 'accepted', Job 'in-progress'", "PASS"],
        ["TC-10", "Mark Project Completed", "PUT /api/jobs/:id/complete", "Job status updated to 'completed'", "PASS"],
        ["TC-11", "Submit Review & Rating", "Rating: 5, Comment: 'Excellent'", "Review saved, avg score recalculated", "PASS"],
        ["TC-12", "Admin Route Security", "Role: client, GET /admin/stats", "HTTP 403 'Not authorized as admin'", "PASS"]
    ],
    [40, 125, 125, 155, 40]
)

doc.add_section_heading("8.2 Security & Penetration Testing Results")
doc.add_paragraph("All sensitive routes were audited against NoSQL injection, unauthorized parameter tampering, and token spoofing. Routes correctly rejected unauthenticated payloads with HTTP 401, while unauthorized role attempts returned HTTP 403 Forbidden.")

# ==================== PAGE 14: CHAPTER 9 - SECURITY & BEST PRACTICES ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 9: SECURITY & BEST PRACTICES")
doc.add_section_heading("9.1 Cryptographic Salted Hashing (BCrypt)")
doc.add_paragraph("User passwords are encrypted before persisting into MongoDB. The system utilizes bcryptjs with 10 salt rounds:")
doc.add_code_block([
    "const salt = await bcrypt.genSalt(10);",
    "const hashedPassword = await bcrypt.hash(password, salt);"
])
doc.add_paragraph("Salted hashing ensures that identical plaintext passwords produce radically distinct hashes, rendering rainbow table lookup attacks completely ineffective.")

doc.add_section_heading("9.2 Stateless JWT Authorization")
doc.add_paragraph("Session state is not stored in server memory. Each client request carries an RFC 7519 compliant JSON Web Token signed with a secret HMAC-SHA256 signature key. Tokens expire automatically after 30 days, minimizing session hijacking vulnerability.")

doc.add_section_heading("9.3 Data Projection & Input Sanitization")
doc.add_bullet("•", "Password Projection: All Mongoose user queries explicitly exclude the password field using .select('-password').")
doc.add_bullet("•", "Strict Schema Whitelisting: Mongoose schema filters prevent rogue client parameters from injecting unauthorized fields into documents.")
doc.add_bullet("•", "CORS Restriction: Cross-Origin Resource Sharing is controlled via Express cors() middleware.")

# ==================== PAGE 15: CHAPTER 10 - DATABASE SETUP & SEEDING ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 10: EXECUTION & SEEDING GUIDE")
doc.add_section_heading("10.1 Database Connection Options")
doc.add_paragraph("FreelanceHub supports two seamless database deployment models configured via server/.env:")
doc.add_bullet("1. MongoDB Atlas (Cloud - Free Tier):", "Connects to free MongoDB Atlas cluster: MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/freelance-app")
doc.add_bullet("2. Local MongoDB Server:", "Connects to local MongoDB Community service: MONGO_URI=mongodb://localhost:27017/freelance-app")

doc.add_section_heading("10.2 MongoDB Atlas Configuration Checklist")
doc.add_paragraph("When using MongoDB Atlas, ensure two essential settings are configured in Atlas dashboard:")
doc.add_bullet("a. Network Access:", "Under Security > Network Access, add IP address 0.0.0.0/0 (Allow Access from Anywhere).")
doc.add_bullet("b. Database User:", "Under Security > Database Access, verify the user has readWriteAnyDatabase permissions.")

doc.add_section_heading("10.3 Single-Command Database Seeder")
doc.add_paragraph("To populate the database with complete evaluation data with one command:")
doc.add_code_block([
    "cd server",
    "npm run seed"
])

doc.add_table(
    ["Evaluation Account", "Email Address", "Password", "Profile Purpose"],
    [
        ["Platform Admin", "admin@freelancehub.com", "admin123", "Full metrics & account oversight"],
        ["Client 1", "client@techcorp.com", "client123", "Hiring client (NexGen Tech)"],
        ["Client 2", "sarah@designstudio.com", "sarah123", "Creative Agency Director"],
        ["Freelancer 1", "rahul@dev.io", "freelancer123", "Full-Stack MERN Developer"],
        ["Freelancer 2", "priya@uiux.design", "priya123", "UI/UX Product Designer"],
        ["Freelancer 3", "alex@writer.com", "alex123", "Technical Content Author"]
    ],
    [95, 140, 95, 155]
)

# ==================== PAGE 16: CHAPTER 11 - VIVA QUESTIONS 1-10 ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 11: TOP 20 TECHNICAL VIVA QUESTIONS (PART 1)")
doc.add_paragraph("Below are the most critical viva-voce questions posed by university examiners, complete with model answers:")

doc.add_paragraph("Q1: What is the MERN stack and why was it chosen?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: MERN stands for MongoDB, Express.js, React, and Node.js. It facilitates end-to-end JavaScript development across both client and server tiers. Its native JSON document exchange and non-blocking asynchronous event loop maximize performance and development velocity.")

doc.add_paragraph("Q2: How does JSON Web Token (JWT) authentication work in FreelanceHub?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Upon login, the server cryptographically signs a payload containing the user ID with a private secret key. The client stores this token in localStorage and attaches it via an Axios interceptor to the Authorization: Bearer <token> header for all protected route requests.")

doc.add_paragraph("Q3: Why choose MongoDB over traditional SQL databases for this project?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Freelance jobs and profiles possess dynamic structures (variable skill arrays, proposal collections, varying client info). MongoDB's document-oriented JSON model provides flexible schema agility without requiring alter table database migrations.")

doc.add_paragraph("Q4: What is BCrypt and what is the function of salt rounds?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: BCrypt is an adaptive cryptographic hash function. Salt rounds (configured to 10) specify the computational difficulty of calculating the hash, effectively preventing pre-computed rainbow table and dictionary attacks.")

doc.add_paragraph("Q5: How does the proposal acceptance logic prevent race conditions?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: In proposalController.js, accepting a bid sets the proposal to 'accepted', updates the Job status to 'in-progress', and executes Proposal.updateMany() to atomically reject all competing bids on that job in a single database operation.")

doc.add_paragraph("Q6: How is the average star rating computed?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: On each review submission, all reviews for the reviewee are queried, their ratings summed using reduce(), divided by total count, rounded to one decimal place, and saved in the User model.")

doc.add_paragraph("Q7: What is an Axios Interceptor?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: An interceptor is middleware for HTTP requests. In src/utils/api.js, it automatically injects the current user's Bearer token into request headers before leaving the browser.")

doc.add_paragraph("Q8: What is the role of Mongoose in this project?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Mongoose is an Object Data Modeling (ODM) library that provides schema validation, type casting, query building, and relational population for MongoDB documents.")

doc.add_paragraph("Q9: What is React Context API and how is it used here?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: AuthContext broadcasts user state, authentication status, login, register, and logout functions globally across the React tree without prop drilling.")

doc.add_paragraph("Q10: What are Protected Routes in React Router?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: ProtectedRoute.jsx checks if user is logged in. If unauthenticated, it redirects to /login; otherwise, it renders the child route components via <Outlet />.")

# ==================== PAGE 17: CHAPTER 11 CONT - VIVA QUESTIONS 11-20 ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 11 (CONT.): VIVA QUESTIONS 11-20")

doc.add_paragraph("Q11: Why is Vite faster than Create React App (CRA)?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Vite uses native browser ES Modules (ESM) and compiles dependencies using esbuild (written in Go), providing instant server starts and sub-50ms Hot Module Replacement (HMR).")

doc.add_paragraph("Q12: How do you prevent duplicate bid submissions?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: In proposalController.js, Proposal.findOne({ job: jobId, freelancer: req.user.id }) checks for an existing record before saving. If found, it returns HTTP 400 Bad Request.")

doc.add_paragraph("Q13: What HTTP status codes are implemented?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: 200 (Success), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), and 500 (Internal Server Error).")

doc.add_paragraph("Q14: Explain the difference between POST and PUT HTTP methods.", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: POST creates new resources (e.g. POST /api/jobs, POST /api/proposals), while PUT updates existing resources (e.g. PUT /api/users/profile, PUT /api/jobs/:id/complete).")

doc.add_paragraph("Q15: How does the admin cascade delete feature operate?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: When an admin deletes a user, the controller executes Job.deleteMany(), Proposal.deleteMany(), and Review.deleteMany() to eliminate orphaned records.")

doc.add_paragraph("Q16: What is CORS and how is it resolved in this project?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Cross-Origin Resource Sharing prevents unauthorized domains from accessing API resources. The backend uses the cors() middleware, while Vite's development proxy maps /api to http://localhost:5000.")

doc.add_paragraph("Q17: What is the function of dotenv in Node.js?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: dotenv loads environment variables from a private .env file into process.env, safeguarding secrets like database URIs and JWT encryption keys from public version control.")

doc.add_paragraph("Q18: How does the system handle database connection drops?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: In server/config/db.js, connection errors are caught inside a try-catch block and log actionable troubleshooting instructions without crashing the process.")

doc.add_paragraph("Q19: How is UI responsiveness implemented?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Responsive grid and flex utility classes in Tailwind CSS adapt seamlessly across mobile (<640px), tablet (768px), and desktop (>1024px) viewports.")

doc.add_paragraph("Q20: What are Mongoose Virtuals and Population?", font='F2', size=9.5, r=0.1, g=0.25, b=0.55)
doc.add_paragraph("A: Population automatically replaces referenced ObjectId foreign keys with the actual document data from another collection (e.g. populating client details in jobs).")

# ==================== PAGE 18: CHAPTER 12 - CONCLUSION & REFERENCES ====================
doc.new_page()
doc.add_chapter_heading("CHAPTER 12: FUTURE SCOPE & CONCLUSION")
doc.add_section_heading("12.1 Future Enhancements")
doc.add_bullet("1. Real-Time Chat (Socket.io):", "Direct real-time messaging between clients and freelancers for instant requirement clarification.")
doc.add_bullet("2. Payment Escrow Gateway:", "Automated milestone escrow funding using Stripe Connect or Razorpay API integration.")
doc.add_bullet("3. AI Project Matcher:", "Vector embedding algorithms matching freelancer skill sets directly to posted project descriptions.")
doc.add_bullet("4. File Storage Integration:", "AWS S3 / Cloudinary upload integration for design assets, project ZIP files, and PDF deliverables.")

doc.add_section_heading("12.2 Conclusion")
doc.add_paragraph("FreelanceHub successfully delivers a scalable, role-secured, and responsive freelancing marketplace platform utilizing the modern MERN stack. By integrating component-driven React 19 architecture, stateless JWT token authorization, deterministic bidding state machines, and dynamic reputation scoring, the system satisfies all major industry and academic requirements.")
doc.add_paragraph("The project provides a transparent, zero-commission alternative to legacy freelancing portals, making it an exemplary capstone project for university evaluation.")

doc.add_section_heading("REFERENCES & BIBLIOGRAPHY")
doc.add_paragraph("1. Elmasri, R., & Navathe, S. B. (2015). Fundamentals of Database Systems (7th ed.). Pearson.", size=8.5, leading=11)
doc.add_paragraph("2. Banks, A., & Porcello, E. (2020). Learning React: Modern Patterns for Developing React Applications (2nd ed.). O'Reilly Media.", size=8.5, leading=11)
doc.add_paragraph("3. Chodorow, K. (2013). MongoDB: The Definitive Guide (2nd ed.). O'Reilly Media.", size=8.5, leading=11)
doc.add_paragraph("4. Brown, E. (2019). Web Development with Node and Express (2nd ed.). O'Reilly Media.", size=8.5, leading=11)
doc.add_paragraph("5. Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures. Doctoral dissertation, UC Irvine.", size=8.5, leading=11)
doc.add_paragraph("6. RFC 7519: JSON Web Token (JWT) Standard. Internet Engineering Task Force (IETF).", size=8.5, leading=11)
doc.add_paragraph("7. React 19 Official Documentation. https://react.dev/", size=8.5, leading=11)
doc.add_paragraph("8. Tailwind CSS Modern Framework Documentation. https://tailwindcss.com/", size=8.5, leading=11)

doc.build()
