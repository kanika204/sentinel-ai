# LangChain Cheatsheet

Framework that helps you call LLMs and build apps around them (prompts, chains, tools, agents, RAG).
Project used: `langchain-project/` with **Groq** (`ChatGroq`) and **Hugging Face** (`ChatHuggingFace`).

## 1. Big picture

Generative AI evolution: research phase, then hosted models, then provider phase (API keys: Anthropic, OpenAI, Groq, ...), then **application developer** (where we are): you build apps on top of provider APIs.

Two perspectives: user (use a chatbot) and builder (use the API and frameworks like LangChain).

| Piece | Role |
|---|---|
| Model (chat model / LLM) | The thing that generates text |
| Prompt template | Reusable prompt with variables |
| Output parser | Turns model output into str / JSON / objects |
| Chain (LCEL) | Steps joined with `\|` |
| Tool | Function the model can ask to call |
| Agent | Model in a loop that picks tools |
| Retriever / vector store | Finds relevant documents for RAG |
| Memory / history | Keeps conversation context |

## 2. Setup

```bash
python3 -m venv venv && source venv/bin/activate
pip install langchain langchain-groq langchain-huggingface python-dotenv
pip freeze > requirements.txt
```

`langchain-project/requirements.txt`:
```
langchain
langchain-groq
python-dotenv
```

Other providers:
```bash
pip install langchain-openai langchain-anthropic langchain-google-genai langchain-ollama
```

## 3. Secrets with `.env`

`.env` (never commit it; it is in `.gitignore`):
```
GROQ_API_KEY=your_key_here
HUGGINGFACEHUB_API_TOKEN=your_token_here
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
```
```python
from dotenv import load_dotenv
load_dotenv()          # call BEFORE creating the model; reads .env into environment variables
```
Providers pick up their key from the environment variable automatically.

## 4. Calling models

### Groq (`Starting.py`)
```python
from langchain_groq import ChatGroq
from dotenv import load_dotenv
load_dotenv()

model = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.5)   # pick a model id from console.groq.com
response = model.invoke("what are the stats of virat kohli")
print(response.content)
```

### Hugging Face (`hf.py` / `texthf.py`)
```python
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv
load_dotenv()

llm = HuggingFaceEndpoint(repo_id="deepseek-ai/DeepSeek-R1", task="text-generation")
model = ChatHuggingFace(llm=llm)
res = model.invoke("hii")
print(res.content)
print(res.response_metadata)
```

### Provider-agnostic init
```python
from langchain.chat_models import init_chat_model
model = init_chat_model("groq:llama-3.3-70b-versatile", temperature=0)
model = init_chat_model("openai:gpt-4o-mini")
```

### Common parameters
| Param | Meaning |
|---|---|
| `model` | model id |
| `temperature` | 0 = deterministic, higher = more random (0 to 1 or 2) |
| `max_tokens` | cap on output length |
| `timeout`, `max_retries` | network behaviour |
| `streaming` | stream tokens |

## 5. The response object (`AIMessage`)

```python
res = model.invoke("hi")
res.content                 # the text
res.response_metadata       # provider info, finish_reason, token_usage
res.usage_metadata          # {"input_tokens": .., "output_tokens": .., "total_tokens": ..}
res.id
res.tool_calls              # populated when the model wants to call tools
```
Token counting example:
```python
print("prompt tokens:", res.usage_metadata["input_tokens"])
print("completion tokens:", res.usage_metadata["output_tokens"])
```

## 6. Messages

```python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

messages = [
    SystemMessage(content="You are a concise DevOps assistant."),
    HumanMessage(content="What is Kafka?"),
]
res = model.invoke(messages)

# tuple shorthand
model.invoke([("system", "Answer in one line"), ("human", "What is Airflow?")])

# with history
messages += [res, HumanMessage(content="And how is it different from RabbitMQ?")]
model.invoke(messages)
```
Roles: `system` (behaviour), `human` (user), `ai` (model), `tool` (tool result).

## 7. Streaming, batch, async

```python
for chunk in model.stream("Explain DAGs"):
    print(chunk.content, end="", flush=True)

model.batch(["q1", "q2", "q3"])                          # several inputs at once
await model.ainvoke("hi")                                # async
async for c in model.astream("hi"): ...
```

## 8. Prompt templates

```python
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {domain}."),
    ("human", "{question}"),
])
msgs = prompt.invoke({"domain": "Kafka", "question": "What is a partition?"})

simple = PromptTemplate.from_template("Summarize in {n} words: {text}")
simple.format(n=20, text="...")
```

With chat history slot:
```python
from langchain_core.prompts import MessagesPlaceholder
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are helpful."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])
```

## 9. Chains with LCEL (the `|` operator)

```python
from langchain_core.output_parsers import StrOutputParser

chain = prompt | model | StrOutputParser()
print(chain.invoke({"domain": "Airflow", "question": "What is XCom?"}))

for chunk in chain.stream({...}): print(chunk, end="")
chain.batch([{...}, {...}])
```

Parallel and passthrough:
```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda

parallel = RunnableParallel(
    summary=prompt1 | model | StrOutputParser(),
    keywords=prompt2 | model | StrOutputParser(),
)
upper = RunnableLambda(lambda s: s.upper())
chain = prompt | model | StrOutputParser() | upper
```

## 10. Structured output

Pydantic (best):
```python
from pydantic import BaseModel, Field

class Alert(BaseModel):
    server: str = Field(description="server id")
    severity: str = Field(description="low, medium or high")
    reason: str

structured = model.with_structured_output(Alert)
alert = structured.invoke("server01 cpu is 97% and memory 90%")
print(alert.severity)
```

JSON parser fallback:
```python
from langchain_core.output_parsers import JsonOutputParser
chain = prompt | model | JsonOutputParser()
```

## 11. Tools and agents

```python
from langchain_core.tools import tool

@tool
def get_cpu(server_id: str) -> int:
    """Return the CPU usage percentage of a server."""      # docstring = tool description the model sees
    return 87

model_with_tools = model.bind_tools([get_cpu])
res = model_with_tools.invoke("What is the CPU of server01?")
print(res.tool_calls)        # [{'name': 'get_cpu', 'args': {'server_id': 'server01'}, 'id': ...}]
```

Agent (LangGraph prebuilt):
```bash
pip install langgraph
```
```python
from langgraph.prebuilt import create_react_agent
agent = create_react_agent(model, tools=[get_cpu])
out = agent.invoke({"messages": [("human", "Is server01 overloaded? Use the tool.")]})
print(out["messages"][-1].content)
```

## 12. Conversation memory

Simple: keep a list of messages and append each turn (section 6).

Managed:
```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

store = {}
def get_history(session_id):
    return store.setdefault(session_id, InMemoryChatMessageHistory())

chat = RunnableWithMessageHistory(prompt | model, get_history,
                                  input_messages_key="input", history_messages_key="history")
chat.invoke({"input": "hi, I'm Ankit"}, config={"configurable": {"session_id": "s1"}})
chat.invoke({"input": "what's my name?"}, config={"configurable": {"session_id": "s1"}})
```

## 13. RAG (retrieval augmented generation) outline

```bash
pip install langchain-community langchain-text-splitters faiss-cpu langchain-huggingface
```
```python
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

docs = TextLoader("notes.txt").load()
chunks = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_documents(docs)
emb = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = FAISS.from_documents(chunks, emb)
retriever = db.as_retriever(search_kwargs={"k": 3})

rag_prompt = ChatPromptTemplate.from_template(
    "Answer using only this context:\n{context}\n\nQuestion: {question}")
chain = ({"context": retriever | (lambda ds: "\n\n".join(d.page_content for d in ds)),
          "question": RunnablePassthrough()}
         | rag_prompt | model | StrOutputParser())
chain.invoke("What does the note say about Kafka?")
```
Steps: load, split, embed, store, retrieve, prompt, generate.

## 14. Debugging and observability

```python
import langchain
langchain.debug = True            # verbose logs of every step (older API)
```
LangSmith tracing:
```
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=...
LANGSMITH_PROJECT=aiops
```
Also: print `res.response_metadata` and `res.usage_metadata` to see tokens and finish reason.

## 15. Error reference

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: langchain_groq` | `pip install langchain-groq` in the active venv |
| `GroqError: api_key client option must be set` | `.env` missing/wrong name, or `load_dotenv()` not called first |
| `model_not_found` / 404 | Model id is wrong or retired; check the provider's model list |
| 401 Unauthorized | Bad or expired key |
| 429 rate limit | Slow down, set `max_retries`, use a smaller model |
| Reasoning models print `<think>...</think>` | Strip it, or use a provider option to hide reasoning |
| HuggingFace endpoint timeout | Model cold start or not served by the free inference API; try another `repo_id` |
| Import errors after upgrade | LangChain moved things: use `langchain_core` for prompts/messages/parsers, `langchain_community` for integrations |

## 16. Import map

| Need | Import |
|---|---|
| Groq chat model | `from langchain_groq import ChatGroq` |
| HF chat model | `from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint` |
| Prompts | `from langchain_core.prompts import ChatPromptTemplate, PromptTemplate` |
| Messages | `from langchain_core.messages import HumanMessage, SystemMessage, AIMessage` |
| Parsers | `from langchain_core.output_parsers import StrOutputParser, JsonOutputParser` |
| Runnables | `from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda` |
| Tools | `from langchain_core.tools import tool` |
| `.env` | `from dotenv import load_dotenv` |
