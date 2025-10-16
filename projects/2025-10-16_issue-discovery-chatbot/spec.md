# 🧾 Spec: Issue Discovery Chatbot Demo

## 1. Problem Statement

**Who is affected?**
Internal team members who need to demonstrate the value of multi-agent AI architectures for conversational user research and issue discovery.

**What's the pain point?**
We need a working demo that showcases how multiple AI agents can coordinate to conduct intelligent, dynamic conversations that discover user preferences through guided questioning. This demonstrates the technical capability and value proposition of multi-agent systems for real-world applications like civic engagement, market research, or customer discovery.

**Why now?**
This is a demonstration project for internal use to showcase technical capabilities and architectural patterns for building sophisticated conversational AI systems.

**Strategic alignment:**
- Demonstrates multi-agent coordination patterns
- Validates LangChain + Opik + OpenRouter integration stack
- Provides reusable architecture for future conversational AI projects
- Shows value of structured agentic workflows with telemetry

## 2. Desired Outcomes & Metrics

**Primary Outcome:**
A working Streamlit application that conducts natural, empathetic conversations to identify which of 15 predefined political/social issues a user cares about, using a three-agent architecture.

**Success Criteria:**
- ✅ Completes full conversation flow from start to finish
- ✅ Asks varied, contextually relevant questions (not repetitive)
- ✅ Correctly identifies issues user cares about based on conversation
- ✅ Handles edge cases (very short responses, max turns, user corrections)
- ✅ All three agents work together seamlessly
- ✅ Opik telemetry captures conversation traces and metrics
- ✅ Code is clean, documented, and follows best practices
- ✅ Demo feels natural and showcases multi-agent coordination value

**Metrics to Track (via Opik):**
- Turn count per conversation (target: 5-10 turns)
- Issues identified per conversation
- Confidence level progression over turns
- User confirmation rate (agree vs. disagree with final assessment)
- Token usage per agent
- Agent invocation patterns

**Acceptance Criteria:**
- User can complete a conversation in 5-10 turns
- System correctly identifies at least 1 issue the user cares about
- Final confirmation step allows user to correct misidentified issues
- UI displays progress, history, and current conversation state
- All API calls are traced in Opik
- README includes setup instructions that work on fresh environment

**Deadline:**
No hard deadline; target 6-10 hours of focused development work.

## 3. In Scope / Out of Scope

### ✅ In Scope

**Core Functionality:**
- Single-user conversation flow (one conversation at a time)
- Identification of user's issues from 15 predefined options
- Maximum 10 conversation turns with graceful handling of limit
- Three-agent architecture (Conversation, Reflection, Router)
- User confirmation step with ability to correct
- Per-issue confidence tracking (2 signals per issue required)
- Global confidence after minimum 5 turns

**Technical Implementation:**
- Streamlit UI with basic chat interface, progress bar, and history panel
- LangChain agent framework
- Pydantic schemas for structured outputs
- Opik telemetry integration with conversation tracing
- OpenRouter API integration using GPT-4o-mini
- `uv` package management
- Error handling with retry logic
- Environment variable configuration

**Documentation:**
- README with setup instructions
- Opik configuration guide
- Code comments and docstrings
- `.env.example` template

### ❌ Out of Scope

**Not Included:**
- Multi-user/multi-session management
- Persistent storage of conversations (no database)
- Issue prioritization or ranking (just identification)
- Follow-up actions or recommendations based on issues
- Advanced UI/UX features (animations, complex layouts)
- Authentication or user profiles
- Issue definitions or educational content
- Custom issues beyond the predefined 15
- Multi-language support
- Voice interface
- Production deployment infrastructure
- Automated testing (manual testing only for demo)
- A/B testing or experimentation framework
- Analytics dashboard or visualization
- Integration with external civic engagement platforms

### 🔮 Future Enhancements (Not for MVP)
- Issue importance ranking
- Conversation analytics dashboard
- Export conversation transcripts
- Support for custom issues
- Recommendation engine based on identified issues

## 4. Stakeholders & Dependencies

### Stakeholders
- **Primary**: Internal team members viewing the demo
- **Developer**: Person implementing and maintaining the demo

### External Dependencies
- **OpenRouter API**: Required for GPT-4o-mini access
  - API key required
  - Network connectivity required
  - Rate limits may apply
- **Opik Platform**: Required for telemetry
  - API key or local setup required
  - Configuration via `opik configure`

### Technology Stack Dependencies
- Python 3.10+
- uv (package manager)
- Streamlit (UI framework)
- LangChain (agent framework)
- LangChain-OpenAI (OpenRouter integration)
- Opik SDK (telemetry)
- Pydantic (validation)
- python-dotenv (environment management)
- ruff (linting - dev only)

### No Cross-Team Dependencies
- Single developer, internal demo
- No approvals or sign-offs required
- No integration with other teams or services

## 5. Risks / Unknowns

### Known Risks

**Risk 1: Conversation Quality**
- **Issue**: LLM may generate poor or repetitive questions
- **Mitigation**: Carefully crafted system prompts with examples; router agent uses uncertain_issues to guide targeted questions
- **Severity**: Medium
- **Likelihood**: Medium

**Risk 2: Convergence Within 10 Turns**
- **Issue**: Conversation may not gather enough information in 10 turns
- **Mitigation**: Confidence criteria designed to favor earlier convergence (5-turn minimum); router prioritizes breadth early
- **Severity**: Low
- **Likelihood**: Medium

**Risk 3: Issue Mapping Ambiguity**
- **Issue**: User language may not map cleanly to official issue names
- **Mitigation**: Reflection agent uses LLM-based semantic mapping; provide clear issue descriptions in prompts
- **Severity**: Medium
- **Likelihood**: High

**Risk 4: API Failures**
- **Issue**: OpenRouter or Opik APIs may fail mid-conversation
- **Mitigation**: Error handling with user-friendly messages; retry logic with exponential backoff (max 3 retries)
- **Severity**: Low (demo only)
- **Likelihood**: Low

**Risk 5: Malformed LLM Responses**
- **Issue**: LLM may not return valid Pydantic schemas
- **Mitigation**: Pydantic validation with retry logic; structured output prompts
- **Severity**: Medium
- **Likelihood**: Medium

### Research Spikes
- **None required**: Technology stack is well-understood and documented

### Decision Uncertainties
- **Hardcoded opening question**: Need to determine during implementation (low priority)
- **Global confidence criteria**: When to become confident overall (partially defined: min 5 turns + sufficient issue coverage)

## 6. UX Notes & Accessibility

### User Journey

**Today (Before):**
- No demo exists

**After This Project:**
1. User opens Streamlit app in browser
2. Sees welcome message and privacy disclaimer
3. Reads hardcoded opening question with casual, empathetic tone
4. Responds in text input
5. Sees progress indicator (Turn X of 10)
6. Views conversation history in dedicated panel
7. Receives follow-up questions that feel natural and contextual
8. After 5+ turns, if system is confident, sees final assessment:
   - "Based on our conversation, you care about: [Issue 1], [Issue 2], [Issue 3]. Is this correct?"
9. Can confirm (✅) or disagree (❌)
10. If disagrees, continues conversation for refinement
11. If confirms or max turns reached, conversation ends with summary

### UI Components

**Required Elements:**
- **Chat interface**: Message bubbles for user and assistant
- **Text input**: For user responses
- **Progress bar**: Shows "Turn X of 10"
- **History panel**: Scrollable view of conversation so far
- **Conversation state indicators**: Clear visual feedback on current step

**Tone & Style:**
- Casual and empathetic
- Not overly formal or robotic
- Questions feel like natural conversation, not interrogation

**Design System:**
- Use Streamlit default components (no custom design system)
- Clean, minimal, functional aesthetic
- Responsive to basic viewport sizes

### Accessibility
- **Text-based interface**: Inherently accessible (no images or complex media)
- **Keyboard navigation**: Streamlit provides by default
- **Screen reader friendly**: Standard HTML text inputs and outputs
- **No specific WCAG requirements**: Internal demo, but basic accessibility via Streamlit defaults

### User Evidence
- **No user research**: This is a demo project
- **Assumption**: Users can type responses and understand conversational AI interactions
- **Validation approach**: Manual testing during development

## 7. Technical Notes

### Architecture Overview

**Three-Agent System:**

1. **Conversation Agent** (`agents/conversation_agent.py`)
   - Manages dialogue with user
   - Asks dynamic questions based on conversation history
   - Presents final issue list for confirmation
   - Handles user agreement/disagreement

2. **Reflection Agent** (`agents/reflection_agent.py`)
   - Analyzes conversation history
   - Tracks confidence per issue (requires 2 clear signals per issue)
   - Only becomes globally confident after minimum 5 turns
   - Returns structured Pydantic output:
     ```python
     class IssueConfidence(BaseModel):
         issue_name: str  # Must be from predefined list
         confidence_level: int  # Number of clear signals (0-2+)
         user_cares: bool  # True if user cares about this issue
     
     class ReflectionOutput(BaseModel):
         is_confident: bool  # True only if min 5 turns AND sufficient coverage
         turn_count: int
         confident_issues: List[str]  # Issues user cares about (2+ signals)
         uncertain_issues: List[str]  # Issues needing more exploration
         issue_details: List[IssueConfidence]  # Detailed breakdown
     ```

3. **Router Agent** (`agents/router_agent.py`)
   - Receives reflection output including uncertain_issues list
   - If is_confident == True: formats confirmation message
   - If is_confident == False: generates next strategic question focusing on uncertain issues
   - Prioritizes breadth early, depth later in conversation
   - Returns next message for conversation agent

**Workflow Orchestration** (`workflows/conversation_flow.py`):
```python
# Pseudo-code
is_confident = False
turn_count = 0

while is_confident is False and turn_count < 10:
    # Conversation Agent: ask question, get user response
    
    # Reflection Agent: analyze conversation
    reflection = reflection_agent.analyze(conversation_history)
    
    # Router Agent: decide next action
    next_message = router_agent.route(reflection)
    
    # Conversation Agent: present message
    if reflection.is_confident:
        # Present confirmation request
        user_confirms = get_user_confirmation()
        if user_confirms:
            break
        else:
            is_confident = False
            continue
    
    turn_count += 1

if turn_count >= 10:
    # Present best guess without asking for confirmation
    show_final_summary()
```

### Technical Components

**Configuration** (`config.py`):
- Model identifier: `"openai/gpt-4o-mini"`
- OpenRouter base URL: `https://openrouter.ai/api/v1`
- Environment variables for API keys
- Optional headers for OpenRouter leaderboard

**Telemetry** (`lib/telemetry.py`):
- Initialize `OpikTracer` for LangChain integration
- Provide utility functions for logging conversations
- Track metrics: turn count, confidence levels, identified issues
- Handle trace flushing and cleanup
- Integration pattern:
  ```python
  from opik.integrations.langchain import OpikTracer
  
  opik_tracer = OpikTracer(tags=["issue-discovery", "chatbot"])
  # Pass as callback to LangChain agent invocations
  ```

**Streamlit App** (`app.py`):
- Import telemetry setup
- Manage conversation state via `st.session_state`
- Render UI components (chat, progress, history)
- Handle user input and display agent responses

### LangChain Integration
- Use `ChatOpenAI` from `langchain_openai`
- Configure with OpenRouter base URL and API key
- Pass OpikTracer as callback for automatic tracing
- Structured output via Pydantic models

### Data Schemas (Pydantic)
All agent outputs use Pydantic for validation:
- Strict type checking
- Automatic validation
- Retry logic on validation failures (max 3 retries)

### Error Handling Strategy
1. **API Failures**: Show user-friendly error, allow retry
2. **Malformed Responses**: Pydantic validation with retry logic
3. **Rate Limiting**: Exponential backoff
4. **All Errors**: Logged to Opik for debugging

### Predefined Issues List
System validates against exactly these 15 issues:
1. The role of money in politics
2. Health care affordability
3. Inflation
4. Federal budget deficit
5. Poverty in America
6. Ability of Republicans and Democrats to work together/government dysfunction
7. Drug addiction/opioid crisis
8. Moral values/social values
9. Cost of living
10. Government corruption
11. Jobs and the economy
12. Taxes and government spending
13. Crime and public safety
14. Immigration
15. Racism/social equality

### File Structure
```
social_media_lurkers/
├── agents/
│   ├── __init__.py
│   ├── conversation_agent.py
│   ├── router_agent.py
│   └── reflection_agent.py
├── workflows/
│   ├── __init__.py
│   └── conversation_flow.py
├── lib/
│   ├── __init__.py
│   └── telemetry.py
├── prompts/
│   ├── v1_conversation_system.txt
│   ├── v1_reflection_system.txt
│   ├── v1_router_system.txt
│   └── README.md
├── config.py
├── app.py
├── pyproject.toml
├── .python-version
├── .env
├── .env.example
├── .gitignore
└── README.md
```

### Prompt Management & Versioning

**Storage Strategy:**
- Store all agent prompts in `prompts/` directory as `.txt` files
- Version prompts in git (automatic history, diffs, rollback)
- Naming convention: `v1_<agent>_<type>.txt`
  - Example: `v1_conversation_system.txt`, `v1_reflection_system.txt`, `v1_router_system.txt`

**File Structure:**
```
prompts/
├── v1_conversation_system.txt     # System prompt for conversation agent
├── v1_reflection_system.txt       # System prompt for reflection agent
├── v1_router_system.txt           # System prompt for router agent
└── README.md                       # Explains each prompt's purpose
```

**Integration:**
- Load prompts at runtime from files (not hardcoded in Python)
- Include prompt version in Opik trace metadata
- Update version number when prompts change materially (v1 → v2)

**Rationale:**
- Git provides automatic versioning and history
- Easy to review prompt changes in PRs
- Can correlate conversation quality with prompt versions
- Prompts deploy with code (no database dependency)
- Can iterate on prompts without changing code

### Dependency Versions

Pin major versions in `pyproject.toml`:

```toml
[project]
name = "social-media-lurkers"
version = "0.1.0"
requires-python = ">=3.10"

[project.dependencies]
streamlit = "^1.29.0"
langchain = "^0.1.0"
langchain-openai = "^0.0.5"
opik = "^0.1.0"
pydantic = "^2.5.0"
python-dotenv = "^1.0.0"

[tool.uv.dev-dependencies]
ruff = "^0.1.0"
```

**Model Configuration:**
- Model: `openai/gpt-4o-mini` via OpenRouter
- Rationale: Cost-effective for demo ($0.15/1M input tokens vs. $3/1M for GPT-4)
- Fallback: GPT-3.5-turbo if GPT-4o-mini unavailable (configurable in `config.py`)

### UI Enhancements for Demo

**Loading States:**
- Use `st.spinner("Thinking...")` while waiting for LLM responses
- Prevents awkward silence during 2-5 second API calls
- Shows user that system is processing

**Visual Progress:**
- Implement `st.progress(turn_count / 10)` visual progress bar
- Complement text "Turn 3 of 10" with visual indicator
- Creates sense of forward motion in conversation

**Conversation Reset:**
- Add button to restart conversation if it goes wrong
- Essential for live demos (things can go sideways)
- Simple implementation: clear `st.session_state` and `st.rerun()`

**Example UI Code Pattern:**
```python
# Show spinner during LLM call
with st.spinner("Thinking..."):
    response = agent.invoke(user_input)

# Show visual and text progress
st.progress(st.session_state.turn_count / 10)
st.write(f"Turn {st.session_state.turn_count} of 10")

# Reset button in sidebar
with st.sidebar:
    if st.button("🔄 Start Over"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()
```

### Implementation Constraints
- Must use Python 3.10+
- Must use uv for package management
- Must use ruff for linting
- Must validate all issues against predefined list
- Must use Pydantic for all data schemas
- Must trace all LLM calls via Opik
- Must store prompts in versioned files (not inline code)

### Historical Context
- New greenfield project, no legacy code
- Technology stack selected for demo purposes
- Pattern can be adapted for production use cases later

## 8. Compliance, Cost, GTM

### Privacy & Legal
- **Internal demo only**: No compliance requirements
- **Data handling**: User inputs sent to OpenRouter API (third-party)
- **Recommendation**: Include simple privacy disclaimer in UI
- **No PII collection**: No persistent storage, no user profiles

### Infrastructure Costs
- **OpenRouter API**: Pay-per-use, costs minimal for demo (GPT-4o-mini is inexpensive)
- **Opik**: Free tier available for development/demo use
- **Hosting**: Local Streamlit, no hosting costs

**Development & Testing Cost Estimate:**
- Development iterations: 20-30 test conversations
- Average conversation: 7 turns × 3 agents × 500 tokens ≈ 10,500 tokens
- Total dev tokens: ~300,000 tokens
- Cost at GPT-4o-mini rates ($0.15/1M input, $0.60/1M output):
  - Input: ~$0.05
  - Output: ~$0.10
  - **Total development cost: $0.10-0.25**
- Demo day costs (5-10 runs): **$0.01-0.02**
- **Overall estimated cost: $0.10-0.30** (very affordable)

### Launch / GTM
- **No launch required**: Internal demo only
- **No comms needed**: Direct demonstration to stakeholders
- **No support training**: Single developer maintains
- **No marketing**: Internal technical demonstration

### Team / Headcount
- **Single developer**: 6-10 hours estimated effort
- **No additional resources required**

## 9. Success Criteria

### Functional Success
- ✅ System completes conversation flow from welcome to conclusion
- ✅ Asks 5-10 dynamic questions that feel natural and empathetic
- ✅ Correctly identifies issues user cares about (validated via user confirmation)
- ✅ Handles edge cases:
  - Very short user responses (system continues gracefully)
  - Contradictory responses (reflection tracks per-issue confidence)
  - Maximum turns reached (presents best guess)
  - User disagrees with final assessment (allows iteration)

### Technical Success
- ✅ All three agents invoke successfully via LangChain
- ✅ Pydantic schemas validate all agent outputs
- ✅ Opik traces capture full conversation flow
- ✅ OpenRouter API calls succeed with proper error handling
- ✅ Code passes ruff linting
- ✅ README setup instructions work on fresh environment
- ✅ `.env.example` template is complete and accurate

### Quality Success
- ✅ Code is documented with clear docstrings
- ✅ Agent prompts are well-crafted and effective
- ✅ UI is clean and intuitive (even if basic)
- ✅ Demo showcases multi-agent value proposition clearly
- ✅ Conversation feels engaging, not robotic

### Demonstration Success
- ✅ Demo can be run reliably for stakeholders
- ✅ Showcases technical capabilities of multi-agent coordination
- ✅ Illustrates value of structured agentic workflows
- ✅ Demonstrates integration of modern AI tooling (LangChain, Opik, OpenRouter)

### Measurable Indicators (via Opik Telemetry)
- **Turn count**: 5-10 turns per conversation (target range)
- **Confidence convergence**: System reaches confidence by turn 7-8 on average
- **User confirmation rate**: >70% users agree with final assessment (aspirational)
- **Issue identification**: Average 3-5 issues identified per conversation
- **No crashes**: 0 unhandled exceptions during demo sessions

### Sign-off Criteria
- ✅ Manual testing shows stable, consistent behavior
- ✅ Demo can be presented to internal stakeholders
- ✅ Code is committed with documentation
- ✅ Developer can explain architecture and agent coordination

---

## Appendix: 15 Predefined Issues

For reference, the complete list of issues the system will identify:

1. The role of money in politics
2. Health care affordability
3. Inflation
4. Federal budget deficit
5. Poverty in America
6. Ability of Republicans and Democrats to work together/government dysfunction
7. Drug addiction/opioid crisis
8. Moral values/social values
9. Cost of living
10. Government corruption
11. Jobs and the economy
12. Taxes and government spending
13. Crime and public safety
14. Immigration
15. Racism/social equality

---

## Appendix A: Demo Testing Scenarios

Before presenting the demo, manually test these scenarios to ensure robustness:

### Scenario 1: Healthcare-Focused User
**Purpose**: Validate issue mapping and confidence building  
**User Input Pattern**: Clear, consistent healthcare concerns  
**Example**: 
- "I'm really worried about healthcare costs"
- "Medical bills are bankrupting families"
- "Insurance premiums keep going up"

**Expected Outcome**: 
- System identifies "Health care affordability" with high confidence
- May also identify "Cost of living"
- Converges in 5-7 turns

### Scenario 2: Multi-Issue User
**Purpose**: Validate multi-issue tracking and breadth coverage  
**User Input Pattern**: Mix of healthcare, inflation, and immigration concerns  
**Example**: 
- "Healthcare is too expensive and everything costs more"
- "Worried about border security too"
- "Can't afford groceries anymore"

**Expected Outcome**:
- System identifies 3-5 issues: "Health care affordability", "Inflation", "Cost of living", "Immigration"
- Demonstrates breadth of issue coverage
- Converges in 7-9 turns

### Scenario 3: Vague User
**Purpose**: Validate graceful handling of unclear responses  
**User Input Pattern**: Short, unclear, non-specific responses  
**Example**:
- "Things are tough"
- "I don't know"
- "Everything is bad"

**Expected Outcome**:
- Router generates clarifying questions
- System handles gracefully without crashing
- May take longer to converge (8-10 turns)
- Demonstrates edge case handling

### Scenario 4: Off-Topic User
**Purpose**: Validate issue mapping accuracy and graceful failure  
**User Input Pattern**: Talks about unrelated topics  
**Example**:
- "I love baseball"
- "The weather is nice today"
- "My favorite color is blue"

**Expected Outcome**:
- System attempts to redirect or asks clarifying questions
- Eventually identifies 0 issues or gives up gracefully
- Demonstrates that system doesn't hallucinate issues

### Scenario 5: Max Turns Reached
**Purpose**: Validate turn limit enforcement  
**User Input Pattern**: Give vague responses until 10 turns  
**Example**: Repeatedly say variations of "I'm not sure"

**Expected Outcome**:
- After 10 turns, system presents best guess without confirmation loop
- Shows message: "Here is what we think the most important issues are to you: [issues]"
- Demonstrates turn limit protection

### Scenario 6: User Disagreement
**Purpose**: Validate confirmation loop and iteration  
**User Input Pattern**: Disagree with final assessment  
**Example**: When system says "You care about X, Y, Z", respond "No, that's wrong"

**Expected Outcome**:
- System acknowledges disagreement
- Continues conversation to gather more information
- Demonstrates iteration capability

---

## Appendix B: Demo Preparation Checklist

### 30 Minutes Before Presentation

#### Environment Setup
- [ ] **API Keys Valid**: OpenRouter and Opik keys working
- [ ] **Streamlit Runs**: `streamlit run app.py` starts without errors
- [ ] **Opik Dashboard**: Can access and see previous traces
- [ ] **Internet Stable**: Connection is reliable
- [ ] **Laptop Charged**: Battery full or plugged in
- [ ] **Applications Closed**: Close unnecessary apps to prevent distractions
- [ ] **Full-Screen Mode**: Demo in full-screen for clean presentation

#### Rehearsal
- [ ] **Complete Run-Through**: Practice full demo script once
- [ ] **Test Scenario**: Run healthcare-focused scenario
- [ ] **Question Quality**: Verify questions are interesting and varied
- [ ] **Confirmation Works**: Test user confirmation step
- [ ] **Opik Traces**: Check that all three agents appear in traces
- [ ] **Timing**: Demo completes in < 5 minutes

#### Backup Plans
- [ ] **Backup Video**: Recorded demo video ready (in case of crash)
- [ ] **Pre-Loaded Opik**: Successful conversation trace open in browser tab
- [ ] **Quick Restart**: Know how to restart Streamlit (keep terminal visible)
- [ ] **Fallback Explanation**: Prepared to explain architecture without live demo

#### Demo Materials
- [ ] **Demo Script**: Talking points written down or memorized
- [ ] **Architecture Diagram**: Code snippets or diagram ready to show
- [ ] **Q&A Prep**: List of anticipated questions and answers ready

---

## Appendix C: Demo Presentation Script

### 5-Minute Demo Flow

#### Opening (30 seconds)
**Problem Statement:**
"Discovering what users care about typically requires lengthy surveys or interviews. We built a multi-agent AI system that can identify user priorities through natural conversation in under 10 questions."

**Value Proposition:**
"Three specialized AI agents work together: one converses, one reflects, one routes. Each has a specific role, and they coordinate automatically."

#### Live Demo (2-3 minutes)
**Setup:**
- Open Streamlit app
- Show clean interface with welcome message

**Conversation:**
- Type: "I'm really worried about healthcare costs and how much everything costs these days"
- Let system ask 2-3 follow-up questions
- Respond naturally with brief answers
- Continue for 5-7 turns total

**Reveal:**
- System presents: "Based on our conversation, you care about: Health care affordability, Cost of living, Inflation. Is this correct?"
- Confirm: "Yes, that's accurate"
- Show completion message

#### Behind the Scenes (1-2 minutes)
**Opik Dashboard:**
- Switch to Opik browser tab
- Show conversation trace tree
- Point out three agents: Conversation → Reflection → Router
- Highlight Pydantic schemas (structured communication)
- Show token usage and costs

**Architecture Explanation:**
- "Reflection agent tracks confidence per issue (needs 2 clear signals)"
- "Router agent uses uncertain issues to generate targeted questions"
- "All fully instrumented via Opik for debugging and optimization"

#### Value Proposition (30 seconds)
**Key Takeaways:**
- "Three agents, each with clear responsibility"
- "Discovers user priorities in 5-10 questions"
- "Fully observable and debuggable via Opik"
- "Architecture can be adapted for other discovery tasks"

#### Q&A (1 minute)
**Common Questions:**
- **Q**: "How accurate is it?" 
  - **A**: "Depends on prompt quality and conversation clarity; we track confirmation rate via telemetry"
- **Q**: "Could this scale to production?" 
  - **A**: "This is a demo, but architecture patterns apply; would need persistence, auth, etc."
- **Q**: "Can we try it?" 
  - **A**: "Absolutely! [Offer to let them try]"

---

**Spec Version:** 1.1  
**Created:** 2025-10-16  
**Updated:** 2025-10-16 (Post-Review)  
**Author**: AI Assistant (based on user braindump session)  
**Reviewers**: LLM Evaluation Platform Architect, Rapid Prototyper, MVP Frontend Demo Expert  
**Review Scores**: 86%, 94%, 83% (Average: 88%)  
**Status:** Approved - Ready for Implementation
