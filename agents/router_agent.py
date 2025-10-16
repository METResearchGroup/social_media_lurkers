from pathlib import Path

from langchain.schema import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

import config
from agents import ReflectionOutput


def load_prompt(filename: str) -> str:
    prompt_path = Path(__file__).parent.parent / "prompts" / filename
    return prompt_path.read_text().strip()


class RouterAgent:
    def __init__(self, opik_tracer=None):
        self.llm = ChatOpenAI(
            model=config.MODEL_NAME,
            openai_api_key=config.OPENROUTER_API_KEY,
            openai_api_base=config.OPENROUTER_BASE_URL,
            temperature=0.7
        )
        self.system_prompt = load_prompt("v1_router_system.txt")
        self.opik_tracer = opik_tracer

    def route(self, reflection: ReflectionOutput, conversation_history: list) -> str:
        """Decide next action and return message for user"""
        reflection_summary = f"""
is_confident: {reflection.is_confident}
turn_count: {reflection.turn_count}
confident_issues: {reflection.confident_issues}
uncertain_issues: {reflection.uncertain_issues}
"""

        prompt = f"""Based on this reflection:

{reflection_summary}

And this conversation history:
{self._format_history(conversation_history)}

What should we do next? Generate the appropriate message."""

        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=prompt)
        ]

        callbacks = [self.opik_tracer] if self.opik_tracer else []
        response = self.llm.invoke(messages, config={"callbacks": callbacks})
        return response.content

    def _format_history(self, history: list) -> str:
        return "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-4:]])

