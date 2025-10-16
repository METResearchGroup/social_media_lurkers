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
if 'conversation_complete' not in st.session_state:
    st.session_state.conversation_complete = False
if 'last_reflection' not in st.session_state:
    st.session_state.last_reflection = None

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

    # Real-time issue detection visualization
    st.divider()
    st.subheader("🎯 Issue Detection")
    
    if st.session_state.last_reflection:
        reflection = st.session_state.last_reflection
        
        # Overall confidence status
        if reflection.is_confident:
            st.success("✅ **AI is CONFIDENT**")
        else:
            st.info("🔍 **AI is still exploring...**")
        
        # Confident issues
        if reflection.confident_issues:
            st.markdown("### ✅ Identified Issues")
            for issue in reflection.confident_issues:
                st.markdown(f"- **{issue}**")
        else:
            st.caption("_No issues identified yet_")
        
        # Issue details with confidence levels
        if reflection.issue_details:
            with st.expander("📊 Confidence Details", expanded=False):
                for detail in reflection.issue_details:
                    if detail.user_cares:
                        emoji = "✅" if detail.confidence_level >= config.SIGNALS_PER_ISSUE else "🔍"
                        st.markdown(f"{emoji} **{detail.issue_name}**")
                        st.progress(min(detail.confidence_level / 2, 1.0))
                        st.caption(f"{detail.confidence_level} signal(s)")
    else:
        st.caption("_Start chatting to see AI's analysis_")
    
    # All possible issues
    with st.expander("📋 All Possible Issues", expanded=False):
        st.caption(f"The AI is looking for mentions of these {len(config.ISSUES)} issues:")
        for idx, issue in enumerate(config.ISSUES, 1):
            # Check if this issue has been identified
            is_identified = False
            if st.session_state.last_reflection:
                is_identified = issue in st.session_state.last_reflection.confident_issues
            
            emoji = "✅" if is_identified else "⚪"
            st.markdown(f"{emoji} {idx}. {issue}")

# Main chat interface
st.title("💬 Issue Discovery Chatbot")
st.caption("A multi-agent demo to discover what issues matter to you")

# Main area issue visualization
if st.session_state.last_reflection and st.session_state.turn_count > 0:
    reflection = st.session_state.last_reflection
    
    # Create columns for metrics
    col1, col2, col3 = st.columns(3)
    
    with col1:
        status_emoji = "✅" if reflection.is_confident else "🔍"
        status_text = "CONFIDENT" if reflection.is_confident else "EXPLORING"
        st.metric("AI Status", status_text, delta=None)
    
    with col2:
        st.metric("Issues Found", len(reflection.confident_issues))
    
    with col3:
        st.metric("Turn", f"{st.session_state.turn_count}/{config.MAX_TURNS}")
    
    # Show identified issues in a nice card
    if reflection.confident_issues:
        st.info(f"**🎯 Identified Issues**: {', '.join(reflection.confident_issues)}")

st.divider()

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

        # Process turn with streaming
        message_placeholder = st.empty()
        full_message = ""
        
        with st.spinner("Thinking..."):
            for result in st.session_state.conversation_flow.process_turn_streaming(
                st.session_state.messages,
                st.session_state.turn_count
            ):
                # Store reflection for visualization
                st.session_state.last_reflection = result['reflection']
                
                # Accumulate message chunks
                if result['message_chunk']:
                    full_message += result['message_chunk']
                    
                    # Display streaming message
                    with message_placeholder.container():
                        with st.chat_message("assistant"):
                            st.markdown(full_message + "▌")  # Cursor effect
                
                # If complete, finalize the message
                if result['is_complete']:
                    # Remove cursor and add final message
                    with message_placeholder.container():
                        with st.chat_message("assistant"):
                            st.markdown(full_message)
                    
                    # Add to conversation history
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": full_message
                    })
                    
                    # Check if conversation is complete
                    if st.session_state.turn_count >= config.MAX_TURNS:
                        st.session_state.conversation_complete = True
                    
                    break

        st.rerun()
else:
    st.info("Conversation complete. Click 'Start Over' to begin a new conversation.")

