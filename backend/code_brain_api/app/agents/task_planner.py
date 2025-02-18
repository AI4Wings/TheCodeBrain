from typing import Dict, List, TypedDict, Annotated
from datetime import datetime
import uuid
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from langgraph.types import Command, interrupt
from langchain.tools import tool

class State(TypedDict):
    messages: Annotated[list, add_messages]
    task_id: str
    description: str
    plan: Dict
    status: str

def create_task_planner() -> StateGraph:
    graph_builder = StateGraph(State)
    
    @tool
    def human_confirmation(query: str) -> str:
        """Request confirmation from a human."""
        response = interrupt({"query": query})
        return response["data"]

    def analyze_task(state: State) -> State:
        """Analyze task description and check for required information."""
        description = state["description"]
        
        # Check for GitHub commit URL if this is a code analysis task
        if "analyze" in description.lower() and "code" in description.lower():
            if "github.com" not in description or "/commit/" not in description:
                state["messages"].append({
                    "role": "system",
                    "content": "Please provide the GitHub commit URL for the code you want to analyze."
                })
                state["status"] = "awaiting_input"
                return state
        
        return state

    def generate_plan(state: State) -> State:
        """Generate execution plan based on task description."""
        description = state["description"]
        
        # Generate steps based on task type
        if "github.com" in description and "/commit/" in description:
            # Code analysis task
            state["plan"] = {
                "steps": [
                    {"id": str(uuid.uuid4()), "description": "Clone repository and fetch commit details", "status": "pending"},
                    {"id": str(uuid.uuid4()), "description": "Analyze code changes for UI impacts", "status": "pending"},
                    {"id": str(uuid.uuid4()), "description": "Assess compatibility testing requirements", "status": "pending"},
                    {"id": str(uuid.uuid4()), "description": "Generate analysis report", "status": "pending"}
                ],
                "status": "pending"
            }
        else:
            # Generic task
            state["plan"] = {
                "steps": [
                    {"id": str(uuid.uuid4()), "description": "Analyze task requirements", "status": "pending"},
                    {"id": str(uuid.uuid4()), "description": "Execute task steps", "status": "pending"},
                    {"id": str(uuid.uuid4()), "description": "Generate task report", "status": "pending"}
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
    graph_builder.add_node("analyze", analyze_task)
    graph_builder.add_node("generate_plan", generate_plan)
    graph_builder.add_node("request_confirmation", request_confirmation)

    # Connect nodes
    graph_builder.add_edge("analyze", "generate_plan")
    graph_builder.add_edge("generate_plan", "request_confirmation")
    graph_builder.add_edge("request_confirmation", END)

    return graph_builder.compile()

def execute_task_planning(task_id: str, description: str) -> Dict:
    """Execute the task planning workflow."""
    graph = create_task_planner()
    
    initial_state = {
        "messages": [],
        "task_id": task_id,
        "description": description,
        "plan": {},
        "status": "planning"
    }
    
    final_state = graph.run(initial_state)
    
    # If we need user input, return early with the request
    if final_state["status"] == "awaiting_input":
        return final_state
    
    # If plan is generated, request confirmation
    if final_state.get("plan", {}).get("steps"):
        final_state["status"] = "awaiting_confirmation"
        final_state["messages"].append({
            "role": "system",
            "content": "Please review the execution plan. Would you like to proceed?"
        })
    
    return final_state
