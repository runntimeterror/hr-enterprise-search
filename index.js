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
  const { searchText } = event.pathParameters
  let responseData = {}
  try {

    const matchingNames = await knex.column('emp_no', 'first_name', 'last_name')
      .select()
      .from('employees')
      .where('first_name', 'like', `%${searchText}%`)
      .orWhere('last_name', 'like', `%${searchText}%`)

    if (matchingNames.length > 0) {
      responseData.matches = matchingNames.map(record => {
        return {
          emp_no: record.emp_no,
          emp_name: `${record.first_name} ${record.last_name}`
        }
      })
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
