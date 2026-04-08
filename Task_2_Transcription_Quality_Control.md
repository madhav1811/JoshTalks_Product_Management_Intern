# Task 2: Transcription Quality Control (Josh Jobs)

## Part I: Identifying Low-Quality Transcribers

### Pattern 1: The "Minimal Effort" (Accept-All) Pattern
**What it tells us**:
This behavior suggests that the transcriber is simply accepting the AI-generated (Whisper) text without actually listening to the audio or making necessary corrections. They are prioritizing speed over accuracy.

**How to measure it**:
- **Metric**: `Edit Rate` = (Total Tasks with `is_edited == True`) / (Total Tasks Completed).
- **Secondary Metric**: `Levenshtein Distance` between `whisper_text` and `user_text`. If it's 0 for a high percentage of tasks, it's a red flag.

**Red flag thresholds**:
- **Edit Rate < 15%**: Over a sample of 50 tasks, if a user is editing less than 15% of the Whisper text, they are likely skipping corrections. Whisper is good, but for regional Indian dialects, its error rate is significantly higher than 15%.

**False alarms**:
- **Short, Clear Audio**: If the audio is extremely short (e.g., "Namaste") or crystal clear, Whisper might get it right 100% of the time. We should only flag this pattern over a large enough sample of diverse audio clips.

### Pattern 2: The "Rushing" (Superhuman Speed) Pattern
**What it tells us**:
Transcription is a time-intensive task. If a user spends significantly less time on a task than the actual duration of the audio, they couldn't have listened to it fully.

**How to measure it**:
- **Metric**: `Time Ratio` = `time_taken_by_user` / `duration`.
- **Secondary Metric**: `Characters Per Second (CPS)` = `segment_character_per_second`.

**Red flag thresholds**:
- **Time Ratio < 0.7**: If a user finishes a 10-second clip in 5 seconds, they haven't even heard the full audio once.
- **CPS > 15**: Average typing speed is 5-8 CPS. Anything above 15 CPS suggests copy-pasting or minimal editing of the AI text while rushing.

**False alarms**:
- **Experienced Transcribers**: High-speed transcribers using keyboard shortcuts and 1.5x/2x playback might legitimately have a lower time ratio (around 0.8-0.9), but never below the actual duration for a sustained period.

---

## Part II: Automated Quality Assurance (QA) System

### Recommendation 1: "Gold Standard" Trap (Honey-Potting)
- **Logic**: Randomly insert "Gold Standard" tasks into the user's queue. These are tasks where the correct transcription is already known and verified by internal experts.
- **Action**: If a transcriber fails a Gold Standard task (e.g., Levenshtein distance > 10% from the known correct text), they receive a warning. Three failures lead to an automatic account block.

### Recommendation 2: Real-time Speed/Edit Interlock
- **Logic**: Implement a "Listen Before Submit" rule. The "Submit" button remains disabled until the audio has been played at least once (80% of duration).
- **Action**: If a user's average `Time Ratio` falls below 0.8 across 10 consecutive tasks, temporarily suspend their account for 24 hours for "Reviewing Quality."

### Recommendation 3: Whisper Similarity Guard
- **Logic**: Monitor the edit distance between `whisper_text` and `user_text`.
- **Action**: If a user's cumulative `Edit Rate` is < 10% over 100 tasks, flag them for a manual human-in-the-loop (HITL) audit. If the audit confirms poor quality, block the user permanently.

### Summary for Engineering Team:
| Behaviour | Metric | Action |
| :--- | :--- | :--- |
| **Accept-All** | Edit Rate < 15% (over 50 tasks) | Flag for Manual Audit |
| **Rushing** | Time Ratio < 0.7 (over 10 tasks) | 24-hour Suspension |
| **Trap Failure** | Gold Standard Accuracy < 90% | Permanent Block |
| **High CPS** | CPS > 18 | Warn & Re-calibrate |

This system ensures that transcribers are actually listening and correcting, protecting the integrity of the JoshTalksAI dataset.
