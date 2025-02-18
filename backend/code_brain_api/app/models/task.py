from datetime import datetime
from typing import List, Optional, Dict
from enum import Enum
from pydantic import BaseModel

class TaskStatus(str, Enum):
    PENDING = "pending"
    PLANNING = "planning"
    AWAITING_CONFIRMATION = "awaiting_confirmation"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class PlanStep(BaseModel):
    id: str
    description: str
    status: str = "pending"

class Plan(BaseModel):
    steps: List[PlanStep]
    status: str = "pending"

class Task(BaseModel):
    id: str
    description: str
    playbook_id: Optional[str] = None
    status: TaskStatus
    created_at: datetime
    plan: Optional[Plan] = None
    results: Optional[Dict] = None

class TaskCreate(BaseModel):
    description: str
    playbook_id: Optional[str] = None
