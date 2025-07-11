"""Your Agent Playground

Install dependencies: `pip install openai duckduckgo-search lancedb tantivy elevenlabs sqlalchemy 'fastapi[standard]' agno`
"""

from agent_with_knowledge import agent_with_knowledge
from agent_with_storage import agent_with_storage
from agent_with_tools import agent_with_tools
from agno.playground import Playground, serve_playground_app
from agno_assist import agno_assist
from simple_agent import simple_agent

# Create and configure the playground app
playground = Playground(
    agents=[
        simple_agent,
        agent_with_tools,
        agent_with_knowledge,
        agent_with_storage,
        agno_assist,
    ]
)
app = playground.get_app()

# if __name__ == "__main__":
#     # Run the playground app
#     playground = Playground(
#         agents=[
#             simple_agent,
#             agent_with_tools,
#             agent_with_knowledge,
#             # agent_with_storage,
#             agno_assist,
#         ],
#         app_id="agents-from-scratch-playground-app",
#         name="Agents from Scratch Playground",
#     )

if __name__ == "__main__":
    playground.serve(app="playground:app", reload=True)
