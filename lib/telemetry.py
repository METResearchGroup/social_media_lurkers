from opik.integrations.langchain import OpikTracer


def init_opik_tracer(tags=None):
    """Initialize OpikTracer for LangChain with optional tags"""
    if tags is None:
        tags = ["issue-discovery", "chatbot", "demo"]

    try:
        tracer = OpikTracer(tags=tags)
        return tracer
    except Exception as e:
        print(f"Warning: Could not initialize Opik tracer: {e}")
        return None

