# Task 1: Design a Platform to Collect Images + Descriptions from All Villages of India

## 1. Problem & Goals

### The Problem

Current AI vision-language models (e.g., CLIP, GPT-4V) suffer from "geographic and cultural bias." While they excel at identifying the Eiffel Tower or Western scenes, they fail to recognize rural Indian contexts such as a "handpump in Rohtak," a "Durga Puja pandal," or local village architecture. This lack of data prevents AI from being truly inclusive and functional for the next billion users in India.

### The Objective

Design a scalable, mobile-first product that enables distributed contributors (field agents, volunteers, NGOs) to capture and describe 1,000 images per village across all 600,000+ Indian villages, ensuring high data integrity and verifiable location accuracy.

---

## 2. User Roles and Goals

### A. Contributors (The "Ground" Team)

- **Who they are**: Field agents, NGO partners, or local village youth with entry-level smartphones.
- **Goals**:
  - Capture high-quality images of their local surroundings.
  - Provide accurate, culturally relevant descriptions in their native language or simple English.
  - Submit data efficiently, even in areas with poor internet connectivity.
- **Constraints**:
  - Low-end devices (limited RAM/Storage).
  - Intermittent internet (2G/3G speeds common).
  - Varied literacy and technical proficiency.

### B. Admin/Reviewers (The "Internal" Team)

- **Who they are**: Data scientists and QA specialists at JoshTalksAI.
- **Goals**:
  - Monitor real-time progress across 700+ districts.
  - Verify image quality (blur, relevance) and description accuracy.
  - Prevent fraudulent submissions (e.g., urban photos tagged as rural villages).
- **Constraints**: Managing massive data scale (millions of images).

---

## 3. Contributor Flow Design (Mobile-First)

### Step 1: Onboarding & Location Setup

- **Access**: Progressive Web App (PWA) link.
  - _Rationale_: No App Store download required; low friction for low-storage devices; easy to update.
- **Village Selection**: The app uses GPS to suggest the nearest village. Users confirm or select from a pre-loaded offline list of State > District > Village.

### Step 2: Content Capture

- **Guided Camera**: A custom camera interface that overlays a "quality guide" (e.g., "Keep it steady," "Good lighting").
- **Description Input**: A simple text field with voice-to-text support in regional languages.
- **Validation**: "Submit" is disabled until:
  - Image is detected (not a black/blurry screen).
  - Description is at least 8-10 words.
  - GPS coordinates are verified within the village boundary.

### Step 3: Offline Submission

- **Local Storage**: Submissions are saved to the device's local storage (IndexedDB).
- **Sync Manager**: A background worker detects when the user reaches 4G/Wi-Fi and uploads the queue automatically.
- **Progress Tracking**: A simple "Village Score" (e.g., 450/1000) to gamify the experience and motivate the contributor.

---

## 4. Admin / Verification View

### A. Coverage Dashboard (The "Heatmap")

- **Global View**: An interactive map of India, color-coded by "Completion %" (Red < 20%, Green > 90%).
- **Deep Dive**: Click on a district to see village-level progress and individual contributor performance.

### B. Verification Gallery

- **Bulk Review**: Admins see a grid of image + caption pairs.
- **Quick Actions**: Keyboard shortcuts (e.g., 'A' for Approve, 'R' for Reject) for high-speed processing.
- **Flagging**: Automatic AI-first pass flags images that are likely duplicates or stock photos.

---

## 5. Edge Scenarios & Solutions

| Scenario                 | Product Solution                                                                                                        |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **No Internet for days** | App caches the entire village list locally; uses persistent local storage for up to 200 drafts.                         |
| **Low-effort captions**  | Use "Nudge prompts" like: "What color is the handpump?" or "Who is in the photo?" to improve description depth.         |
| **Location Fraud**       | Mandatory GPS metadata capture. If the GPS is spoofed or far from the village, the submission is automatically flagged. |
| **Duplicate images**     | On-device hashing to prevent the same user from uploading the same photo multiple times.                                |

---

## 6. Prioritization: MVP vs. Future Scope

### MVP (Phase 1)

- Core capture and description flow.
- Offline-first storage and sync.
- Basic GPS validation.
- Simple Admin dashboard with approval/rejection.

### Future Scope (Phase 2)

- **Gamification**: Leaderboards and milestone rewards for top contributors.
- **AI Pre-verification**: On-device image quality scoring to reduce manual review load.
- **Multilingual UI**: Full interface localization in 12+ Indian languages.
- **Community Review**: Trusted contributors can peer-review others' work for faster scaling.

---

## 7. Summary & Success Metrics

### Design Principles

- **Clarity over Polish**: Focus on functional UI that works on low-end screens.
- **Integrity-First**: Built-in location and quality checks to ensure "Gold Standard" data.
- **Frictionless**: Minimal steps from "Open App" to "Image Captured."

### Success Metrics

- **Completion Rate**: % of targeted villages reaching 1,000 images.
- **Data Yield**: Ratio of approved images to total submissions (Target: >92%).
- **Contributor Lifetime Value**: Average number of villages completed per contributor.
- **Verification Speed**: Average time taken by an admin to review a submission batch.

---

## Figma Wireframe Logic (Contributor Flow)

### Screen A: Village Dashboard

- **Header**: "Contributing to: Village X, District Y"
- **Progress Card**: Circular chart showing "450 / 1000 images collected."
- **Action Button**: Large green FAB (Floating Action Button) with a Camera icon.

### Screen B: Capture & Describe

- **Top 2/3**: Real-time camera preview with a "Level" indicator for steady shots.
- **Bottom 1/3**:
  - Multilingual text area: "Describe this scene..."
  - Submit button with "Offline Sync" indicator.

### Screen C: Admin Dashboard

- **Left Panel**: Filters (State, District, Status).
- **Center Panel**: Map View with toggle to Gallery View.
- **Right Panel**: Selection details (Metadata: GPS, Device, Contributor Rating).
