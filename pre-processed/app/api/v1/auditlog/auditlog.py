from datetime import datetime
from fastapi import APIRouter, Query
from tortoise.expressions import Q

import os
import json
from app.models.admin import AuditLog
from app.schemas import SuccessExtra
from app.schemas.apis import *

router = APIRouter()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@router.get("/list", summary="audit api requests")
async def get_audit_log_list(
    page: int = Query(1, description="page number"),
    page_size: int = Query(10, description="log per page"),
    username: str = Query("", description="visitor"),
    module: str = Query("", description="module"),
    method: str = Query("", description="request method"),
    summary: str = Query("", description="api summary"),
    status: int = Query(None, description="status code"),
    start_time: datetime = Query("", description="start time"),
    end_time: datetime = Query("", description="end time"),
):
    
    mock_path = os.path.join(BASE_DIR, "../mock/auditlog", "AUDIT_LOG_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    q = Q()
    if username:
        data = [item for item in data if username in item["username"]]
    if module:
        data = [item for item in data if module in item["module"]]
    if method:
        data = [item for item in data if method == item["method"]]
    if summary:
        data = [item for item in data if summary in item["summary"]]
    if status:
        data = [item for item in data if status == item["status"]]
    if start_time and end_time:
        data = [item for item in data if datetime.strptime(item["created_at"], "%Y-%m-%d %H:%M:%S") > start_time and datetime.strptime(item["created_at"], "%Y-%m-%d %H:%M:%S") < end_time]
    elif start_time:
        data = [item for item in data if datetime.strptime(item["created_at"], "%Y-%m-%d %H:%M:%S") > start_time]
    elif end_time:
        data = [item for item in data if datetime.strptime(item["created_at"], "%Y-%m-%d %H:%M:%S") < end_time]

    total = len(data)

    return SuccessExtra(data=data, total=total, page=page, page_size=page_size)
