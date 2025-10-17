from pathlib import Path

from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

import config


def load_prompt(filename: str) -> str:
    """Load prompt from prompts directory"""
    prompt_path = Path(__file__).parent.parent / "prompts" / filename
    return prompt_path.read_text().strip()


class ConversationAgent:
    def __init__(self, opik_tracer=None):
        self.llm = ChatOpenAI(
            model=config.MODEL_NAME,
            openai_api_key=config.OPENROUTER_API_KEY,
            openai_api_base=config.OPENROUTER_BASE_URL,
            temperature=0.7
        )
        self.system_prompt = load_prompt("v1_conversation_system.txt")
        self.opik_tracer = opik_tracer

    def get_opening_message(self) -> str:
        """Extract and return the hardcoded opening question"""
        return "Hey! I'd love to learn what issues matter most to you. When you think about what's happening in the country, what's been on your mind lately?"

    def generate_response(self, conversation_history: list, next_prompt: str = None) -> str:
        """Generate next response based on conversation history"""
        messages = [SystemMessage(content=self.system_prompt)]

        for msg in conversation_history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))

        if next_prompt:
            messages.append(HumanMessage(content=f"[INSTRUCTION: {next_prompt}]"))

        callbacks = [self.opik_tracer] if self.opik_tracer else []
        response = self.llm.invoke(messages, config={"callbacks": callbacks})
        return response.content

