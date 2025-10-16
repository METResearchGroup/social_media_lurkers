import opik
from opik import opik_context

import config
from agents.conversation_agent import ConversationAgent
from agents.reflection_agent import ReflectionAgent
from agents.router_agent import RouterAgent


class ConversationFlow:
    def __init__(self, opik_tracer=None, thread_id=None):
        self.conversation_agent = ConversationAgent(opik_tracer)
        self.reflection_agent = ReflectionAgent(opik_tracer)
        self.router_agent = RouterAgent(opik_tracer)
        self.thread_id = thread_id

    def get_opening_message(self) -> str:
        return self.conversation_agent.get_opening_message()

    @opik.track(project_name="Issue Discovery Chatbot")
    def process_turn(self, conversation_history: list, turn_count: int) -> dict:
        """
        Process one turn of the conversation.
        Returns: {
            'reflection': ReflectionOutput,
            'next_message': str,
            'should_confirm': bool
        }
        """
        # Set thread_id to group all turns from this conversation together
        if self.thread_id:
            opik_context.update_current_trace(
                thread_id=self.thread_id,
                tags=["issue-discovery", "chatbot", "demo"]
            )

        # Analyze conversation
        reflection = self.reflection_agent.analyze(conversation_history, turn_count)

        # Decide next action
        if reflection.is_confident or turn_count >= config.MAX_TURNS:
            # Generate confirmation message or final summary
            if reflection.is_confident and turn_count < config.MAX_TURNS:
                next_message = self.router_agent.route(reflection, conversation_history)
                should_confirm = True
            else:
                # Max turns reached
                if reflection.confident_issues:
                    next_message = f"Here is what we think the most important issues are to you: {', '.join(reflection.confident_issues)}"
                else:
                    next_message = "We weren't able to identify specific issues from our conversation."
                should_confirm = False
        else:
            # Generate next question
            next_message = self.router_agent.route(reflection, conversation_history)
            should_confirm = False

        return {
            'reflection': reflection,
            'next_message': next_message,
            'should_confirm': should_confirm
        }

