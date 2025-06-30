from agno.agent import Agent
from agno.team import Team
from agno.models.openai import OpenAIChat
from agno.playground import Playground
from agno.storage.sqlite import SqliteStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.yfinance import YFinanceTools
from dotenv import load_dotenv

load_dotenv()

agent_storage: str = "tmp/agents.db"

web_agent = Agent(
    name="Web Agent",
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools()],
    instructions=["Always include sources"],
    # Store the agent sessions in a sqlite database
    storage=SqliteStorage(table_name="web_agent", db_file=agent_storage),
    # Adds the current date and time to the instructions
    add_datetime_to_instructions=True,
    # Adds the history of the conversation to the messages
    add_history_to_messages=True,
    # Number of history responses to add to the messages
    num_history_responses=5,
    # Adds markdown formatting to the messages
    markdown=True,
)

finance_agent = Agent(
    name="Finance Agent",
    model=OpenAIChat(id="gpt-4o"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True, company_news=True)],
    instructions=["Always use tables to display data"],
    storage=SqliteStorage(table_name="finance_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

# Web Agent와 Finance Agent를 coordinate 모드로 묶은 팀 생성
finance_team = Team(
    name="Finance Team",
    mode="coordinate",
    model=OpenAIChat(id="gpt-4o"),
    members=[
        web_agent,
        finance_agent,
    ],
    team_id="finance_team",
    debug_mode=True,
    instructions=[
        "Coordinate between web search and financial analysis",
        "Use tables to display financial data",
        "Always include sources for information",
    ],
    markdown=True,
    show_members_responses=True,
    enable_agentic_context=True,
    add_datetime_to_instructions=True,
    success_criteria="The team has successfully completed the financial analysis task.",
    storage=SqliteStorage(
        table_name="finance_team",
        db_file=agent_storage,
        auto_upgrade_schema=True,
    ),
)

playground = Playground(
    agents=[web_agent, finance_agent],
    teams=[finance_team],
    name="Finance Team Playground",
    description="Web Agent와 Finance Agent가 협력하는 플레이그라운드"
)
app = playground.get_app()

if __name__ == "__main__":
    playground.serve("playground_team:app", reload=True)
