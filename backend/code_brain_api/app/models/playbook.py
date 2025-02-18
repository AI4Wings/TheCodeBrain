from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Playbook(BaseModel):
    id: str
    name: str
    content: str
    created_at: datetime

class PlaybookCreate(BaseModel):
    name: str
    content: str
