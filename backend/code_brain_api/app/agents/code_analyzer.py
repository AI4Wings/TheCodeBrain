from typing import Dict, List, Optional
from langchain.tools import tool
import subprocess
import os
import re

class CodeAnalyzer:
    def __init__(self, base_dir: str):
        self.base_dir = base_dir

    @tool
    def clone_repository(self, repo_url: str) -> str:
        """Clone a GitHub repository."""
        try:
            repo_name = repo_url.split('/')[-1].replace('.git', '')
            clone_path = os.path.join(self.base_dir, repo_name)
            
            if not os.path.exists(clone_path):
                subprocess.run(['git', 'clone', repo_url, clone_path], check=True)
            
            return f"Repository cloned successfully to {clone_path}"
        except subprocess.CalledProcessError as e:
            return f"Failed to clone repository: {str(e)}"

    @tool
    def get_commit_diff(self, repo_path: str, commit_hash: str) -> Dict[str, List[str]]:
        """Get the diff for a specific commit."""
        try:
            os.chdir(repo_path)
            result = subprocess.run(
                ['git', 'show', '--name-status', commit_hash],
                capture_output=True,
                text=True,
                check=True
            )
            
            files = {}
            current_file = None
            
            for line in result.stdout.split('\n'):
                if line.startswith('diff --git'):
                    current_file = line.split(' b/')[-1]
                    files[current_file] = []
                elif current_file and (line.startswith('+') or line.startswith('-')):
                    files[current_file].append(line)
            
            return files
        except subprocess.CalledProcessError as e:
            return {"error": [f"Failed to get commit diff: {str(e)}"]}

    @tool
    def analyze_ui_impacts(self, diff_data: Dict[str, List[str]]) -> Dict[str, List[str]]:
        """Analyze UI impacts from code changes."""
        ui_impacts = {}
        
        ui_related_patterns = [
            r'layout|view|activity|fragment|xml',  # Layout files
            r'style|theme|color|dimen',            # Style-related
            r'text|string|label',                  # Text content
            r'click|touch|gesture',                # User interactions
            r'animation|transition',               # Visual effects
            r'adapter|recycler|list|grid',         # List/Grid views
            r'dialog|toast|snackbar',             # UI components
            r'margin|padding|width|height'         # Layout parameters
        ]
        
        for file_path, changes in diff_data.items():
            impacts = []
            
            # Check file type
            if file_path.endswith('.xml') or '/res/layout/' in file_path:
                impacts.append("Layout modification detected")
            
            # Analyze changes
            for change in changes:
                for pattern in ui_related_patterns:
                    if re.search(pattern, change, re.IGNORECASE):
                        impact = f"UI change detected: {pattern.replace('|', ' or ')}"
                        if impact not in impacts:
                            impacts.append(impact)
            
            if impacts:
                ui_impacts[file_path] = impacts
        
        return ui_impacts

    @tool
    def assess_compatibility_requirements(self, ui_impacts: Dict[str, List[str]]) -> Dict[str, List[str]]:
        """Assess compatibility testing requirements based on UI changes."""
        compatibility_requirements = {
            "system_versions": [],
            "screen_resolutions": [],
            "orientations": [],
            "device_types": []
        }
        
        for file_path, impacts in ui_impacts.items():
            for impact in impacts:
                if any(term in impact.lower() for term in ['layout', 'width', 'height', 'margin', 'padding']):
                    if "Different screen resolutions" not in compatibility_requirements["screen_resolutions"]:
                        compatibility_requirements["screen_resolutions"].append("Different screen resolutions")
                    if "Portrait and landscape orientations" not in compatibility_requirements["orientations"]:
                        compatibility_requirements["orientations"].append("Portrait and landscape orientations")
                
                if any(term in impact.lower() for term in ['animation', 'transition', 'gesture']):
                    if "Various Android versions" not in compatibility_requirements["system_versions"]:
                        compatibility_requirements["system_versions"].append("Various Android versions")
                
                if any(term in impact.lower() for term in ['adapter', 'recycler', 'list', 'grid']):
                    if "Phones and tablets" not in compatibility_requirements["device_types"]:
                        compatibility_requirements["device_types"].append("Phones and tablets")
        
        return compatibility_requirements
