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
        self.opik_tracer = opik_tracer

    def get_opening_message(self) -> str:
        return self.conversation_agent.get_opening_message()

    @opik.track(project_name="Issue Discovery Chatbot")
    def _process_turn_with_trace(self, conversation_history: list, turn_count: int, reflection):
        """Process turn logic with Opik tracking"""
        # Update trace with thread_id
        if self.thread_id:
            opik_context.update_current_trace(
                thread_id=self.thread_id,
                tags=["streaming", "chatbot", "issue-discovery"]
            )
        
        # This method is just for creating the trace
        # The actual work is done in process_turn_streaming
        return {
            "turn_count": turn_count,
            "reflection": reflection,
            "thread_id": self.thread_id
        }

    def process_turn_streaming(self, conversation_history: list, turn_count: int):
        """
        Process one turn of the conversation with streaming.
        Yields: {
            'reflection': ReflectionOutput,
            'message_chunk': str,
            'is_complete': bool,
            'should_confirm': bool
        }
        """
        # Analyze conversation
        reflection = self.reflection_agent.analyze(conversation_history, turn_count)
        
        # Create trace for this turn
        self._process_turn_with_trace(conversation_history, turn_count, reflection)

        # Decide next action
        if turn_count >= config.MAX_TURNS:
            # Max turns reached - end conversation
            if reflection.confident_issues:
                next_message = f"Here is what we think the most important issues are to you: {', '.join(reflection.confident_issues)}"
            else:
                next_message = "We weren't able to identify specific issues from our conversation."
            should_confirm = False
            
            # Yield the complete message
            yield {
                'reflection': reflection,
                'message_chunk': next_message,
                'is_complete': True,
                'should_confirm': should_confirm
            }
            
            # Flush traces
            if self.opik_tracer:
                self.opik_tracer.flush()
                
        elif reflection.is_confident and not reflection.uncertain_issues:
            # Confident and no uncertain issues left - end conversation
            next_message = f"Based on our conversation, you care about: {', '.join(reflection.confident_issues)}. Thanks for sharing your thoughts!"
            should_confirm = False
            
            # Yield the complete message
            yield {
                'reflection': reflection,
                'message_chunk': next_message,
                'is_complete': True,
                'should_confirm': should_confirm
            }
            
            # Flush traces
            if self.opik_tracer:
                self.opik_tracer.flush()
        else:
            # Continue conversation - stream the response
            should_confirm = False
            message_buffer = ""
            
            for chunk in self.router_agent.route_streaming(reflection, conversation_history):
                message_buffer += chunk
                yield {
                    'reflection': reflection,
                    'message_chunk': chunk,
                    'is_complete': False,
                    'should_confirm': should_confirm
                }
            
            # Final yield to indicate completion
            yield {
                'reflection': reflection,
                'message_chunk': "",
                'is_complete': True,
                'should_confirm': should_confirm
            }
        
        # Flush traces to ensure they're sent to Opik
        if self.opik_tracer:
            self.opik_tracer.flush()

