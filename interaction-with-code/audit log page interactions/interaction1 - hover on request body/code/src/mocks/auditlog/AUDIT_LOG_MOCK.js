export const AUDIT_LOG_MOCK = [
    {
        "summary": "fetch audit log",
        "path": "/api/v1/auditlog/list",
        "method": "GET",
        "response_body": {
            "code": 200,
            "msg": null,
            "data": [
                {
                    "status": 200,
                    "request_args": {
                        "start_time": "2025-06-28 00:00:00",
                        "end_time": "2025-06-28 23:59:59",
                        "method": "POST",
                        "page": "1",
                        "page_size": "10"
                    },
                    "id": 284,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/auditlog/list",
                    "response_time": 4,
                    "created_at": "2025-06-28 18:43:53",
                    "module": "audit log",
                    "summary": "fetch audit log",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:53"
                },
                {
                    "status": 200,
                    "request_args": {
                        "start_time": "2025-06-28 00:00:00",
                        "end_time": "2025-06-28 23:59:59",
                        "method": "GET",
                        "page": "1",
                        "page_size": "10"
                    },
                    "id": 283,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/auditlog/list",
                    "response_time": 14,
                    "created_at": "2025-06-28 18:43:49",
                    "module": "audit log",
                    "summary": "fetch audit log",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:49"
                },
                {
                    "status": 200,
                    "request_args": {
                        "start_time": "2025-06-28 00:00:00",
                        "end_time": "2025-06-28 23:59:59",
                        "page": "1",
                        "page_size": "10"
                    },
                    "id": 282,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/auditlog/list",
                    "response_time": 7,
                    "created_at": "2025-06-28 18:43:44",
                    "module": "audit log",
                    "summary": "fetch audit log",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:44"
                },
                {
                    "status": 200,
                    "request_args": {
                        "page": "1",
                        "page_size": "10"
                    },
                    "id": 281,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/role/list",
                    "response_time": 3,
                    "created_at": "2025-06-28 18:43:36",
                    "module": "role",
                    "summary": "fetch role list",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:36"
                },
                {
                    "status": 200,
                    "request_args": {},
                    "id": 280,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/base/userapi",
                    "response_time": 0,
                    "created_at": "2025-06-28 18:43:36",
                    "module": "base",
                    "summary": "fetch user API",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:36"
                },
                {
                    "status": 200,
                    "request_args": {},
                    "id": 279,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/base/usermenu",
                    "response_time": 1,
                    "created_at": "2025-06-28 18:43:36",
                    "module": "base",
                    "summary": "fetch user menu",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:36"
                },
                {
                    "status": 200,
                    "request_args": {},
                    "id": 278,
                    "method": "GET",
                    "username": "",
                    "path": "/api/v1/base/userinfo",
                    "response_time": 2,
                    "created_at": "2025-06-28 18:43:36",
                    "module": "base",
                    "summary": "fetch user data",
                    "user_id": 0,
                    "updated_at": "2025-06-28 18:43:36"
                }
            ],
            "total": 283,
            "page": 1,
            "page_size": 10
        },
        "created_at": "2025-06-28 18:46:34",
        "response_time": 7,
        "updated_at": "2025-06-28 18:46:34",
        "module": "audit log",
        "request_args": {
            "start_time": "2025-06-28 00:00:00",
            "end_time": "2025-06-28 23:59:59",
            "page": "1",
            "page_size": "10"
        },
        "status": 200,
        "username": "admin",
        "user_id": 0,
        "id": 288
    },
    {
        "summary": "fetch dept list",
        "path": "/api/v1/dept/list",
        "method": "GET",
        "response_body": {
            "code": 200,
            "msg": "OK",
            "data": []
        },
        "created_at": "2025-06-28 18:43:59",
        "response_time": 2,
        "updated_at": "2025-06-28 18:43:59",
        "module": "department",
        "request_args": {},
        "status": 200,
        "username": "",
        "user_id": 0,
        "id": 287
    },
    {
        "summary": "fetch role list",
        "path": "/api/v1/role/list",
        "method": "GET",
        "response_body": {
            "code": 200,
            "msg": null,
            "data": [
                {
                    "id": 1,
                    "desc": "管理员角色",
                    "name": "管理员",
                    "created_at": "2025-06-27 23:12:19",
                    "updated_at": "2025-06-28 18:41:58"
                },
                {
                    "id": 2,
                    "desc": "普通用户角色",
                    "name": "普通用户",
                    "created_at": "2025-06-27 23:12:19",
                    "updated_at": "2025-06-27 23:12:19"
                }
            ],
            "total": 2,
            "page": 1,
            "page_size": 9999
        },
        "created_at": "2025-06-28 18:43:57",
        "response_time": 3,
        "updated_at": "2025-06-28 18:43:57",
        "module": "role",
        "request_args": {
            "page": "1",
            "page_size": "9999"
        },
        "status": 200,
        "username": "",
        "user_id": 0,
        "id": 286
    },
    {
        "summary": "fetch user list",
        "path": "/api/v1/user/list",
        "method": "GET",
        "response_body": {
            "code": 200,
            "msg": null,
            "data": [
                {
                    "alias": null,
                    "id": 1,
                    "last_login": "2025-06-28 17:10:46",
                    "phone": null,
                    "username": "admin",
                    "created_at": "2025-06-27 23:12:19",
                    "is_active": true,
                    "email": "admin@admin.com",
                    "is_superuser": true,
                    "updated_at": "2025-06-28 17:10:46",
                    "roles": [],
                    "dept": {}
                }
            ],
            "total": 1,
            "page": 1,
            "page_size": 10
        },
        "created_at": "2025-06-28 18:43:57",
        "response_time": 7,
        "updated_at": "2025-06-28 18:43:57",
        "module": "user",
        "request_args": {
            "page": "1",
            "page_size": "10"
        },
        "status": 200,
        "username": "",
        "user_id": 0,
        "id": 285
    },
]