from fastapi import APIRouter

from app.core.dependency import DependPermission

from .auditlog import auditlog_router
from .base import base_router
from .depts import depts_router
from .menus import menus_router
from .roles import roles_router
from .users import users_router

v1_router = APIRouter()

v1_router.include_router(base_router, prefix="/base")
v1_router.include_router(users_router, prefix="/user")
v1_router.include_router(roles_router, prefix="/role")
v1_router.include_router(menus_router, prefix="/menu")
v1_router.include_router(depts_router, prefix="/dept")
v1_router.include_router(auditlog_router, prefix="/auditlog")
