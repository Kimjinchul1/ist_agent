Landing Page -> Landing Page에서 6개의 카드가 있고, 그 카드가 아래것들...
제목: Agent Market

# 전체적인 구성요소
1. AI 평가 벤치마크 소개란 (HLE 벤치마크)
2. AI 평가 대시보드
3. Agent Framework (Agno)
4. Agent FrontEnd (Agent UI)
5. Tracer (phoenix arize)
6. mcpjam (MCP Builder)






https://www.youtube.com/watch?v=U1_nzjWUpL4&t=228s
# Agno Playground UI 훔쳐오기기
1. browser mcp를 통해 특정 웹사이트의 구성 요소를 모두 들고오도록 하기.

## 예시
Use the MCP browser to explore @https://monkeytype.com/. Break down the site's core architecture, focusing on navigation flow, component structure, routing strategy, state management, styling methodology, and interactive behaviors. Pay close attention to technical patterns and hierarchy with the goal of enabling an accurate and scalable clone. And then build the clone in a next js app.


## Playground UI 업그레이드 하기기
2. 원하는 디자인에 대해 커서와 함께 design.json 파일을 뽑아낼 것
내가 원하는 이미지를 캡쳐하고 동시에 현재 파일의 Create_json 파일과 함께 claude에 프롬프트로 주면 design.json 파일을 출력해줌.
그러면 이것과 함께 내가 원하는 프롬프트를 입력하면 됨.


I would like to build a front-end app in this next template. 

FOR THE DESIGN YOU HAVE TO STRICTLY FOLLOW @Design.json. 

[이 부분엔 FrontEnd_Template을 참고하여 입력]



## 더 디벨롭하기 (UI)
# Stagewise를 사용하여 나의 브라우저에서 명령할 곳 지정하기

ctrl + shift + p 입력 후 stagewise Auto Setup 진행
이렇게 하면, 내가 지정한 특정 지점에 대하여 프롬프트를 같이 입력하면 여기에 알맞는 프롬프트가 생성됨.




------
https://www.youtube.com/watch?v=M-uUFLU9IFU




Use the MCP browser to explore @https://app.agno.com/playground/agents?endpoint=demo.agnoagents.com/v1&agent=basic-agent. Break down the site's core architecture, focusing on playground section (Agent, Team, Workflow), and right side bar to control endpoint, config, session. And Pay close attention to technical patterns and hierarchy with the goal of enabling an accurate and scalable clone. And then create architecture.json to build the next.js app.





##

Tracer로 phoenix arize 확정




## MCP Tool Builder 

npx @mcpjam/inspector@latest



