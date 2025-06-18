import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: taskData.completed || false,
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || 'user1'
    };
    tasks = [...tasks, newTask];
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: tasks[index].Id // Preserve original Id
    };
    
    tasks = [
      ...tasks.slice(0, index),
      updatedTask,
      ...tasks.slice(index + 1)
    ];
    
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks = [
      ...tasks.slice(0, index),
      ...tasks.slice(index + 1)
    ];
    
    return true;
  },

  async toggleComplete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed
    };
    
    tasks = [
      ...tasks.slice(0, index),
      updatedTask,
      ...tasks.slice(index + 1)
    ];
    
    return { ...updatedTask };
  },

  async getOverdue() {
    await delay(200);
    const now = new Date();
    return tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < now
    );
  },

  async getToday() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    });
  }
};

export default taskService;