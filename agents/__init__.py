from typing import List

from pydantic import BaseModel


class IssueConfidence(BaseModel):
    issue_name: str
    confidence_level: int
    user_cares: bool


class ReflectionOutput(BaseModel):
    is_confident: bool
    turn_count: int
    confident_issues: List[str]
    uncertain_issues: List[str]
    issue_details: List[IssueConfidence]

