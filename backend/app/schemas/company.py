from pydantic import BaseModel
from typing import Optional


class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    founded_year: Optional[int] = None
    headquarters: Optional[str] = None
    tech_stack: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None


class CompanyRead(CompanyBase):
    id: int

    model_config = {"from_attributes": True}


class CompanyStats(BaseModel):
    avg_salary: Optional[float] = None
    median_salary: Optional[float] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    submission_count: int = 0
