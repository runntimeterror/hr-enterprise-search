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

exports.handler = async (event) => {
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

    const matchingNames = await knex.column('id', 'FirstName', 'LastName')
      .select()
      .from('view_employee_details')
      .where('FirstName', 'like', `%${searchText}%`)
      .orWhere('LastName', 'like', `%${searchText}%`)

    if (matchingNames.length > 0) {
      responseData.matches = matchingNames.map(record => {
        return {
          emp_no: record.id,
          emp_name: `${record.FirstName} ${record.LastName}`
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
