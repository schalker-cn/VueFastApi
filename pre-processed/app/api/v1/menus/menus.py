import logging

from fastapi import APIRouter, Query, HTTPException

from app.controllers.menu import menu_controller
from app.schemas.base import Success, SuccessExtra
from app.schemas.menus import *
import os
import json

logger = logging.getLogger(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

router = APIRouter()


@router.get("/list", summary="fetch menu list")
async def list_menu(
    page: int = Query(1, description="page number"),
    page_size: int = Query(10, description="menu per page"),
):
    mock_path = os.path.join(BASE_DIR, "../mock/menu", "MENU_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return SuccessExtra(data=data, total=len(data), page=page, page_size=page_size)

@router.get("/get", summary="ftehc menu details")
async def get_menu(
    menu_id: int = Query(..., description="menu id"),
):
    result = await menu_controller.get(id=menu_id)
    return Success(data=result)

@router.post("/update", summary="update menu")
async def update_menu(
    menu_in: MenuUpdate,
):
    mock_path = os.path.join(BASE_DIR, "../mock/menu", "MENU_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    target = next((item for item in data if item["id"] == menu_in.id), None)

    if not target:
        raise HTTPException(status_code=404, detail="Menu item not found")

    update_data = menu_in.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key in target and value is not None:
            target[key] = value
    return Success(msg="Updated Success")

@router.delete("/delete", summary="delete menu")
async def delete_menu(
    id: int = Query(..., description="menu id"),
):
    child_menu_count = await menu_controller.model.filter(parent_id=id).count()
    if child_menu_count > 0:
        return Fail(msg="Cannot delete a menu with child menus")
    await menu_controller.remove(id=id)
    return Success(msg="Deleted Success")
