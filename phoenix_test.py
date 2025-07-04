import os

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.yfinance import YFinanceTools
from phoenix.otel import register

# 로컬 컬렉터 엔드포인트 설정
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "http://localhost:6006"

from phoenix.otel import register

tracer_provider = register(
  project_name="default",
  endpoint="http://localhost:6006/v1/traces",
  auto_instrument=True
)

# 에이전트 생성 및 구성
agent = Agent(
    name="Stock Price Agent",
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[YFinanceTools()],
    instructions="You are a stock price agent. Answer questions in the style of a stock analyst.",
    debug_mode=True,
)

# 에이전트 사용
agent.print_response("What is the current price of Tesla?")
