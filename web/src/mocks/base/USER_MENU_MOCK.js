export const USER_MENU_MOCK = [
    {
        "name": "System Management",
        "path": "/system",
        "keepalive": false,
        "updated_at": "2025-06-27 23:12:19",
        "remark": null,
        "menu_type": "catalog",
        "created_at": "2025-06-27 23:12:19",
        "is_hidden": false,
        "redirect": "/system/user",
        "order": 1,
        "parent_id": 0,
        "id": 1,
        "component": "Layout",
        "children": [
            {
                "name": "User Management",
                "path": "user",
                "keepalive": false,
                "updated_at": "2025-06-27 23:12:19",
                "remark": null,
                "menu_type": "menu",
                "created_at": "2025-06-27 23:12:19",
                "is_hidden": false,
                "redirect": null,
                "order": 1,
                "parent_id": 1,
                "id": 2,
                "component": "/system/user"
            },
            {
                "name": "Role Management",
                "path": "role",
                "keepalive": false,
                "updated_at": "2025-06-27 23:12:19",
                "remark": null,
                "menu_type": "menu",
                "created_at": "2025-06-27 23:12:19",
                "is_hidden": false,
                "redirect": null,
                "order": 2,
                "parent_id": 1,
                "id": 3,
                "component": "/system/role"
            },
            {
                "name": "Dept Management",
                "path": "dept",
                "keepalive": false,
                "updated_at": "2025-06-27 23:12:19",
                "remark": null,
                "menu_type": "menu",
                "created_at": "2025-06-27 23:12:19",
                "is_hidden": false,
                "redirect": null,
                "order": 5,
                "parent_id": 1,
                "id": 6,
                "component": "/system/dept"
            },
            {
                "name": "Audit Log",
                "path": "auditlog",
                "keepalive": false,
                "updated_at": "2025-06-27 23:12:19",
                "remark": null,
                "menu_type": "menu",
                "created_at": "2025-06-27 23:12:19",
                "is_hidden": false,
                "redirect": null,
                "order": 6,
                "parent_id": 1,
                "id": 7,
                "component": "/system/auditlog"
            }
        ]
    }
]