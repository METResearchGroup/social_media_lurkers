# Lessons Learned: Issue Discovery Chatbot

**Ticket**: [MET-61](https://linear.app/metresearch/issue/MET-61)  
**Project**: Issue Discovery Chatbot Demo

---

## Planning Phase

### What Went Well

1. **Multi-Persona Review Process**
   - Three persona reviews (LLM Architect, Rapid Prototyper, Demo Expert) caught different types of issues
   - Each persona brought unique expertise: architecture, speed, demo preparation
   - Average score of 88% gave high confidence to proceed
   - Review identified critical improvements (prompt versioning, demo prep, UI polish)

2. **Spec Structure**
   - Following HOW_TO_WRITE_A_SPEC.md resulted in comprehensive coverage
   - All stakeholder concerns addressed (technical, UX, business)
   - Clear scope boundaries prevented feature creep
   - Appendices (test scenarios, demo checklist, script) are immediately actionable

3. **Scope Management**
   - Explicitly defining "out of scope" prevented over-engineering
   - Focus on demo vs. production kept timeline realistic
   - Single comprehensive ticket appropriate for 6-10 hour estimate

### What Could Be Improved

1. **Initial Cost Estimate**
   - First estimate ($5) was too low
   - Didn't account for prompt iteration costs
   - Revised to $0.10-0.30 after persona feedback
   - **Lesson**: Factor in LLM iteration costs for development

2. **Demo-Specific Risks**
   - Initial spec didn't emphasize demo failure scenarios enough
   - Demo Expert review highlighted need for backup plans
   - Added demo preparation checklist and backup video recommendation
   - **Lesson**: Demo-specific risks (crashes, API failures) need explicit mitigation

### Key Insights

1. **Prompt Versioning is Critical**
   - All three reviewers emphasized storing prompts in git-versioned files
   - Enables reproducibility and correlation with conversation quality
   - Prevents "which prompt version produced this result?" questions
   - **Decision**: Always version prompts in git, never inline in code

2. **Demo Preparation Matters**
   - Demo Expert review emphasized rehearsal and backup plans
   - Created comprehensive demo checklist and 5-minute script
   - Practice runs prevent demo-day surprises
   - **Decision**: Always create demo script and rehearse 3+ times

3. **Telemetry from Day 1**
   - Opik integration enables debugging multi-agent systems
   - Conversation replay saves hours of blind debugging
   - Cost tracking prevents surprise bills
   - **Decision**: Always integrate observability tools from start

4. **Rapid Prototyping Tech Stack**
   - Streamlit + LangChain + uv = zero friction
   - Right tool choices can 3x development speed
   - Avoid custom UI when Streamlit defaults suffice
   - **Decision**: Optimize for speed in demos, not perfection

---

## Implementation Phase

_(Lessons will be added during implementation)_

---

## Retrospective

_(Post-project retrospective will be added after completion)_

---

## Reusable Patterns

### Architecture Patterns
- Three-agent coordination: conversation → reflection → routing
- Per-entity confidence tracking (not just global confidence)
- Feedback loop for targeted question generation

### Development Patterns
- Prompt versioning in git
- Pydantic schemas for structured agent outputs
- OpikTracer callbacks for LangChain observability
- Streamlit session_state for conversation management

### Demo Patterns
- Demo preparation checklist (30 min before)
- 5-minute demo script with timing
- Backup plans (video, pre-loaded dashboard)
- Test scenarios defined before implementation

---

## Recommendations for Future Projects

1. **Always do multi-persona reviews** for specs > 5 pages
2. **Version prompts in git** from day 1, never inline
3. **Add telemetry early**, not as afterthought
4. **Define demo test scenarios** before building
5. **Create demo prep checklist** for stakeholder presentations
6. **Estimate LLM iteration costs** realistically (not just inference)
7. **Use boring, proven tech** for rapid prototyping (Streamlit > custom React)
8. **Rehearse demos 3+ times** before presentation

---

**Last Updated**: 2025-10-16 (Planning Phase)

