import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    // define a temporary array to hold the result
    let tasks = this.getAllTasks();

    // do something with status
    if (status) {
      tasks = tasks.filter((tasks) => tasks.status === status);
    }

    // do something with search
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }
    // return final result

    return tasks;
  }

  getTaskById(id: string): Task {
    const foundTask = this.tasks.find((task: Task) => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return foundTask;
  }

  deleteTaskById(id: string): void {
    const taskToBeRemoved = this.tasks.find((task: Task) => task.id === id);
    const index = this.tasks.indexOf(taskToBeRemoved);
    this.tasks.splice(index, 1);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

}
