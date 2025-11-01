"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const employeeRouter = (0, express_1.Router)();
const employees = [
    {
        id: '1',
        firstname: "John",
        lastname: 'Smith',
        age: 40,
        isMarried: true
    },
    {
        id: '2',
        firstname: "Jane",
        lastname: "Doe",
        age: 32,
        isMarried: false
    }
];
/**
 * Get employees
 *
 * @route GET /employees
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with employees list object.
 */
employeeRouter.get('/', (req, res) => {
    res.status(200).json(employees);
});
/**
* Search employees by firstname.
*
* @route GET /employees/search?firstname=somevalue
* @query {string} firstname - The firstname to search for.
* @param {Request<{}, {}, {}, { firstname: string }>} req - Express request containing query parameters.
* @param {Response} res - Express response object.
* @returns {void} Responds with an array of matched user objects or an error message.
*/
employeeRouter.get('/search', (req, res) => {
    const { firstname } = req.query;
    const foundEmployees = employees.filter(user => user.firstname.toLowerCase().includes(firstname.toLowerCase()));
    if (foundEmployees.length === 0) {
        res.status(404).send("No matching employees!");
        return;
    }
    res.status(200).json(foundEmployees);
});
/**
 * Get user by ID
 *
 * @route GET /employees/:id
 * @param {Request} req - Express request containing user ID.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with user matching ID.
 */
employeeRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const employee = employees.find(user => user.id === id);
    if (!employee) {
        res.status(404).send("Employee not found");
        return;
    }
    res.status(200).json(employee);
});
/**
 * Adds a new user to the system.
 *
 * @route POST /employees
 * @param {Request<{}, {}, Omit<User, 'id'>>} req - Express request containing the user data in the body.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with the newly created user.
 */
employeeRouter.post("/", (req, res) => {
    const newEmployee = {
        id: (0, uuid_1.v4)(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        isMarried: req.body.isMarried
    };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});
/**
 * Updates a user by ID.
 *
 * @route PUT /employees/:id
 * @param {Request<{ id: string }, {}, Partial<User>>} req - Express request containing the user ID in params and the update fields in the body.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with the updated user or an error if not found.
 */
employeeRouter.put("/:id", (req, res) => {
    var _a, _b, _c, _d;
    const { id } = req.params;
    const foundIndex = employees.findIndex(user => user.id === id);
    if (foundIndex === -1) {
        res.status(404).send("Employee not found");
        return;
    }
    const updatedEmoloyee = Object.assign(Object.assign({}, employees[foundIndex]), { firstname: (_a = req.body.firstname) !== null && _a !== void 0 ? _a : employees[foundIndex].firstname, lastname: (_b = req.body.lastname) !== null && _b !== void 0 ? _b : employees[foundIndex].lastname, age: (_c = req.body.age) !== null && _c !== void 0 ? _c : employees[foundIndex].age, isMarried: (_d = req.body.isMarried) !== null && _d !== void 0 ? _d : employees[foundIndex].isMarried });
    employees[foundIndex] = updatedEmoloyee;
    res.status(200).json(updatedEmoloyee);
});
/**
 * Deletes a user by ID.
 *
 * @route DELETE /employees/:id
 * @param {Request<{ id: string }>} req - Express request containing user id.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with a message that user was deleted.
 */
employeeRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const foundIndex = employees.findIndex(user => user.id === id);
    if (foundIndex === -1) {
        res.status(404).send("Employee not found");
        return;
    }
    employees.splice(foundIndex, 1);
    res.status(200).send("Employee was deleted!");
});
exports.default = employeeRouter;
