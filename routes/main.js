const fs = require('fs');
const router = require('express').Router();
const Task = require('../entities/task');
const dataSource = require('../dataSource');
const repository = dataSource.getRepository(Task);

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of your task
 *         description:
 *           type: string
 *           description: Describes in more detail about your task
 *         dueDate:
 *           type: timestamp
 *           format: date
 *           description: The deadline for the task
 *         isFinished:
 *           type: boolean
 *           description: Whether you have finished the task
 *       example:
 *         id: 23
 *         title: Workout at the gym
 *         description: Jumping jacks, burpees, pushups, jump squats, high knees 
 *         dueDate: 2024-02-28T03:00:00.000Z
 *         isFinished: false
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: General APIs
 * /:
 *   get:
 *     summary: Lists all the tasks, or an empty array if no tasks were found
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error   
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The created task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.route('/')
    .get(async (req, res) => {
        try {
            const data = await repository.find();
            res.json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    })
    .post(async (req, res) => {
        try {
            // const result = await repository.insert({
            //     title: req.body.title,
            //     description: req.body.description,
            //     dueDate: req.body.dueDate
            // });

            const record = await repository.create({
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.dueDate
            });
            const task = await repository.save(record);
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json(error);
        }
    });

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Specific task API
 * /{id}:
 *   get:
 *     summary: Get the task by id
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task response by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *        description: Server error
 * 
 *   patch:
 *     summary: Update the task by id
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
*          description: Task not found
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
    .get(async (req, res) => {
        try {
            const task = await repository.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (!task) {
                res.status(404).json('Task not found');
                return;
            }

            res.json(task);
        } catch (error) {
            res.status(500).json(error);
        }
    })
    .patch(async (req, res) => {
        try {
            const result = await repository.update(
                { id: req.params.id },
                {
                    title: req.body.title,
                    description: req.body.description,
                    dueDate: req.body.dueDate,
                    isFinished: req.body.isFinished
                });
            if (result.affected === 0) {
                res.status(404).json('Task not found');
                return;
            }
            res.status(200).json('Task updated successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    })
    .delete(async (req, res) => {
        try {
            const result = await repository.delete({ id: req.params.id });
            if (result.affected === 0) {
                res.status(404).json('Task not found');
                return;
            }
            res.status(200).json('Task deleted successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    });

module.exports = router;