const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/employee_tracker')

function menu() {
  prompt(
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'option',
      choices: [
        'View departments',
        'View roles',
        'View employees',
        'Add department',
        'Add roles',
        'Add employees',
        'Delete departments',
        'Delete employee',
        'Delete roles',
        'Update employee roles',
        'Update employee manager',
        'View employee by manager',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.option) {
        case "View departments":
          viewAllDepartments()
          break
        case "View roles":
          viewAllRoles()
          break
        case "View employees":
          viewAllEmployees()
          break
        case "Add department":
          addDepartment()
          break
        case "Add roles":
          addRoles()
          break
        case "Add employees":
          addEmployee()
          break
        case "Update employee roles":
          updateEmployeeRole()
          break
        case "delete departments":
          deleteDepartment()
          break
        case "Delete employee":
          deleteEmployee()
          break
        case "Delete roles":
          deleteRole()
          break
        case "Update employee manager":
          updateManager()
          break
        case "View employee by manager":
          viewEmployeeByManager()
          break
        case "Exit":
          process.exit()
      }
    })
    .catch(err => console.log(err))
}

const viewAllDepartments = () => {
  db.query(
    'SELECT * FROM Department', (err, res) => {
      if (err) { console.log(err) }
      console.table(res)
      menu()
    }
  )
}

const viewAllRoles = () => {
  db.query(
    'SELECT ro.title AS Role_title, ro.salary AS Salary, dept.name AS DepartmentName FROM Role ro LEFT JOIN department AS dept ON dept.id = ro.department_id', (err, res) => {
      if (err) { console.log(err) }
      console.table(res)
      menu()
    }
  )
}

const viewAllEmployees = () => {
  const sql = 'SELECT emp.id AS Employee_ID, CONCAT(emp.first_name,"  ",emp.last_name ) AS Employee_Name, ro.title AS Job_title, ro.salary AS Salary, dept.name AS Department_Name, CONCAT(emp2.first_name,"  ",emp2.last_name) AS Manager_Name FROM employee_tracker.employee AS emp LEFT JOIN employee_tracker.employee AS emp2 ON emp2.id=emp.manager_id LEFT JOIN employee_tracker.Role AS ro ON emp.role_id=ro.id LEFT JOIN employee_tracker.department AS dept on dept.id = ro.department_id;'
  db.query(
    sql,
    (err, res) => {
      if (err) { console.log(err) }
      console.table(res)
      menu()
    }
  )
}

const addDepartment = () => {
  prompt([
    {
      type: 'input',
      name: 'department',
      message: 'Please add a department name:'
    }

  ])
  .then(answer => {
    db.query('INSERT INTO department SET?', { name: answer.department }, (err, res) => {
      if (err) { console.log(err) }
      console.log('Added new department')
      menu()
    })
  })
  .catch(err => console.log(err))
}

const addRoles = () => {
  // query all the depts
  db.promise().query("SELECT * FROM Department")
    .then((res) => {
      // make the choice dept arr
      return res[0].map(dept => {
        return {
          name: dept.name,
          value: dept.id
        }
      })
    })
    .then((departments) => {
      return prompt([
        {
          type: 'input',
          name: 'roles',
          message: 'Please add a role:'
        },

        {
          type: 'input',
          name: 'salary',
          message: 'Please enter a salary:'
        },

        {
          type: 'list',
          name: 'depts',
          choices: departments,
          message: 'Please select your department.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query('INSERT INTO role SET ?', { title: answer.roles, salary: answer.salary, department_id: answer.depts })
    })
    .then(res => {
      console.log('Added new role')
      menu()
    })
    .catch(err => console.log(err))
}

const selectRole = () => {
  return db.promise().query("SELECT * FROM role")
    .then(res => {
      return res[0].map(role => {
        return {
          name: role.title,
          value: role.id
        }
      })
    })
    .catch(err => console.log(err))
}

const selectManager = () => {
  return db.promise().query("SELECT * FROM employee ")
    .then(res => {
      return res[0].map(manager => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        }
      })
    })
    .catch(err => console.log(err))
}

async function addEmployee() {
  const managers = await selectManager()
  prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter their first name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter their last name "
    },
    {
      name: "role",
      type: "list",
      message: "What is their role? ",
      choices: await selectRole()
    },
    {
      name: "manager",
      type: "list",
      message: "Whats their managers name?",
      choices: managers
    }
  ])
  .then(function (res) {
    let roleId = res.role
    let managerId = res.manager

    console.log({ managerId })
    db.query("INSERT INTO Employee SET ?",
      {
        first_name: res.firstname,
        last_name: res.lastname,
        manager_id: managerId,
        role_id: roleId

      }, function (err) {
        if (err) { console.log(err) }
        console.table(res)
        menu()
      })
  })
}

const updateEmployeeRole = () => {
  db.promise().query('SELECT *  FROM employee')
    .then((res) => {
      return res[0].map(employee => {
        return {
          name: employee.first_name,
          value: employee.id
        }
      })
    })
    .then(async (employeeList) => {
      return prompt([
        {
          type: 'list',
          name: 'employeeListId',
          choices: employeeList,
          message: 'Please select the employee you want to update a role:.'
        },
        {
          type: 'list',
          name: 'roleId',
          choices: await selectRole(),
          message: 'Please select the role.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query("UPDATE employee SET  role_id = ? WHERE id = ?",
        [
          answer.roleId,
          answer.employeeListId,
        ],
      )
    })
    .then(res => {
      console.log('Updated Manager Successfully')
      menu()
    })
    .catch(err => console.log(err))
}

const deleteDepartment = () => {
  db.promise().query('SELECT * FROM Department')
    .then((res) => {
      return res[0].map(dept => {
        return {
          name: dept.name,
          value: dept.id
        }
      })
    })
    .then((departments) => {
      return prompt([
        {
          type: 'list',
          name: 'deptId',
          choices: departments,
          message: 'Please select the department you want to delete.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query('DELETE FROM Department WHERE id = ?', answer.deptId)
    })
    .then(res => {
      console.log('Department Deleted Successfully')
      menu()
    })
    .catch(err => console.log(err))
}

const deleteEmployee = () => {
  db.promise().query('SELECT * FROM employee')
    .then((res) => {
      return res[0].map(emp => {
        return {
          name: emp.first_name,
          value: emp.id
        }
      })
    })
    .then((employees) => {
      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          choices: employees,
          message: 'Please select the employee you want to delete.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query('DELETE FROM Employee WHERE id = ?', answer.employeeId)

    })
    .then(res => {
      console.log('Employee Deleted Successfully')
      menu()
    })
    .catch(err => console.log(err))
}

const deleteRole = () => {
  db.promise().query('SELECT title, id FROM role')
    .then((res) => {
      // make the choice dept arr
      return res[0].map(roles => {
        return {
          name: roles.title,
          value: roles.id
        }
      })
    })
    .then((employeeRoles) => {
      return prompt([
        {
          type: 'list',
          name: 'roleId',
          choices: employeeRoles,
          message: 'Please select the employee you want to delete.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query('DELETE FROM Role WHERE id = ?', answer.roleId)
    })
    .then(res => {
      console.log('Role Deleted Successfully')
      menu()
    })
    .catch(err => console.log(err))
}

const updateManager = () => {
  db.promise().query('SELECT *  FROM employee')
    .then((res) => {
      // make the choice dept arr
      return res[0].map(employee => {
        return {
          name: employee.first_name,
          value: employee.id
        }
      })
    })
    .then(async (employeeList) => {
      return prompt([
        {
          type: 'list',
          name: 'employeeListId',
          choices: employeeList,
          message: 'Please select the employee you want to assign manager to:.'
        },
        {
          type: 'list',
          name: 'managerId',
          choices: await selectManager(),
          message: 'Please select the employee you want to make manager.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query("UPDATE employee SET  manager_id = ? WHERE id = ?",
        [
          answer.managerId,
          answer.employeeListId,
        ],
      )
    })
    .then(res => {
      console.log('Updated Manager Successfully')
      menu()
    })
    .catch(err => console.log(err))
}

function viewEmployeeByManager() {
  db.promise().query('SELECT *  FROM employee')
    .then((res) => {
      // make the choice dept arr
      return res[0].map(employee => {
        return {
          name: employee.first_name,
          value: employee.id
        }
      })
    })
    .then(async (managerList) => {
      return prompt([
        {
          type: 'list',
          name: 'managerId',
          choices: managerList,
          message: 'Please select the manager you want to view employee by.'
        }
      ])
    })
    .then(answer => {
      console.log(answer)
      return db.promise().query('SELECT * from Employee where manager_id=?', answer.managerId)
    })
    .then(res => {
      console.table(res[0])
      menu()
    })
    .catch(err => console.log(err))
}
menu()