from opik.integrations.langchain import OpikTracer


def init_opik_tracer(tags=None, project_name="Issue Discovery Chatbot"):
    """Initialize OpikTracer for LangChain with optional tags and project name"""
    if tags is None:
        tags = ["issue-discovery", "chatbot", "demo"]

    try:
        tracer = OpikTracer(tags=tags, project_name=project_name)
        print(f"✅ Opik tracer initialized for project: {project_name}")
        return tracer
    except Exception as e:
        print(f"⚠️  Warning: Could not initialize Opik tracer: {e}")
        return None

