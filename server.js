const mysql = require('mysql');
const inquirer = require('inquirer')
const cTable = require('console.table');
const roleQuery = 'SELECT * from role; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employee e';


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '8016350968',
      database: 'employee_tracker'
    },
    console.log('Connected to the employee_tracker database.')
  );

  const firstPrompt= () => {
    return inquirer
        .prompt(
            {
                type: "list",
                name: "options",
                message: "Choose an option?",
                choices: [

                "View all departments", 
                'View all roles',
                'View all employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update employee',
                'Exit']
            },
        )
    
            .then(function({options}) {
                switch(options) {

                    case "View all departments":
                    viewDepartments()
                    break;

                    case 'View all roles':
                    viewRoles()
                    break;

                    case 'View all employees':
                    viewEmployees()
                    break;

                    case 'Add department':
                    addDepartment()
                    break;

                    case 'Add role':
                    addRole()
                    break;

                    case 'Add employee':
                    addEmployee();
                    break;

                    case 'Update employee':
                    updateEmployee();
                    break;
                }
            })
            .catch();
        }

function viewDepartments() {
    
    var query = 'SELECT * FROM department'

    db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Department viewed!");  
    firstPrompt();

})
};

function viewRoles() {
    
    var query = 'SELECT * FROM role'

    db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Roles viewed!");  
    firstPrompt();

})
};

function viewEmployees() {
    
    var query = 'SELECT * FROM employee'

    db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Roles viewed!");  
    firstPrompt();
})
};



function addDepartment() {


    inquirer
    .prompt([
        {
            type: 'input',
            name: "addDepartment",
            message: "What is the name of the department you want to add?"
        }
    ])
    .then((answer) => {
        const sql = 'INSERT INTO department (department_name) VALUES (?)';
        
            db.query(sql, answer.addDepartment, (err, res) => {
            if (err) throw err;
            viewDepartments();
    });
    });
    

};


function addRole() { 
    db.query("SELECT role.title AS title, role.salary AS salary FROM role",   function(err, res) {
      inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: "What is the title of the new role?"
          },
          {
            type: 'input',
            name: 'salary',
            message: "What is the salary of the new role?"
          } 
      ]).then(function(res) {
          db.query(
              "INSERT INTO role SET ?",
              {
                title: res.title,
                salary: res.salary,
                department_id: 1,
              },
              function(err) {
                  if (err) throw err
                  console.table(res);
                  firstPrompt();
              }
          )
  
      });
    });
    }   


function addEmployee() {
        db.query(`SELECT * FROM role`, (err, res) => {
            if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstname',
                message: "What is the first name of the employee you want to add?"
            },
            {
                type: 'input',
                name: 'lastname',
                message: "What is the last name of the employee you want to add?"
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'What is their role?',
                choices() {
                    let roleArray = [];
		            //db.query(`SELECT id, title FROM role`, (err, res) => {
			        //if (err) throw err;

			        res.forEach((element) => {
				    roleArray.push(`${element.id} ${element.title}`);
                    })
                    return roleArray
                }
            }
            
            
        ]).then(function(res) {
            console.log(res);
            let roleCode = parseInt(res.roleId.split(' '));
            db.query(`INSERT INTO employee SET ?`,
                {
                  first_name: res.firstname,
                  last_name: res.lastname,
                  role_id: roleCode,
            
                },
                function(err) {
                    if (err) throw err
                    console.table(res);
                    viewEmployees();
                }
            )
    
        });
        
});
}

function updateEmployee() {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which employee do you want to update',
                choices() {
                    let employeeArray = [];

			        res.forEach((element) => {
				    employeeArray.push(`${element.first_name} ${element.last_name}`);
                    })
                    return employeeArray
                }
        }]).then(res =>{
            db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name)=?`, res.name, (err, data) => {
                if (err) { throw err 
                } else {
                    let theEmployee = JSON.stringify(data[0].id)
                    console.log("The Employee: ",theEmployee)
                    db.query(`SELECT * FROM role`, (err, res) => {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'roleId',
                            message: 'What is their new role?',
                            choices() {
                                let roleArray = [];
                                //db.query(`SELECT id, title FROM role`, (err, res) => {
                                //if (err) throw err;
            
                                res.forEach(({title}) => {
                                roleArray.push(title);
                                })
                                return roleArray
                            }
                        }
                
                    ]).then(answer =>{
                        db.query(`SELECT id FROM role WHERE title=?`, answer.roleId, (err, data) => {
                                if (err) { throw err;
                            } else {
                                console.log("data: ",data)
                                let theRole = JSON.stringify(data[0].id)
                                console.log("The Role: ",theRole)
                                db.query(`UPDATE employee SET role_id=? WHERE id=?`, [parseInt(theRole), parseInt(theEmployee)], (err) => {
                                    if (err) throw err;
                                    console.log('update successfull')
                                    viewEmployees();
                                    firstPrompt();
                                })
                            }
                        })
                    })
                })
    
            }
        })
    })

})}
firstPrompt();