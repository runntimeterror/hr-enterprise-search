const Knex = require('knex')

const connection = {
    ssl: { rejectUnauthorized: false },
    host: 'cmpe-272-database.c86shpa0bekf.us-east-1.rds.amazonaws.com',
    database: 'employees',
    user: 'admin',
    password: 'rajatmig29'
}

const knex = Knex({
    client: `mysql`,
    connection
})

exports.employeeHistoryHandler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    };
    const { id } = event.pathParameters
    let responseData = {}
    const historical_dept = []
    const historical_salaries = []
    const historical_titles = []
    try {
        const departments = await knex('department_history').where('emp_no', id)
        const titles = await knex('titles').where('emp_no', id)
        const salaries = await knex('salaries').where('emp_no', id)

        departments.forEach(dept => {
            const { dept_no, from_date, to_date, dept_name } = dept
            historical_dept.push({ dept_no, from_date, to_date, dept_name })
        })

        titles.forEach(his_title => {
            const { title, from_date, to_date } = his_title
            historical_titles.push({ title, from_date, to_date })
        })

        salaries.forEach(sal => {
            const { salary, from_date, to_date } = sal
            historical_salaries.push({ salary, from_date, to_date })
        })

        responseData = {
            departments: historical_dept,
            salaries: historical_salaries,
            titles: historical_titles
        }
    } catch (ex) {
        response.statusCode = 400
        response.body = ex
        console.error(ex)
        return response
    }
    response.body = JSON.stringify(responseData)
    return response;
};
