from typing import List, Optional
from pydantic import BaseModel


class ArtifactBase(BaseModel):
    code: str
    name: str
    description: str
    detailed_story: Optional[str] = None
    era: str
    year: int
    category: str
    location: str
    room_code: str
    node_id: str
    material: Optional[str] = None
    dimensions: Optional[str] = None
    image_url: str
    is_featured: bool = False
    suggested_questions: List[str] = []
    model_type: Optional[str] = "generic"


class ArtifactResponse(ArtifactBase):
    id: int

    class Config:
        from_attributes = True


class ArtifactListResponse(BaseModel):
    artifacts: List[ArtifactResponse]
    total: int


class ChatRequest(BaseModel):
    message: str
    artifact_code: Optional[str] = None
    history: Optional[List[dict]] = None


class ChatSource(BaseModel):
    code: str
    name: str
    era: str
    room_code: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource] = []
