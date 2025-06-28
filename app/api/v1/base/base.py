
from fastapi import APIRouter
import json
import os

from app.schemas.base import Success
from app.schemas.login import *

router = APIRouter()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@router.post("/access_token", summary="fetch token")
async def login_access_token():
    mock_path = os.path.join(BASE_DIR, "../mock/base", "ACCESS_TOKEN_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return Success(data=data)


@router.get("/userinfo", summary="fetch user data")
async def get_userinfo():
    mock_path = os.path.join(BASE_DIR, "../mock/base", "USER_INFO_MOCK.json")
    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return Success(data=data)


@router.get("/usermenu", summary="fetch user menu")
async def get_user_menu():
    mock_path = os.path.join(BASE_DIR, "../mock/base", "USER_MENU_MOCK.json")

    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return Success(data=data)


@router.get("/userapi", summary="fetch user API")
async def get_user_api():
    mock_path = os.path.join(BASE_DIR, "../mock/base", "USER_API_MOCK.json")

    with open(mock_path, encoding="utf-8") as f:
        data = json.load(f)
    return Success(data=data)

