# Issue Discovery Chatbot Demo

Multi-agent Streamlit chatbot that discovers which of 15 predefined political/social issues users care about through natural conversation.

## Quick Start

### Prerequisites
- Python 3.10+
- uv package manager

### Setup

1. Clone and navigate to project:
   ```bash
   cd /path/to/social_media_lurkers
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Configure environment:
   ```bash
   cp env.example .env
   # Edit .env and add your API keys:
   # - OPENROUTER_API_KEY (from https://openrouter.ai/keys)
   # - OPIK_API_KEY (from https://www.comet.com/opik or run `opik configure`)
   ```

4. Run the app:
   ```bash
   streamlit run app.py
   ```

## Architecture

Three agents coordinate via LangChain:
- **Conversation Agent**: Asks questions, maintains dialogue
- **Reflection Agent**: Analyzes conversation, tracks per-issue confidence
- **Router Agent**: Decides next action (confirm or explore more)

## Tech Stack

- UI: Streamlit
- Agents: LangChain + OpenRouter (GPT-4o-mini)
- Telemetry: Opik
- Validation: Pydantic

## Testing

Manual testing with 6 scenarios (see spec.md Appendix A):
1. Healthcare-focused user
2. Multi-issue user
3. Vague user
4. Off-topic user
5. Max turns reached
6. User disagreement

## License

Internal demo project.

