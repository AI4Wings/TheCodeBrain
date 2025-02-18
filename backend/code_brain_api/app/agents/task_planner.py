from typing import Dict, List, TypedDict, Annotated
from datetime import datetime
import uuid
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from langgraph.types import Command, interrupt

class State(TypedDict):
    messages: Annotated[list, add_messages]
    task_id: str
    plan: Dict
    status: str

def create_task_planner() -> StateGraph:
    graph_builder = StateGraph(State)
    
    @tool
    def human_confirmation(query: str) -> str:
        """Request confirmation from a human."""
        response = interrupt({"query": query})
        return response["data"]

    def generate_plan(state: State) -> State:
        # TODO: Implement plan generation using LLM
        # For now, return a mock plan
        state["plan"] = {
            "steps": [
                {"id": str(uuid.uuid4()), "description": "Analyze code changes", "status": "pending"},
                {"id": str(uuid.uuid4()), "description": "Identify UI impacts", "status": "pending"},
                {"id": str(uuid.uuid4()), "description": "Generate report", "status": "pending"}
            ],
            "status": "pending"
        }
        return state

    def request_confirmation(state: State) -> State:
        plan_steps = "\n".join([f"- {step['description']}" for step in state["plan"]["steps"]])
        query = f"Please confirm the following plan:\n\n{plan_steps}\n\nDo you want to proceed?"
        response = human_confirmation(query)
        
        if response.lower() == "yes":
            state["status"] = "confirmed"
        else:
            state["status"] = "rejected"
        
        return state

    # Define the graph flow
    graph_builder.add_node("generate_plan", generate_plan)
    graph_builder.add_node("request_confirmation", request_confirmation)

    # Connect nodes
    graph_builder.add_edge("generate_plan", "request_confirmation")
    graph_builder.add_edge("request_confirmation", END)

    return graph_builder.compile()

def execute_task_planning(task_id: str, description: str) -> Dict:
    """Execute the task planning workflow."""
    graph = create_task_planner()
    
    initial_state = {
        "messages": [],
        "task_id": task_id,
        "plan": {},
        "status": "planning"
    }
    
    final_state = graph.run(initial_state)
    return final_state
