from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
import uuid
from ..models.task import Task, TaskCreate, TaskStatus
from ..agents.task_planner import execute_task_planning

router = APIRouter()

# In-memory storage for tasks
tasks: List[Task] = []

@router.post("/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    task_id = str(uuid.uuid4())
    new_task = Task(
        id=task_id,
        description=task.description,
        playbook_id=task.playbook_id,
        status=TaskStatus.PENDING,
        created_at=datetime.utcnow()
    )
    
    # Execute task planning
    planning_result = execute_task_planning(task_id, task.description)
    new_task.plan = planning_result["plan"]
    new_task.status = TaskStatus.AWAITING_CONFIRMATION
    
    tasks.append(new_task)
    return new_task

@router.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str):
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@router.post("/tasks/{task_id}/confirm", response_model=Task)
async def confirm_task(task_id: str):
    for task in tasks:
        if task.id == task_id:
            if task.status != TaskStatus.AWAITING_CONFIRMATION:
                raise HTTPException(status_code=400, detail="Task is not awaiting confirmation")
            task.status = TaskStatus.IN_PROGRESS
            return task
    raise HTTPException(status_code=404, detail="Task not found")
