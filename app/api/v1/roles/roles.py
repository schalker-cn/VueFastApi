import logging

from fastapi import APIRouter, Query
from fastapi.exceptions import HTTPException

from app.schemas.base import Success, SuccessExtra
from app.schemas.roles import *
import os
import json

logger = logging.getLogger(__name__)
router = APIRouter()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@router.get("/list", summary="fetch role list")
async def list_role(
    page: int = Query(1, description="page number"),
    page_size: int = Query(10, description="roles per page"),
    role_name: str = Query("", description="role name"),
):
    mock_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)

    if role_name:
        data = [
            item for item in data
            if role_name.lower() in item["name"].lower()
        ]
    total = len(data)
    return SuccessExtra(data=data, total=total, page=page, page_size=page_size)


@router.post("/create", summary="create role")
async def create_role(role_in: RoleCreate):
    mock_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)

    for role in data:
        if role["name"] == role_in.name:
            raise HTTPException(
                status_code=400,
                detail="The role with this role name already exists in the system.",
            )

    new_id = max([item["id"] for item in data], default=0) + 1
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_role = {
        "id": new_id,
        "name": role_in.name,
        "desc": role_in.desc or "",
        "created_at": now,
        "updated_at": now,
    }

    data.append(new_role)
    with open(mock_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return Success(msg="Created Successfully", data=new_role)


@router.post("/update", summary="update role")
async def update_role(role_in: RoleUpdate):
    mock_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)

    target = next((item for item in data if item["id"] == role_in.id), None)
    if not target:
        raise HTTPException(status_code=404, detail="角色 ID 不存在")

    if role_in.name and role_in.name != target["name"]:
        for item in data:
            if item["name"] == role_in.name and item["id"] != role_in.id:
                raise HTTPException(
                    status_code=400,
                    detail="The role with this role name already exists in the system.",
                )

    if role_in.name is not None:
        target["name"] = role_in.name
    if role_in.desc is not None:
        target["desc"] = role_in.desc

    target["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(mock_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return Success(msg="Updated Successfully", data=target)

@router.delete("/delete", summary="delete role")
async def delete_role(
    role_id: int = Query(..., description="role ID"),
):
    mock_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)

    index_to_delete = next((i for i, item in enumerate(data) if item["id"] == role_id), None)

    if index_to_delete is None:
        raise HTTPException(status_code=404, detail="role ID does not exist")

    deleted_role = data.pop(index_to_delete)
    with open(mock_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return Success(msg="Deleted Success", data=deleted_role)


@router.get("/authorized", summary="fetch role authorized info")
async def get_role_authorized(id: int = Query(..., description="role ID")):
    mock_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_AUTH_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return Success(data=data)
