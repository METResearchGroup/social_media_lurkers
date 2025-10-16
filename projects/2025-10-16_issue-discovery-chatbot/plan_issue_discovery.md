# Implementation Plan: Issue Discovery Chatbot

**Ticket**: [MET-61](https://linear.app/metresearch/issue/MET-61)  
**Estimated Effort**: 6-10 hours  
**Priority**: Urgent  
**Status**: Ready to Start

---

## Overview

Build a multi-agent Streamlit chatbot demo that discovers which of 15 predefined political/social issues users care about through natural conversation. Three specialized agents (Conversation, Reflection, Router) coordinate using LangChain and Opik for full observability.

---

## Task Breakdown

### Phase 1: Scaffolding (1-2 hours)

**Goal**: Set up project foundation and dependencies

**Subtasks**:
1. Initialize project with `uv init social_media_lurkers`
2. Add dependencies via `uv add`:
   - `streamlit ^1.29.0`
   - `langchain ^0.1.0`
   - `langchain-openai ^0.0.5`
   - `opik ^0.1.0`
   - `pydantic ^2.5.0`
   - `python-dotenv ^1.0.0`
   - `ruff ^0.1.0` (dev)
3. Create folder structure:
   ```
   agents/
   workflows/
   lib/
   prompts/
   ```
4. Define Pydantic schemas in `agents/__init__.py` or separate `schemas.py`
5. Implement `config.py` with model settings
6. Create `.env.example` with:
   ```
   OPENROUTER_API_KEY=your_key_here
   OPIK_API_KEY=your_key_here
   HTTP_REFERER=
   X_TITLE=
   ```
7. Create `.gitignore`:
   ```
   .env
   __pycache__/
   *.pyc
   .python-version
   .venv/
   ```

**Deliverables**:
- Project runs `streamlit run app.py` (even if minimal)
- Dependencies installed and importable
- Configuration loads from environment

**Effort**: 1-2 hours

---

### Phase 2: Agents (3-4 hours)

**Goal**: Implement three agents with LangChain and prompts

**Subtasks**:

#### 2.1: Create Prompts (30 min)
1. `prompts/v1_conversation_system.txt`:
   - Role: Conversational agent that asks questions
   - Tone: Casual, empathetic
   - Instructions: Ask about issues user cares about, be natural
   - Include hardcoded opening question

2. `prompts/v1_reflection_system.txt`:
   - Role: Analyzes conversation for issue confidence
   - Output: Pydantic `ReflectionOutput` schema
   - Track per-issue confidence (0-2+ signals)
   - List of 15 issues provided

3. `prompts/v1_router_system.txt`:
   - Role: Decides next action based on reflection
   - If confident: format confirmation message
   - If not: generate next question focusing on uncertain_issues

4. `prompts/README.md`: Explain purpose of each prompt

#### 2.2: Conversation Agent (1 hour)
File: `agents/conversation_agent.py`

- Load prompt from `prompts/v1_conversation_system.txt`
- Use LangChain with OpenRouter (GPT-4o-mini)
- Maintain conversation history
- Return agent response

#### 2.3: Reflection Agent (1.5 hours)
File: `agents/reflection_agent.py`

- Load prompt from `prompts/v1_reflection_system.txt`
- Analyze full conversation history
- Track confidence per issue (need 2 clear signals)
- Return `ReflectionOutput` Pydantic model
- Only confident after minimum 5 turns

**Key Logic**:
```python
for each issue in 15_issues:
    count signals in conversation for this issue
    if signals >= 2:
        confident_issues.append(issue)
    else:
        uncertain_issues.append(issue)

is_confident = (
    turn_count >= 5 and
    len(uncertain_issues) <= threshold
)
```

#### 2.4: Router Agent (1 hour)
File: `agents/router_agent.py`

- Load prompt from `prompts/v1_router_system.txt`
- Receive `ReflectionOutput`
- If `is_confident == True`:
  - Format: "Based on our conversation, you care about: [issues]. Is this correct?"
- If `is_confident == False`:
  - Generate next question focusing on `uncertain_issues`
  - Use context of what's been discussed
  - Avoid repetition

**Deliverables**:
- Three working agents
- Prompts stored as versioned files
- Each agent testable independently

**Effort**: 3-4 hours

---

### Phase 3: Workflow & UI (1-2 hours)

**Goal**: Orchestrate agents and create Streamlit interface

#### 3.1: Workflow Orchestration (1 hour)
File: `workflows/conversation_flow.py`

**Main Loop**:
```python
is_confident = False
turn_count = 0

while not is_confident and turn_count < 10:
    # Get user input
    user_message = get_user_input()
    
    # Conversation agent
    agent_response = conversation_agent.invoke(user_message)
    
    # Reflection agent
    reflection = reflection_agent.analyze(conversation_history)
    
    # Router agent
    next_action = router_agent.route(reflection)
    
    if reflection.is_confident:
        # Ask for confirmation
        user_confirms = present_confirmation(reflection.confident_issues)
        if user_confirms:
            break
        else:
            is_confident = False
    
    turn_count += 1

if turn_count >= 10:
    # Present best guess without confirmation loop
    show_final_summary(reflection.confident_issues)
```

#### 3.2: Streamlit UI (1 hour)
File: `app.py`

**Components**:
1. Welcome message with hardcoded opening question
2. Chat interface (`st.chat_message()`)
3. Progress bar: `st.progress(turn_count / 10)`
4. Turn counter: `st.write(f"Turn {turn_count} of 10")`
5. Loading spinner: `with st.spinner("Thinking..."):`
6. History panel (automatic with chat_message)
7. Reset button in sidebar:
   ```python
   if st.sidebar.button("🔄 Start Over"):
       for key in list(st.session_state.keys()):
           del st.session_state[key]
       st.rerun()
   ```

**Session State Management**:
- `st.session_state.messages` - chat history
- `st.session_state.turn_count` - current turn
- `st.session_state.conversation_history` - for agents
- `st.session_state.is_confident` - reflection status

**Deliverables**:
- Working Streamlit app
- Full conversation flow
- UI polish (progress, loading, reset)

**Effort**: 1-2 hours

---

### Phase 4: Telemetry & Polish (1 hour)

**Goal**: Add Opik observability and error handling

#### 4.1: Opik Integration (30 min)
File: `lib/telemetry.py`

```python
from opik.integrations.langchain import OpikTracer

def init_opik_tracer(tags=None):
    """Initialize OpikTracer for LangChain"""
    if tags is None:
        tags = ["issue-discovery", "chatbot"]
    return OpikTracer(tags=tags)

def add_prompt_version_to_trace(tracer, version="v1"):
    """Add prompt version to trace metadata"""
    # Implementation depends on Opik API
    pass
```

Usage in agents:
```python
opik_tracer = init_opik_tracer()
response = agent.invoke(input, callbacks=[opik_tracer])
```

#### 4.2: Error Handling (30 min)
- Retry logic: max 3 attempts with exponential backoff
- Pydantic validation errors: retry with error context
- API failures: show `st.error()` with user-friendly message
- All errors logged to Opik

#### 4.3: Code Quality
- Run `ruff check .`
- Add docstrings to all functions
- Add type hints

**Deliverables**:
- Opik traces visible in dashboard
- Graceful error handling
- Clean, linted code

**Effort**: 1 hour

---

### Phase 5: Testing & Demo Prep (1-2 hours)

**Goal**: Validate all scenarios and prepare for demo

#### 5.1: Test Scenarios (1 hour)
Run through all 6 scenarios from spec Appendix A:
1. Healthcare-focused user
2. Multi-issue user
3. Vague user
4. Off-topic user
5. Max turns
6. User disagreement

For each:
- Document results
- Check Opik traces
- Note any issues
- Iterate on prompts if needed

#### 5.2: Demo Preparation (1 hour)
- Create README with setup instructions
- Follow demo preparation checklist (Appendix B)
- Rehearse demo script (Appendix C)
- Time demo (should be < 5 minutes)
- Record backup demo video (optional but recommended)

**Deliverables**:
- All test scenarios pass
- Demo script rehearsed
- Documentation complete
- Ready to present

**Effort**: 1-2 hours

---

## Dependencies

**External**:
- OpenRouter API key (get from https://openrouter.ai/keys)
- Opik account (get from https://www.comet.com/opik or run `opik configure`)

**Internal**:
- None (standalone ticket)

---

## Parallel Execution Opportunities

This is a single ticket with serial dependencies. However, within implementation:

**Can be done in any order** (after scaffolding):
- Writing prompts
- Creating Pydantic schemas
- Setting up configuration

**Must be done in order**:
1. Scaffolding → Agents → Workflow → UI → Telemetry → Testing

---

## Success Metrics

**Functional**:
- ✅ Completes conversation in 5-10 turns
- ✅ Identifies user's issues correctly (via confirmation)
- ✅ Handles all 6 test scenarios

**Technical**:
- ✅ All agents work via LangChain
- ✅ Pydantic schemas validate outputs
- ✅ Opik traces capture full flow
- ✅ Code passes ruff linting

**Demo**:
- ✅ Demo runs reliably
- ✅ Completes in < 5 minutes
- ✅ Showcases multi-agent coordination

---

## Risk Mitigation

**Prompt Quality**: If questions are poor, iterate on prompts early (Phase 2)
**API Issues**: Test API connectivity in Phase 1
**Time Overrun**: Use phased approach, can stop after any phase for partial value

---

## Execution Notes

- This plan assumes AI agent execution (not human)
- Estimated 6-10 hours includes all phases
- Focus on demo quality, not production robustness
- Test early and often
- Use healthcare scenario for initial testing (most reliable)

---

**Last Updated**: 2025-10-16

