import { DEPT_MOCK } from './DEPT_MOCK'

function insertDeptNode(depts, parent_id, newDept) {
  for (const dept of depts) {
    if (dept.id === parent_id) {
      dept.children = dept.children || []
      dept.children.push(newDept)
      return true
    }
    if (insertDeptNode(dept.children || [], parent_id, newDept)) {
      return true
    }
  }
  return false
}

function updateDeptNode(depts, deptIn) {
  for (const dept of depts) {
    if (dept.id === deptIn.id) {
      if (deptIn.name !== undefined) dept.name = deptIn.name
      if (deptIn.desc !== undefined) dept.desc = deptIn.desc
      if (deptIn.order !== undefined) dept.order = deptIn.order
      if (deptIn.parent_id !== undefined) dept.parent_id = deptIn.parent_id
      return true
    }
    if (updateDeptNode(dept.children || [], deptIn)) {
      return true
    }
  }
  return false
}

function deleteDeptNode(depts, deptId) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].id === deptId) {
      depts.splice(i, 1)
      return true
    }
    if (deleteDeptNode(depts[i].children || [], deptId)) {
      return true
    }
  }
  return false
}

function collectAllIds(nodes) {
  let ids = []
  for (const node of nodes) {
    ids.push(node.id)
    ids = ids.concat(collectAllIds(node.children || []))
  }
  return ids
}

let deptData = JSON.parse(JSON.stringify(DEPT_MOCK))

export default [
  {
    url: '/api/v1/dept/list',
    method: 'get',
    response: ({ query }) => {
      const { name } = query
      let data = deptData
      if (name) {
        const filterTree = (nodes) =>
          nodes
            .map((node) => {
              const match = node.name.includes(name)
              const children = filterTree(node.children || [])
              if (match || children.length) {
                return { ...node, children }
              }
              return null
            })
            .filter(Boolean)
        data = filterTree(data)
      }
      return { code: 200, data }
    },
  },

  {
    url: '/api/v1/dept/create',
    method: 'post',
    response: ({ body }) => {
      const allIds = collectAllIds(deptData)
      const newId = Math.max(...allIds, 0) + 1
      const newDept = {
        id: newId,
        name: body.name,
        desc: body.desc,
        order: body.order,
        parent_id: body.parent_id,
        children: [],
      }

      let inserted = false
      if (body.parent_id === 0) {
        deptData.push(newDept)
        inserted = true
      } else {
        inserted = insertDeptNode(deptData, body.parent_id, newDept)
      }

      if (!inserted) {
        return { code: 404, msg: 'parent dept not found' }
      }

      return { code: 200, msg: 'Created Successfully', data: newDept }
    },
  },

  {
    url: '/api/v1/dept/update',
    method: 'post',
    response: ({ body }) => {
      const updated = updateDeptNode(deptData, body)
      if (!updated) {
        return { code: 404, msg: 'cannot find department' }
      }
      return { code: 200, msg: 'Update Successfully' }
    },
  },

  {
    url: '/api/v1/dept/delete',
    method: 'delete',
    response: ({ query }) => {
      const { dept_id } = query
      const deleted = deleteDeptNode(deptData, Number(dept_id))
      if (!deleted) {
        return { code: 404, msg: 'department not found' }
      }
      return { code: 200, msg: 'Deleted Success' }
    },
  },
]
