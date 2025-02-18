from fastapi import APIRouter, HTTPException
from typing import List
from ..models.playbook import Playbook, PlaybookCreate
from datetime import datetime
import uuid

router = APIRouter()

# In-memory storage for playbooks
playbooks: List[Playbook] = []

@router.get("/playbooks", response_model=List[Playbook])
async def list_playbooks():
    return playbooks

@router.post("/playbooks", response_model=Playbook)
async def create_playbook(playbook: PlaybookCreate):
    new_playbook = Playbook(
        id=str(uuid.uuid4()),
        name=playbook.name,
        content=playbook.content,
        created_at=datetime.utcnow()
    )
    playbooks.append(new_playbook)
    return new_playbook

@router.get("/playbooks/{playbook_id}", response_model=Playbook)
async def get_playbook(playbook_id: str):
    for playbook in playbooks:
        if playbook.id == playbook_id:
            return playbook
    raise HTTPException(status_code=404, detail="Playbook not found")
