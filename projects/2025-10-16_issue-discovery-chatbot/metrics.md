# Metrics: Issue Discovery Chatbot

**Ticket**: [MET-61](https://linear.app/metresearch/issue/MET-61)  
**Project**: Issue Discovery Chatbot Demo

---

## Development Metrics

### Time Tracking

| Phase | Estimated | Actual | Variance | Notes |
|-------|-----------|--------|----------|-------|
| Planning | - | 2h | - | Braindump, spec, reviews, Linear setup |
| Scaffolding | 1-2h | TBD | - | Project init, dependencies, structure |
| Agents | 3-4h | TBD | - | Three agents + prompts |
| Workflow & UI | 1-2h | TBD | - | Orchestration + Streamlit |
| Telemetry | 1h | TBD | - | Opik integration |
| Testing & Demo Prep | 1-2h | TBD | - | Test scenarios + rehearsal |
| **Total** | **6-10h** | **TBD** | **-** | Excludes 2h planning |

### Cost Tracking

| Category | Estimated | Actual | Notes |
|----------|-----------|--------|-------|
| Development API Calls | $0.10-0.25 | TBD | Prompt iteration, testing |
| Demo Day | $0.01-0.02 | TBD | 5-10 demo runs |
| **Total** | **$0.10-0.30** | **TBD** | GPT-4o-mini rates |

---

## Functional Metrics

### Conversation Quality

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Average turn count | 5-10 | TBD | - |
| Conversation completion rate | 100% | TBD | - |
| User confirmation rate | >70% | TBD | Aspirational |
| Issues identified per conversation | 3-5 | TBD | - |
| Questions feel natural (subjective) | Yes | TBD | Manual assessment |

### Technical Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| All agents work via LangChain | ✅ | TBD | - |
| Pydantic schema validation success | 100% | TBD | - |
| Opik trace completeness | 100% | TBD | - |
| API retry success rate | >90% | TBD | - |
| Ruff linting passes | ✅ | TBD | - |
| Average LLM response time | 2-5s | TBD | - |

### Demo Readiness

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Demo duration | < 5 min | TBD | - |
| Demo crashes | 0 | TBD | - |
| Test scenarios passing | 6/6 | TBD | - |
| Rehearsal completions | ≥3 | TBD | - |
| Backup materials ready | ✅ | TBD | Video, pre-loaded Opik |

---

## Test Scenario Results

### Scenario 1: Healthcare-Focused User
- **Status**: Not tested
- **Outcome**: TBD
- **Issues identified**: TBD
- **Turn count**: TBD
- **User confirmed**: TBD

### Scenario 2: Multi-Issue User
- **Status**: Not tested
- **Outcome**: TBD
- **Issues identified**: TBD
- **Turn count**: TBD
- **User confirmed**: TBD

### Scenario 3: Vague User
- **Status**: Not tested
- **Outcome**: TBD
- **Turn count**: TBD
- **Handled gracefully**: TBD

### Scenario 4: Off-Topic User
- **Status**: Not tested
- **Outcome**: TBD
- **False positives**: TBD
- **Handled gracefully**: TBD

### Scenario 5: Max Turns
- **Status**: Not tested
- **Turn limit enforced**: TBD
- **Best guess presented**: TBD

### Scenario 6: User Disagreement
- **Status**: Not tested
- **Iteration worked**: TBD
- **Final outcome**: TBD

---

## Opik Telemetry Metrics

_(To be collected from Opik dashboard after implementation)_

### Conversation Traces
- Total traces captured: TBD
- Average trace completeness: TBD
- Agent invocations logged: TBD

### Token Usage
- Average tokens per conversation: TBD
- Tokens by agent:
  - Conversation agent: TBD
  - Reflection agent: TBD
  - Router agent: TBD

### Cost Analysis
- Cost per conversation: TBD
- Most expensive agent: TBD
- Cost optimization opportunities: TBD

---

## Success Criteria Checklist

### Functional Success
- [ ] Completes conversation flow end-to-end
- [ ] Asks 5-10 dynamic questions
- [ ] Correctly identifies issues (validated via confirmation)
- [ ] Handles all 6 edge case scenarios

### Technical Success
- [ ] All three agents invoke via LangChain
- [ ] Pydantic validates all outputs
- [ ] Opik captures full traces
- [ ] Code passes ruff linting
- [ ] README setup works on fresh environment

### Demo Success
- [ ] Demo runs reliably
- [ ] Completes in < 5 minutes
- [ ] Showcases multi-agent coordination (visible in Opik)
- [ ] Questions feel engaging

---

## Retrospective Metrics

_(To be filled after project completion)_

### What We Measured Well
- TBD

### What We Should Have Measured
- TBD

### Surprising Insights from Data
- TBD

---

**Last Updated**: 2025-10-16 (Planning Phase)  
**Next Update**: After implementation completion

