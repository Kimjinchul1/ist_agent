from agno.agent import Agent
from agno.models.custom import Custom
from agno.playground import Playground
from agno.storage.sqlite import SqliteStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.yfinance import YFinanceTools

agent_storage: str = "tmp/agents.db"

# Custom 모델을 사용하는 웹 에이전트
web_agent = Agent(
    name="Web Agent",
    model=Custom(id="gpt-4o", base_url="https://your-api-endpoint.com/v1"),
    tools=[DuckDuckGoTools()],
    instructions=["Always include sources"],
    storage=SqliteStorage(table_name="web_agent_custom", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

# Custom 모델을 사용하는 금융 에이전트
finance_agent = Agent(
    name="Finance Agent",
    model=Custom(id="gpt-4o", base_url="https://your-api-endpoint.com/v1"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True, company_news=True)],
    instructions=["Always use tables to display data"],
    storage=SqliteStorage(table_name="finance_agent_custom", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

playground = Playground(agents=[web_agent, finance_agent])
app = playground.get_app()

if __name__ == "__main__":
    playground.serve("playground_custom:app", reload=True) 