from fastapi import APIRouter, HTTPException, Query

from app.schemas import Success
from app.schemas.depts import *
from typing import List
import os
import json

router = APIRouter()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@router.get("/list", summary="fetch department list")
async def list_dept(
    name: str = Query(None, description="department name"),
):
    mock_path = os.path.join(BASE_DIR, "../mock/dept", "DEPT_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return Success(data=data)

@router.get("/get", summary="fetch department details")
async def get_dept(
    id: int = Query(..., description="department ID"),
):
    dept_obj = await dept_controller.get(id=id)
    data = await dept_obj.to_dict()
    return Success(data=data)


def insert_dept_node(depts: List[dict], parent_id: int, new_dept: dict) -> bool:
    for dept in depts:
        if dept["id"] == parent_id:
            dept.setdefault("children", []).append(new_dept)
            return True
        if insert_dept_node(dept.get("children", []), parent_id, new_dept):
            return True
    return False


@router.post("/create", summary="create department")
async def create_dept(
    dept_in: DeptCreate,
):
    def collect_all_ids(nodes: List[dict]) -> List[int]:
            ids = []
            for node in nodes:
                ids.append(node["id"])
                ids.extend(collect_all_ids(node.get("children", [])))
            return ids
    
    mock_path = os.path.join(BASE_DIR, "../mock/dept", "DEPT_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    all_ids = collect_all_ids(data)
    new_id = max(all_ids, default=0) + 1

    new_dept = {
        "id": new_id,
        "name": dept_in.name,
        "desc": dept_in.desc,
        "order": dept_in.order,
        "parent_id": dept_in.parent_id,
        "children": []
    }

    inserted = False
    if dept_in.parent_id == 0:
        data.append(new_dept)
        inserted = True
    else:
        inserted = insert_dept_node(data, dept_in.parent_id, new_dept)

    if not inserted:
        raise HTTPException(status_code=404, detail="parent dept not found")

    with open(mock_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return Success(msg="Created Successfully", data=new_dept)


def update_dept_node(depts: list, dept_in: DeptUpdate) -> bool:
    for dept in depts:
        if dept["id"] == dept_in.id:
            if dept_in.name is not None:
                dept["name"] = dept_in.name
            if dept_in.desc is not None:
                dept["desc"] = dept_in.desc
            if dept_in.order is not None:
                dept["order"] = dept_in.order
            if dept_in.parent_id is not None:
                dept["parent_id"] = dept_in.parent_id
            return True
        if update_dept_node(dept.get("children", []), dept_in):
            return True
    return False


@router.post("/update", summary="update dept details")
async def update_dept(
    dept_in: DeptUpdate,
):
    mock_path = os.path.join(BASE_DIR, "../mock/dept", "DEPT_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    updated = update_dept_node(data, dept_in)
    if not updated:
        raise HTTPException(status_code=404, detail="cannot find department")

    with open(mock_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return Success(msg="Update Successfully")


def delete_dept_node(depts: list, dept_id: int) -> bool:
    for i, dept in enumerate(depts):
        if dept["id"] == dept_id:
            del depts[i]
            return True
        if delete_dept_node(dept.get("children", []), dept_id):
            return True
    return False


@router.delete("/delete", summary="delete dept")
async def delete_dept(
    dept_id: int = Query(..., description="dept ID"),
):
    mock_path = os.path.join(BASE_DIR, "../mock/dept", "DEPT_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)

    deleted = delete_dept_node(data, dept_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="department not found")

    with open(mock_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return Success(msg="Deleted Success")
