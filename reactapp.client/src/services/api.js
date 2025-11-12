import axios from 'axios';

const API_URL = 'https://localhost:7011/api/tasks'; // Update to your API URL (e.g., after deploying or local)

// MAP .NET enum (0,1,2) → React strings
const statusMap = {
    0: 'ToDo',
    1: 'InProgress',
    2: 'Done'
};

const reverseStatusMap = {
    'ToDo': 0,
    'InProgress': 1,
    'Done': 2
};

const mapTaskFromApi = (task) => ({
    ...task,
    status: statusMap[task.status] ?? 'ToDo',
    isCompleted: task.isCompleted === true,
    requestDate: task.requestDate,
    dueDate: task.dueDate,
});

const mapTaskToApi = (task) => ({
    ...task,
    status: reverseStatusMap[task.status] ?? 0,  // ← CONVERT STRING TO NUMBER
    isCompleted: task.isCompleted === true,
    requestDate: task.requestDate,
    dueDate: task.dueDate,
});

export const getAllTasks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.map(mapTaskFromApi);  // ← MAP HERE
    } catch (error) {
        console.error('API Error:', error);
        return []; // fallback
    }
   
};

export const getTaskById = async id => {
    const response = await axios.get(`${API_URL}/${id}`);
    return mapTaskFromApi(response.data);
};

export const createTask = async data => {
    const payload = mapTaskToApi(data);
    await axios.post(API_URL, payload);
};

export const updateTask = async (id, data) => {
    await axios.put(`${API_URL}/${id}`, data);
};

export const deleteTask = async id => {
    await axios.delete(`${API_URL}/${id}`);
};