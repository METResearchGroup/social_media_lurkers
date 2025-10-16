# Issue Discovery Chatbot Demo

**Linear Project**: [Issue Discovery Chatbot Demo](https://linear.app/metresearch/project/issue-discovery-chatbot-demo-9b8e862f59a1)  
**Ticket**: [MET-61](https://linear.app/metresearch/issue/MET-61/build-multi-agent-issue-discovery-chatbot-demo)  
**Created**: 2025-10-16  
**Status**: Planning Complete - Ready for Implementation

## Overview

Multi-agent Streamlit chatbot that discovers which of 15 predefined political/social issues users care about through natural conversation (5-10 turns). Showcases multi-agent AI coordination using LangChain and Opik for telemetry.

## Quick Links

- **Spec**: [spec.md](./spec.md) - Full technical specification (v1.1)
- **Reviews**: [spec_reviews.md](./spec_reviews.md) - Three persona reviews
- **Synthesis**: [review_synthesis.md](./review_synthesis.md) - Consolidated feedback
- **Braindump**: [braindump.md](./braindump.md) - Initial brainstorming session

## Architecture

**Three Agents**:
1. **Conversation Agent**: Manages dialogue, asks questions, handles user interaction
2. **Reflection Agent**: Analyzes conversation, tracks per-issue confidence
3. **Router Agent**: Decides next action based on confidence (confirm or ask more)

**Technology Stack**:
- UI: Streamlit
- Agents: LangChain + langchain-openai
- LLM: OpenRouter (GPT-4o-mini)
- Telemetry: Opik
- Validation: Pydantic
- Package Management: uv
- Linting: ruff

## Timeline

**Estimate**: 6-10 hours total

**Milestones**:
1. Scaffolding (1-2h): Project setup, folder structure, schemas
2. Agents (3-4h): Implement three agents and prompts
3. Workflow & UI (1-2h): Orchestration loop, Streamlit interface
4. Telemetry & Polish (1h): Opik integration, error handling
5. Testing & Demo Prep (1-2h): Test scenarios, demo script, rehearsal

## Success Criteria

- ✅ Completes conversation in 5-10 turns
- ✅ Correctly identifies user's issues (validated via confirmation)
- ✅ All three agents coordinate seamlessly
- ✅ Full observability via Opik
- ✅ Demo-ready presentation (< 5 minutes)

## Tickets

- **MET-61**: Build multi-agent issue discovery chatbot demo  
  - [Linear Ticket](https://linear.app/metresearch/issue/MET-61)
  - Status: Backlog
  - Priority: Urgent
  - Single comprehensive ticket - all work in one session

## Implementation Notes

- Store prompts in `prompts/` directory (git-versioned)
- Pin dependency versions in `pyproject.toml`
- Test all 6 demo scenarios before presentation
- Follow demo preparation checklist (Appendix B in spec)
- Rehearse with demo script (Appendix C in spec)

## Review Scores

- **LLM Evaluation Platform Architect**: 30/35 (86%)
- **Rapid Prototyper**: 33/35 (94%)
- **MVP Frontend Demo Preparation Expert**: 29/35 (83%)
- **Average**: 88% - Approved for Implementation

## Files

```
projects/2025-10-16_issue-discovery-chatbot/
├── spec.md                      # Technical specification (v1.1)
├── braindump.md                 # Initial brainstorming session
├── spec_reviews.md              # Three persona reviews (1,730 lines)
├── review_synthesis.md          # Consolidated feedback
├── README.md                    # This file
├── todo.md                      # Task checklist
├── plan_issue_discovery.md      # Detailed task plan
├── logs.md                      # Development log
├── lessons_learned.md           # Insights and improvements
├── metrics.md                   # Performance tracking
└── retrospective/
    └── README.md                # Ticket retrospectives
```

