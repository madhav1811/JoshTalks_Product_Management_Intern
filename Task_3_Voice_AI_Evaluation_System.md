# Task 3: Voice AI Evaluation System Design

## 1. Evaluation Criteria (3-4 Core Metrics)

To judge the quality of AI-human conversations, we will focus on these key pillars:

1.  **Intent Understanding (Accuracy)**:
    - **What it measures**: Did the AI correctly interpret what the human wanted?
    - **Why it matters**: Without accurate intent recognition, the conversation fails regardless of how "natural" the AI sounds.
2.  **Task Completion (Effectiveness)**:
    - **What it measures**: Did the AI successfully achieve the objective (e.g., booked a room, answered a specific query)?
    - **Why it matters**: This is the ultimate goal of any service-oriented AI system.
3.  **Naturalness (Speech Quality)**:
    - **What it measures**: The tone, pace, and human-likeness of the AI's voice.
    - **Why it matters**: A robotic or jerky voice can break user trust and lead to frustration.
4.  **Dialogue Flow (Coherence)**:
    - **What it measures**: How smoothly the conversation transitioned from one turn to another (no awkward pauses or irrelevant follow-ups).
    - **Why it matters**: Good flow makes the conversation feel seamless and efficient.

---

## 2. Evaluator Interface Design

### Screen Layout:
- **Header**: Call ID, Timestamp, and Goal (e.g., "Check room availability for 2 nights").
- **Center Panel**:
    - **Audio Player**: Waveform visualizer with 0.5x to 2x speed controls.
    - **Interactive Transcript**: Side-by-side view (Left: Human, Right: AI) where clicking a line jumps to that part of the audio.
- **Right Sidebar**:
    - **Rating Rubric**: 1-5 stars for each of the 4 criteria.
    - **Critical Failure Flags**: Checkboxes for "Hallucination," "Offensive Content," or "Dead Air."
    - **Feedback Box**: Text field for "Qualitative Insights."

### Workflow:
1.  **Step 1: Contextualize**: Read the call goal and any background info.
2.  **Step 2: Listen & Read**: Play the audio while following the transcript.
3.  **Step 3: Annotate**: Highlight specific turns where the AI failed or excelled.
4.  **Step 4: Score**: Rate the 4 criteria using the provided rubric.
5.  **Step 5: Submit**: Final review and submission.

---

## 3. Reducing Rating Inconsistencies

To ensure evaluations are reliable across different people, we will implement:

- **Detailed Scoring Rubric**: Instead of "1-5 stars," we'll provide specific examples for each score (e.g., "1 star = AI completely misunderstood, 5 stars = AI handled complex follow-up correctly").
- **Calibration Sessions**: Monthly group reviews of the same 5 calls to discuss and align on scores.
- **Blind Double-Reviews**: A random 10% of calls are assigned to two evaluators. If their scores differ by >1 point, a senior reviewer intervenes.
- **Proactive Nudges**: If an evaluator gives a "1 star" for naturalness but doesn't leave a comment, the system prompts them to explain why.

---

## 4. Measuring System Quality

- **Inter-Rater Reliability (IRR)**: A statistical score (Cohen's Kappa) measuring how much agreement there is between multiple evaluators.
- **Evaluation Throughput**: Average time taken to evaluate 1 minute of audio (target: 2-3x the audio duration).
- **Consistency Score**: How often an evaluator gives the same score when re-assigned the same call after a week.
- **Feedback Loop Quality**: Percentage of human evaluations that led to a measurable improvement in the AI model.

---

## Bonus: AI-Assisted Evaluation (Scale to 1,000+ Calls)

To speed up the process, AI can assist human evaluators by:

- **Automated Sentiment Detection**: Flagging parts of the call where the human caller sounded frustrated or angry.
- **Pre-Filtering**: Automatically discarding "dead" calls (e.g., no answer, wrong number) so humans only focus on high-value interactions.
- **Topic Modeling**: Automatically grouping calls by topic (e.g., "Booking," "Cancellation," "Query") for more specialized evaluation.
- **AI-Human Cross-Check**: A lightweight AI model can provide a "first pass" score. If the human score differs significantly, the system flags it for a deeper look.
