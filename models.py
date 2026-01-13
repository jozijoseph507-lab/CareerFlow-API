from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    company: str
    position: str
    applied_date: str  # YYYY-MM-DD

class Application(ApplicationCreate):
    id: int
    status: str
    follow_up_date: str
