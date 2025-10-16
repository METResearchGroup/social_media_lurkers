import json
from pathlib import Path

from langchain.schema import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

import config
from agents import ReflectionOutput


def load_prompt(filename: str) -> str:
    prompt_path = Path(__file__).parent.parent / "prompts" / filename
    return prompt_path.read_text().strip()


class ReflectionAgent:
    def __init__(self, opik_tracer=None):
        self.llm = ChatOpenAI(
            model=config.MODEL_NAME,
            openai_api_key=config.OPENROUTER_API_KEY,
            openai_api_base=config.OPENROUTER_BASE_URL,
            temperature=0.3
        )
        self.system_prompt = load_prompt("v1_reflection_system.txt")
        self.opik_tracer = opik_tracer

    def analyze(self, conversation_history: list, turn_count: int) -> ReflectionOutput:
        """Analyze conversation and return reflection output"""
        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}" for msg in conversation_history
        ])

        prompt = f"""Analyze this conversation (Turn {turn_count}/{config.MAX_TURNS}):

{conversation_text}

Return a JSON object matching the ReflectionOutput schema."""

        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=prompt)
        ]

        callbacks = [self.opik_tracer] if self.opik_tracer else []
        response = self.llm.invoke(messages, config={"callbacks": callbacks})

        # Parse JSON response and validate with Pydantic
        try:
            data = json.loads(response.content)
            return ReflectionOutput(**data)
        except Exception:
            # Fallback if parsing fails
            return ReflectionOutput(
                is_confident=False,
                turn_count=turn_count,
                confident_issues=[],
                uncertain_issues=config.ISSUES,
                issue_details=[]
            )

