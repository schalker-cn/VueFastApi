import logging

from fastapi import APIRouter, Body, HTTPException, Query
from tortoise.expressions import Q

from app.controllers.dept import dept_controller
from app.controllers.user import user_controller
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.users import *
import os
import json

logger = logging.getLogger(__name__)

router = APIRouter()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def flatten_depts(depts):
    flat = []
    for dept in depts:
        flat.append(dept)
        if dept.get("children"):
            flat.extend(flatten_depts(dept["children"]))
    return flat

@router.get("/list", summary="fetch user list")
async def list_user(
    page: int = Query(1, description="page number"),
    page_size: int = Query(10, description="user per page"),
    username: str = Query("", description="username"),
    email: str = Query("", description="user's email"),
    dept_id: int = Query(None, description="dept ID"),
):
    mock_path = os.path.join(BASE_DIR, "../mock/user", "USER_MOCK.json")
    dept_path = os.path.join(BASE_DIR, "../mock/dept", "DEPT_MOCK.json")

    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)

    with open(dept_path, encoding="utf-8") as f:
        dept_data = json.load(f)
    flat_depts = flatten_depts(dept_data)

    if username:
        data = [user for user in data if username.lower() in user["username"].lower()]

    if email:
        data = [user for user in data if user["email"] and email.lower() in user["email"].lower()]

    if dept_id is not None:
        data = [user for user in data if user.get("dept_id") == dept_id]

    for d in data:
        dept_match = next((dept for dept in flat_depts if dept["id"] == d.get("dept_id")), None)
        d["dept"] = dept_match
    total = len(data)

    return SuccessExtra(data=data, total=total, page=page, page_size=page_size)


@router.post("/create", summary="create user")
async def create_user(
    user_in: UserCreate,
):
    user_path = os.path.join(BASE_DIR, "../mock/user", "USER_MOCK.json")
    role_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_MOCK.json")

    with open(user_path, encoding="utf-8") as f:
        users = json.load(f)

    if any(u["email"] == user_in.email for u in users):
        return Fail(code=400, msg="The user with this email already exists in the system.")

    new_id = max([u["id"] for u in users], default=0) + 1
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(role_path, encoding="utf-8") as f:
        all_roles = json.load(f)
    role_objs = [r for r in all_roles if r["id"] in user_in.role_ids]

    new_user = {
        "id": new_id,
        "email": user_in.email,
        "username": user_in.username,
        "is_active": user_in.is_active,
        "is_superuser": user_in.is_superuser,
        "dept_id": user_in.dept_id,
        "roles": role_objs,
        "phone": None,
        "alias": None,
        "last_login": None,
        "created_at": now,
        "updated_at": now,
    }

    users.append(new_user)
    with open(user_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    return Success(msg="Created Successfully", data=new_user)


@router.post("/update", summary="update user")
async def update_user(
    user_in: UserUpdate,
):
    user_path = os.path.join(BASE_DIR, "../mock/user", "USER_MOCK.json")
    role_path = os.path.join(BASE_DIR, "../mock/role", "ROLE_MOCK.json")

    with open(user_path, encoding="utf-8") as f:
        users = json.load(f)

    user = next((u for u in users if u["id"] == user_in.id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if any(u["email"] == user_in.email and u["id"] != user_in.id for u in users):
        return Fail(code=400, msg="The user with this email already exists in the system.")

    with open(role_path, encoding="utf-8") as f:
        all_roles = json.load(f)
    role_objs = [r for r in all_roles if r["id"] in user_in.role_ids]

    user["email"] = user_in.email
    user["username"] = user_in.username
    user["is_active"] = user_in.is_active
    user["is_superuser"] = user_in.is_superuser
    user["dept_id"] = user_in.dept_id
    user["roles"] = role_objs
    user["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(user_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    return Success(msg="Updated Successfully", data=user)


@router.delete("/delete", summary="delete user")
async def delete_user(
    user_id: int = Query(..., description="user ID"),
):
    user_path = os.path.join(BASE_DIR, "../mock/user", "USER_MOCK.json")
    with open(user_path, encoding="utf-8") as f:
        users = json.load(f)
        
    index = next((i for i, u in enumerate(users) if u["id"] == user_id), None)

    if index is None:
        raise HTTPException(status_code=404, detail="User not found.")

    deleted_user = users.pop(index)
    with open(user_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    return Success(msg="Deleted Success", data=deleted_user)
