import uuid

import streamlit as st

import config
from lib.telemetry import init_opik_tracer
from workflows.conversation_flow import ConversationFlow

st.set_page_config(page_title="Issue Discovery Chatbot", page_icon="💬")

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'turn_count' not in st.session_state:
    st.session_state.turn_count = 0
if 'thread_id' not in st.session_state:
    # Generate unique thread_id for this conversation session
    st.session_state.thread_id = str(uuid.uuid4())
if 'conversation_flow' not in st.session_state:
    opik_tracer = init_opik_tracer()
    st.session_state.conversation_flow = ConversationFlow(
        opik_tracer,
        thread_id=st.session_state.thread_id
    )
if 'awaiting_confirmation' not in st.session_state:
    st.session_state.awaiting_confirmation = False
if 'conversation_complete' not in st.session_state:
    st.session_state.conversation_complete = False

# Sidebar
with st.sidebar:
    st.title("🔄 Controls")
    if st.button("Start Over"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()

    st.divider()
    st.metric("Turn", f"{st.session_state.turn_count}/{config.MAX_TURNS}")
    st.progress(st.session_state.turn_count / config.MAX_TURNS)

    st.divider()
    st.caption("📊 Conversation Thread")
    st.code(st.session_state.thread_id, language=None)
    st.caption("Use this ID to find traces in Opik")

# Main chat interface
st.title("💬 Issue Discovery Chatbot")
st.caption("A multi-agent demo to discover what issues matter to you")

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Handle opening message
if len(st.session_state.messages) == 0:
    opening = st.session_state.conversation_flow.get_opening_message()
    st.session_state.messages.append({"role": "assistant", "content": opening})
    with st.chat_message("assistant"):
        st.markdown(opening)

# Chat input
if not st.session_state.conversation_complete:
    if prompt := st.chat_input("Your response..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Increment turn
        st.session_state.turn_count += 1

        # Process turn
        with st.spinner("Thinking..."):
            result = st.session_state.conversation_flow.process_turn(
                st.session_state.messages,
                st.session_state.turn_count
            )

        # Add assistant response
        st.session_state.messages.append({
            "role": "assistant",
            "content": result['next_message']
        })

        with st.chat_message("assistant"):
            st.markdown(result['next_message'])

        # Check if conversation is complete
        if result['should_confirm']:
            st.session_state.awaiting_confirmation = True
        elif st.session_state.turn_count >= config.MAX_TURNS:
            st.session_state.conversation_complete = True

        st.rerun()
else:
    st.info("Conversation complete. Click 'Start Over' to begin a new conversation.")

