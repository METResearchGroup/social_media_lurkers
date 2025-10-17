# TODO: Issue Discovery Chatbot Demo

**Ticket**: [MET-61](https://linear.app/metresearch/issue/MET-61)  
**Status**: ✅ COMPLETED  
**Completed**: 2025-10-17  
**Last Updated**: 2025-10-17

## Implementation Checklist

### Phase 1: Scaffolding (1-2 hours) ✅
- [x] Initialize project with `uv init`
- [x] Install dependencies (`streamlit`, `langchain`, `langchain-openai`, `opik`, `pydantic`, `python-dotenv`, `ruff`)
- [x] Create folder structure (`agents/`, `workflows/`, `lib/`, `prompts/`)
- [x] Create Pydantic schemas (`IssueConfidence`, `ReflectionOutput`)
- [x] Implement `config.py` (model config, OpenRouter settings)
- [x] Create `.env.example` with API key templates
- [x] Set up `.gitignore`

### Phase 2: Agents (3-4 hours) ✅
- [x] Create `prompts/v1_conversation_system.txt`
- [x] Create `prompts/v1_reflection_system.txt`
- [x] Create `prompts/v1_router_system.txt`
- [x] Create `prompts/README.md`
- [x] Implement `agents/conversation_agent.py`
- [x] Implement `agents/reflection_agent.py` with per-issue confidence tracking
- [x] Implement `agents/router_agent.py` with question generation
- [x] Test each agent individually

### Phase 3: Workflow & UI (1-2 hours) ✅
- [x] Implement `workflows/conversation_flow.py` (main orchestration loop)
- [x] Create `app.py` with Streamlit UI
- [x] Add chat interface with message history
- [x] Add progress bar (`st.progress()`)
- [x] Add turn counter display
- [x] Add loading spinner (`st.spinner()`)
- [x] Add conversation history panel
- [x] Add reset button
- [x] Implement hardcoded opening question

### Phase 4: Telemetry & Polish (1 hour) ✅
- [x] Implement `lib/telemetry.py` with OpikTracer setup
- [x] Integrate Opik callbacks in agents
- [x] Add prompt version to trace metadata
- [x] Implement error handling with retry logic (max 3 retries)
- [x] Add exponential backoff for API failures
- [x] Run ruff linting and fix issues
- [x] Add docstrings to all functions

### Phase 5: Testing & Demo Prep (1-2 hours) ✅
- [x] Test Scenario 1: Healthcare-focused user
- [x] Test Scenario 2: Multi-issue user
- [x] Test Scenario 3: Vague user
- [x] Test Scenario 4: Off-topic user
- [x] Test Scenario 5: Max turns reached
- [x] Test Scenario 6: User disagreement
- [x] Iterate on prompts based on test results
- [x] Create/update README with setup instructions
- [x] Run through demo preparation checklist (Appendix B)
- [x] Rehearse demo presentation (Appendix C)

### Documentation ✅
- [x] Complete README with quick start guide
- [x] Document all environment variables
- [x] Add code comments and docstrings
- [x] Create demo script document

### Final Checks ✅
- [x] All acceptance criteria in MET-61 met
- [x] Ruff linting passes
- [x] Demo runs successfully end-to-end
- [x] Opik traces visible and complete
- [x] All 6 test scenarios pass
- [x] Demo rehearsed and timed (< 5 minutes)

## Notes

- Single comprehensive ticket - can be completed in one 6-10 hour session
- No dependencies on other tickets
- Focus on demo quality over production polish
- Test with healthcare-focused scenario first (most reliable)

## Blockers

None currently identified.

