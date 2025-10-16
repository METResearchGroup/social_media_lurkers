# Brain Dump: Issue Discovery Chatbot Demo

## Project Overview
Build a Streamlit-based chatbot demo that uses a multi-agent architecture to discover what political/social issues users care about through dynamic, guided questioning.

## Core Concept
- Multi-turn conversation (max 10 turns) that iteratively learns about user's issue priorities
- Uses three agents working in coordination:
  1. **Conversation Agent**: Manages user interaction and question generation
  2. **Reflection Agent**: Analyzes conversation to determine confidence and guess issues
  3. **Router Agent**: Decides next action based on confidence level
- At end, presents discovered issues and asks for user confirmation
- Allows for correction/iteration if user disagrees with assessment

## Predefined Issues List
The system should identify which of these 15 issues the user cares about:
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

## Technology Stack
- **UI Framework**: Streamlit
- **Agent Framework**: LangChain
- **Schema Validation**: Pydantic
- **Telemetry/Observability**: Opik
- **LLM API**: OpenRouter
- **Package Management**: uv
- **Linting**: ruff
- **Documentation**: Exa MCP (if needed for updated docs)

## Architecture Design

### High-Level Flow
```
Initialize conversation
is_confident = False
turn_count = 0

while is_confident is False and turn_count < 10:
    # Conversation Agent
    - Ask question
    - Get user response
    
    # Reflection Agent
    - Analyze conversation history
    - Output: {
        "is_confident": bool,
        "issues": [list of identified issues]
      }
    
    # Router Agent
    - Check is_confident
    - If True: prepare final confirmation message
    - If False: generate next question to ask
    - Return next message to conversation agent
    
    # Conversation Agent (continuation)
    - Present message to user
    - If confirmation request and user agrees: done
    - If confirmation request and user disagrees: is_confident = False, continue
    
    turn_count += 1

if turn_count >= 10:
    Present best guess of issues without asking for confirmation
```

### Agent Responsibilities

#### Conversation Agent (`agents/conversation_agent.py`)
- Manages the dialogue with the user
- Asks dynamic, contextual questions based on conversation history
- Stores conversation state
- Presents final issue list for confirmation
- Handles user agreement/disagreement

#### Reflection Agent (`agents/reflection_agent.py`)
- Analyzes the conversation history
- Tracks confidence PER ISSUE (requires 2 clear signals per issue)
- Only becomes globally confident after minimum 5 turns
- Returns structured output:
  ```python
  class IssueConfidence(BaseModel):
      issue_name: str  # Must be from predefined list
      confidence_level: int  # Number of clear signals (0-2+)
      user_cares: bool  # True if user cares about this issue
  
  class ReflectionOutput(BaseModel):
      is_confident: bool  # True only if min 5 turns AND sufficient issue coverage
      turn_count: int
      confident_issues: List[str]  # Issues user cares about (with 2+ signals)
      uncertain_issues: List[str]  # Issues needing more exploration
      issue_details: List[IssueConfidence]  # Detailed breakdown
  ```
- Uses conversation context to determine if enough information has been gathered
- Maps user responses to specific issues from the predefined list
- Provides granular feedback to router agent about which areas need more exploration

#### Router Agent (`agents/router_agent.py`)
- Receives reflection output including uncertain_issues list
- If `is_confident == True`:
  - Formats confirmation message: "Based on our conversation, you care about: [issues]. Is this correct?"
- If `is_confident == False`:
  - Uses `uncertain_issues` list to strategically generate next question
  - Focuses questions on issues that need more signals (confidence_level < 2)
  - Considers: which issues haven't been explored, what areas need clarification
  - Prioritizes breadth early, depth later in conversation
- Returns next message for conversation agent to present

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
│   └── conversation_flow.py  # Orchestrates the main loop
├── lib/
│   ├── __init__.py
│   └── telemetry.py  # Opik-specific setup and logging utilities
├── config.py  # Model config (GPT-4o-mini via OpenRouter)
├── app.py  # Streamlit UI entry point (imports telemetry for conversation logging)
├── pyproject.toml  # uv package management
├── .python-version
├── .env  # Local environment variables (gitignored)
├── .env.example  # Template for API keys (OpenRouter, Opik)
├── .gitignore  # Ignore .env, __pycache__, etc.
└── README.md  # Includes Opik setup instructions and quick start
```

## Implementation Details (Based on User Input)

### Model Configuration
- **Model**: GPT-4o-mini via OpenRouter API
- **Config File**: `config.py` will centralize model settings
  - Model identifier: `"openai/gpt-4o-mini"`
  - OpenRouter base URL: `https://openrouter.ai/api/v1`
  - Environment variable: `OPENROUTER_API_KEY`
  - Optional headers for OpenRouter: `HTTP-Referer`, `X-Title`
- **LangChain Integration**:
  - Use `ChatOpenAI` from `langchain_openai`
  - Configure with OpenRouter base URL and API key
  - Can use with Opik's `track_openai` wrapper for automatic tracing
- **API Documentation**: Retrieved via Exa MCP

### Confidence Logic
- **Per-Issue Tracking**: Reflection agent tracks confidence for each of 15 issues individually
- **Signal Threshold**: Requires 2 clear signals per issue to be confident about that issue
- **Global Confidence**: 
  - Minimum 5 conversation turns required
  - System becomes confident when it has enough issue coverage (to be defined in spec)
- **Uncertain Issues**: Router agent receives list of issues needing more exploration

### UI Requirements
- **Chat Interface**: Basic conversational interface
- **Progress Bar**: Show turn count (e.g., "Turn 3 of 10")
- **History Panel**: Display conversation history for user reference
- **Conversation Tone**: Casual and empathetic

### Initial Question
- **Approach**: Hardcoded opening question (to be determined during implementation)
- **Example**: Could be something like "Hey! I'd love to learn what issues matter most to you. What's been on your mind lately when you think about the state of things?"

### Opik Integration
- **Setup**: Include setup instructions in README
  - Install: `pip install opik`
  - Configure: `opik configure` (sets up API keys)
  - Environment variable: `OPIK_API_KEY`
- **Telemetry Module**: `lib/telemetry.py`
  - Initializes `OpikTracer` for LangChain integration
  - Provides utility functions for logging conversations
  - Tracks key metrics (turn count, confidence levels, identified issues, etc.)
  - Handles trace flushing and cleanup
- **Integration Pattern**:
  - Import telemetry setup in `app.py`
  - Pass `OpikTracer` as callback to LangChain agents
  - Log conversation start/end events
  - Track per-turn metrics and agent invocations

### Package Management (uv)
- **Core Dependencies**:
  - `streamlit` - UI framework
  - `langchain` - Agent framework
  - `langchain-openai` - OpenAI/OpenRouter integration
  - `opik` - Telemetry and tracing
  - `pydantic` - Schema validation
  - `python-dotenv` - Environment variable management
  - `ruff` - Linting (dev dependency)
- **Python Version**: Use Python 3.10+ (per user rules)
- **Project Setup**: `uv init` and `uv add <package>`

### Environment Variables
- **Required**:
  - `OPENROUTER_API_KEY` - API key for OpenRouter
  - `OPIK_API_KEY` - API key for Opik (or configured via `opik configure`)
- **Optional**:
  - `HTTP_REFERER` - Site URL for OpenRouter leaderboard
  - `X_TITLE` - Site name for OpenRouter leaderboard
- **File**: `.env` (with `.env.example` template in repo)

## Key Questions and Considerations

### 1. Conversation Strategy (RESOLVED)
- ✅ Start with hardcoded opening question (casual/empathetic tone)
- ✅ Prioritize breadth early, then depth based on uncertain_issues feedback
- Router agent generates dynamic follow-ups based on reflection output
- Questions should feel natural, not repetitive or leading

### 2. Confidence Determination (RESOLVED)
- ✅ 2 clear signals per issue + minimum 5 turns overall
- ✅ Users can care about 1 to all 15 issues - no constraints
- Handle ambiguity through per-issue confidence tracking

### 3. Issue Validation
- Issues strictly limited to the 15 predefined ones
- Reflection agent must map user language to official issue names
- Consider fuzzy matching or LLM-based mapping (e.g., "healthcare costs" → "Health care affordability")

### 4. User Experience (RESOLVED)
- ✅ Progress indicator: "Turn X of 10"
- ✅ Conversation history visible in dedicated panel
- Consider: Restart button (defer to implementation phase)
- Consider: Handling of very short/unhelpful responses (router agent should handle)

### 5. Technical Implementation Details (RESOLVED)
- ✅ Model: GPT-4o-mini via OpenRouter
- ✅ State management: Streamlit session_state
- Conversation persistence: Not required for demo (out of scope)
- Prompt structure: To be defined in spec phase
- Consider shared prompt template base for consistency

### 6. Opik Integration (RESOLVED)
- ✅ Include Opik with setup instructions
- Track metrics:
  - Turn count per conversation
  - Issues identified per conversation
  - Confidence level progression
  - User confirmation rate (agree vs. disagree)
  - Token usage per agent (if available)
- Full conversation trace logging for debugging

### 7. Error Handling
- OpenRouter API failures: Show user-friendly error, allow retry
- Malformed LLM responses: Pydantic validation with retry logic (max 3 retries)
- Rate limiting: Handle gracefully with exponential backoff
- All errors should be logged to Opik

### 8. Demo Presentation (RESOLVED)
- ✅ Target: Internal use
- ✅ Value proposition: Multi-agent coordination for issue discovery
- Analytics/visualization: Not required for MVP (out of scope)
- Single conversation per run (can restart app for new conversation)

### 9. Testing and Validation (RESOLVED)
- ✅ Manual testing is sufficient
- Success criteria: Completes conversation flow, identifies issues accurately, feels natural
- No automated test scenarios needed for demo

### 10. Data Privacy
- For internal demo: Privacy not a primary concern
- No persistent storage of conversations (out of scope)
- Consider adding simple disclaimer about data being sent to OpenRouter API

## Scope Boundaries

### In Scope
- Single-user conversation flow
- 15 predefined issues only
- Maximum 10 conversation turns
- Basic Streamlit UI (functional, not necessarily beautiful)
- Three-agent architecture as specified
- Opik telemetry integration
- Issue validation against predefined list
- User confirmation flow

### Out of Scope (for initial demo)
- Multi-user/multi-session management
- Persistent storage of conversations
- Issue prioritization/ranking (just identification)
- Follow-up actions based on issues
- Advanced UI/UX features
- Authentication/user profiles
- Issue definitions or educational content
- Recommendation engine based on issues
- A/B testing different conversation strategies
- Production deployment considerations

### Potential Future Enhancements
- Issue importance ranking (not just identification)
- Conversation analytics dashboard
- Export conversation transcripts
- Support for custom issues beyond the 15
- Multi-language support
- Voice interface
- Integration with actual civic engagement platforms
- Demographic data collection for analysis

## Constraints and Requirements

### Technical Constraints
- Must use specified tech stack (no substitutions)
- Must complete within 10 turns maximum
- Must validate issues against predefined list
- Must use Pydantic for all data schemas
- Must use uv for package management

### Functional Requirements
- Dynamic question generation (not scripted)
- Multi-agent coordination as specified
- User confirmation step before completion
- Ability to correct/iterate on final answer
- Graceful handling of max turn limit

### Non-Functional Requirements
- Demo should feel conversational and natural
- Questions should not be repetitive
- Response time should be reasonable (< 5 seconds per turn?)
- System should be easy to run locally (for demo purposes)

## Known Risks and Mitigations

### Risk 1: LLM Generates Poor Questions
- **Mitigation**: Carefully craft system prompts with examples
- **Mitigation**: Add question quality reflection in router agent

### Risk 2: Conversation Doesn't Converge Within 10 Turns
- **Mitigation**: Design confidence criteria that favor earlier convergence
- **Mitigation**: Router agent should strategically cover multiple issues per question

### Risk 3: Issue Mapping Ambiguity
- **Mitigation**: Provide clear issue descriptions in reflection agent prompt
- **Mitigation**: Use structured output with validation

### Risk 4: User Confusion About Purpose
- **Mitigation**: Clear introductory message explaining the demo
- **Mitigation**: Progress indicators and transparent process

### Risk 5: API Rate Limits/Failures
- **Mitigation**: Implement error handling and retry logic
- **Mitigation**: Use appropriate OpenRouter tier/model

## Success Criteria

This demo will be considered successful if:
1. ✅ Completes a full conversation flow from start to finish
2. ✅ Asks varied, contextually relevant questions
3. ✅ Correctly identifies issues user cares about (based on user confirmation)
4. ✅ Handles edge cases (very short responses, contradictions, max turns)
5. ✅ All three agents work together seamlessly
6. ✅ Opik telemetry captures key metrics
7. ✅ Code is clean, documented, and follows best practices
8. ✅ Demo is impressive and demonstrates multi-agent coordination value

## Timeline and Effort Estimate

**Rough Estimate**: 6-10 hours total
- Agent implementation: 3-4 hours
- Workflow orchestration: 1-2 hours
- Streamlit UI: 1-2 hours
- Opik integration: 1 hour
- Testing and refinement: 1-2 hours

**Target**: Single focused work session or split across 2 sessions

## Open Questions for User - ANSWERED

1. **Audience and Context**: Who will you be presenting this demo to, and what's the key message you want to convey?
   - ✅ **ANSWER**: Demo is for internal use.

2. **Conversation Style**: Do you have a preference for how the chatbot should "sound"?
   - ✅ **ANSWER**: Casual and empathetic.

3. **Initial Question**: Should the bot start with a specific opening question, or generate it dynamically?
   - ✅ **ANSWER**: Start with a specific hardcoded question (to be determined during implementation).

4. **Issue Granularity**: Can a user care about only 1 issue? Should we aim to identify a minimum number?
   - ✅ **ANSWER**: Users can care about 1 or multiple issues. Reflection agent should track confidence per issue and inform router agent which specific issues it's NOT confident about, so router can ask targeted follow-up questions.

5. **Confidence Threshold**: Any preferences on when reflection agent should become confident?
   - ✅ **ANSWER**: 2 clear signals per issue + minimum 5 turns before overall confidence.

6. **OpenRouter Model**: Which model should we use?
   - ✅ **ANSWER**: GPT-4o-mini via OpenRouter API. Use Exa MCP to get current OpenRouter API documentation. Create a `config.py` to define the model.

7. **UI Features**: Beyond basic chat, any specific UI elements you want?
   - ✅ **ANSWER**: Basic chat + progress bar + conversation history panel.

8. **Opik Account**: Do you already have Opik set up, or do we need to include setup instructions?
   - ✅ **ANSWER**: Need to add Opik with setup instructions.

9. **Testing Strategy**: Should we build any automated tests, or is manual testing sufficient for demo purposes?
   - ✅ **ANSWER**: Manual testing is sufficient.

10. **Demo Data**: Do you want sample conversation scenarios prepared for the demo presentation?
    - ✅ **ANSWER**: No pre-prepared sample conversations needed.

## Next Steps

Once this brain dump is approved:
1. Create formal specification document (`spec.md`)
2. Set up Linear project and ticket
3. Create project folder structure
4. Begin implementation following the spec
