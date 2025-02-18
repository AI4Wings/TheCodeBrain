from typing import Dict, List, TypedDict, Annotated, Optional
from datetime import datetime
import uuid
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from langgraph.types import Command, interrupt
from langchain.tools import tool
from .code_analyzer import CodeAnalyzer

class AnalysisState(TypedDict):
    messages: Annotated[list, add_messages]
    task_id: str
    commit_url: str
    repository: Optional[str]
    commit_hash: Optional[str]
    diff_data: Optional[Dict]
    ui_impacts: Optional[Dict]
    compatibility_requirements: Optional[Dict]
    status: str

def create_analysis_agent(base_dir: str) -> StateGraph:
    graph_builder = StateGraph(AnalysisState)
    analyzer = CodeAnalyzer(base_dir)
    
    def parse_commit_url(state: AnalysisState) -> AnalysisState:
        """Parse GitHub commit URL to extract repository and commit hash."""
        url = state["commit_url"]
        parts = url.split('/')
        state["repository"] = f"https://github.com/{parts[3]}/{parts[4]}.git"
        state["commit_hash"] = parts[-1]
        return state
    
    def clone_repository(state: AnalysisState) -> AnalysisState:
        """Clone the repository."""
        if not state.get("repository"):
            return state
        
        result = analyzer.clone_repository(state["repository"])
        state["messages"].append({"role": "system", "content": result})
        return state
    
    def analyze_changes(state: AnalysisState) -> AnalysisState:
        """Analyze code changes for UI impacts."""
        repo_name = state["repository"].split('/')[-1].replace('.git', '')
        repo_path = f"{base_dir}/{repo_name}"
        
        # Get commit diff
        diff_data = analyzer.get_commit_diff(repo_path, state["commit_hash"])
        state["diff_data"] = diff_data
        
        # Analyze UI impacts
        ui_impacts = analyzer.analyze_ui_impacts(diff_data)
        state["ui_impacts"] = ui_impacts
        
        # Assess compatibility requirements
        compatibility = analyzer.assess_compatibility_requirements(ui_impacts)
        state["compatibility_requirements"] = compatibility
        
        return state
    
    def generate_report(state: AnalysisState) -> AnalysisState:
        """Generate analysis report and request human confirmation."""
        ui_impacts = state.get("ui_impacts", {})
        compatibility = state.get("compatibility_requirements", {})
        
        report = ["# Code Analysis Report\n"]
        
        # UI Impacts
        report.append("## UI Impacts\n")
        if ui_impacts:
            for file_path, impacts in ui_impacts.items():
                report.append(f"\n### {file_path}")
                for impact in impacts:
                    report.append(f"- {impact}")
        else:
            report.append("No UI impacts detected.")
        
        # Compatibility Requirements
        report.append("\n## Compatibility Testing Requirements\n")
        for category, requirements in compatibility.items():
            if requirements:
                report.append(f"\n### {category.replace('_', ' ').title()}")
                for req in requirements:
                    report.append(f"- {req}")
        
        report_text = "\n".join(report)
        state["messages"].append({"role": "system", "content": report_text})
        
        # Request human confirmation
        response = interrupt({"query": "Please review the analysis report. Would you like to proceed with the recommended compatibility testing?"})
        state["status"] = "confirmed" if response["data"].lower() == "yes" else "rejected"
        
        return state
    
    # Define graph flow
    graph_builder.add_node("parse_url", parse_commit_url)
    graph_builder.add_node("clone_repo", clone_repository)
    graph_builder.add_node("analyze", analyze_changes)
    graph_builder.add_node("report", generate_report)
    
    # Connect nodes
    graph_builder.add_edge("parse_url", "clone_repo")
    graph_builder.add_edge("clone_repo", "analyze")
    graph_builder.add_edge("analyze", "report")
    graph_builder.add_edge("report", END)
    
    return graph_builder.compile()

def execute_code_analysis(task_id: str, commit_url: str, base_dir: str) -> Dict:
    """Execute the code analysis workflow."""
    graph = create_analysis_agent(base_dir)
    
    initial_state = {
        "messages": [],
        "task_id": task_id,
        "commit_url": commit_url,
        "repository": None,
        "commit_hash": None,
        "diff_data": None,
        "ui_impacts": None,
        "compatibility_requirements": None,
        "status": "analyzing"
    }
    
    final_state = graph.run(initial_state)
    return final_state
