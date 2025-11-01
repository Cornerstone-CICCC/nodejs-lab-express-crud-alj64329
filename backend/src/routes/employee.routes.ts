import { Router, Request, Response } from 'express'
import { Employee } from '../types/employee'
import { v4 as uuidv4 } from 'uuid'

const employeeRouter = Router()

const employees: Employee[] = [
    {
        id: '1',
        firstname: "John",
        lastname:'Smith',
        age: 40,
        isMarried: true
    },
    {
        id:'2',
        firstname:"Jane",
        lastname:"Doe",
        age:32,
        isMarried: false
    }
]

/**
 * Get employees
 * 
 * @route GET /employees
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with employees list object.
 */
employeeRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json(employees)
})

/**
* Search employees by firstname.
* 
* @route GET /employees/search?firstname=somevalue
* @query {string} firstname - The firstname to search for.
* @param {Request<{}, {}, {}, { firstname: string }>} req - Express request containing query parameters.
* @param {Response} res - Express response object.
* @returns {void} Responds with an array of matched user objects or an error message.
*/
employeeRouter.get('/search', (req: Request<{}, {}, {}, { firstname: string }>, res: Response) => {
  const { firstname } = req.query
  const foundEmployees = employees.filter(user => user.firstname.toLowerCase().includes(firstname.toLowerCase()))
  if (foundEmployees.length === 0) {
    res.status(404).send("No matching employees!")
    return
  }
  res.status(200).json(foundEmployees)
})

/**
 * Get user by ID
 * 
 * @route GET /employees/:id
 * @param {Request} req - Express request containing user ID.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with user matching ID.
 */
employeeRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const employee = employees.find(user => user.id === id)
  if (!employee) {
    res.status(404).send("Employee not found")
    return
  }
  res.status(200).json(employee)
})

/**
 * Adds a new user to the system.
 *
 * @route POST /employees
 * @param {Request<{}, {}, Omit<User, 'id'>>} req - Express request containing the user data in the body.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with the newly created user.
 */
employeeRouter.post("/", (req: Request<{}, {}, Omit<Employee, 'id'>>, res: Response) => {
  const newEmployee: Employee = {
    id: uuidv4(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    isMarried: req.body.isMarried
  }
  employees.push(newEmployee)
  res.status(201).json(newEmployee)
})

/**
 * Updates a user by ID.
 *
 * @route PUT /employees/:id
 * @param {Request<{ id: string }, {}, Partial<User>>} req - Express request containing the user ID in params and the update fields in the body.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with the updated user or an error if not found.
 */
employeeRouter.put("/:id", (req: Request<{ id: string }, {}, Partial<Employee>>, res: Response) => {
  const { id } = req.params
  const foundIndex = employees.findIndex(user => user.id === id)
  if (foundIndex === -1) {
    res.status(404).send("Employee not found")
    return
  }
  const updatedEmoloyee: Employee = {
    ...employees[foundIndex], // Copy over all properties
    firstname: req.body.firstname ?? employees[foundIndex].firstname,
    lastname: req.body.lastname ?? employees[foundIndex].lastname,
    age: req.body.age ?? employees[foundIndex].age,
    isMarried: req.body.isMarried ?? employees[foundIndex].isMarried
  }
  employees[foundIndex] = updatedEmoloyee
  res.status(200).json(updatedEmoloyee)
})


/**
 * Deletes a user by ID.
 * 
 * @route DELETE /employees/:id
 * @param {Request<{ id: string }>} req - Express request containing user id.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with a message that user was deleted.
 */
employeeRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const foundIndex = employees.findIndex(user => user.id === id)
  if (foundIndex === -1) {
    res.status(404).send("Employee not found")
    return
  }
  employees.splice(foundIndex, 1)
  res.status(200).send("Employee was deleted!")
})

export default employeeRouter
