# TODO: Issue Discovery Chatbot Demo

**Ticket**: [MET-61](https://linear.app/metresearch/issue/MET-61)  
**Status**: Not Started  
**Last Updated**: 2025-10-16

## Implementation Checklist

### Phase 1: Scaffolding (1-2 hours)
- [ ] Initialize project with `uv init`
- [ ] Install dependencies (`streamlit`, `langchain`, `langchain-openai`, `opik`, `pydantic`, `python-dotenv`, `ruff`)
- [ ] Create folder structure (`agents/`, `workflows/`, `lib/`, `prompts/`)
- [ ] Create Pydantic schemas (`IssueConfidence`, `ReflectionOutput`)
- [ ] Implement `config.py` (model config, OpenRouter settings)
- [ ] Create `.env.example` with API key templates
- [ ] Set up `.gitignore`

### Phase 2: Agents (3-4 hours)
- [ ] Create `prompts/v1_conversation_system.txt`
- [ ] Create `prompts/v1_reflection_system.txt`
- [ ] Create `prompts/v1_router_system.txt`
- [ ] Create `prompts/README.md`
- [ ] Implement `agents/conversation_agent.py`
- [ ] Implement `agents/reflection_agent.py` with per-issue confidence tracking
- [ ] Implement `agents/router_agent.py` with question generation
- [ ] Test each agent individually

### Phase 3: Workflow & UI (1-2 hours)
- [ ] Implement `workflows/conversation_flow.py` (main orchestration loop)
- [ ] Create `app.py` with Streamlit UI
- [ ] Add chat interface with message history
- [ ] Add progress bar (`st.progress()`)
- [ ] Add turn counter display
- [ ] Add loading spinner (`st.spinner()`)
- [ ] Add conversation history panel
- [ ] Add reset button
- [ ] Implement hardcoded opening question

### Phase 4: Telemetry & Polish (1 hour)
- [ ] Implement `lib/telemetry.py` with OpikTracer setup
- [ ] Integrate Opik callbacks in agents
- [ ] Add prompt version to trace metadata
- [ ] Implement error handling with retry logic (max 3 retries)
- [ ] Add exponential backoff for API failures
- [ ] Run ruff linting and fix issues
- [ ] Add docstrings to all functions

### Phase 5: Testing & Demo Prep (1-2 hours)
- [ ] Test Scenario 1: Healthcare-focused user
- [ ] Test Scenario 2: Multi-issue user
- [ ] Test Scenario 3: Vague user
- [ ] Test Scenario 4: Off-topic user
- [ ] Test Scenario 5: Max turns reached
- [ ] Test Scenario 6: User disagreement
- [ ] Iterate on prompts based on test results
- [ ] Create/update README with setup instructions
- [ ] Run through demo preparation checklist (Appendix B)
- [ ] Rehearse demo presentation (Appendix C)

### Documentation
- [ ] Complete README with quick start guide
- [ ] Document all environment variables
- [ ] Add code comments and docstrings
- [ ] Create demo script document

### Final Checks
- [ ] All acceptance criteria in MET-61 met
- [ ] Ruff linting passes
- [ ] Demo runs successfully end-to-end
- [ ] Opik traces visible and complete
- [ ] All 6 test scenarios pass
- [ ] Demo rehearsed and timed (< 5 minutes)

## Notes

- Single comprehensive ticket - can be completed in one 6-10 hour session
- No dependencies on other tickets
- Focus on demo quality over production polish
- Test with healthcare-focused scenario first (most reliable)

## Blockers

None currently identified.

