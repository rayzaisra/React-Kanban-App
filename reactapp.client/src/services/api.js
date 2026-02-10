import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tasks`;
const BOARD_URL = `${import.meta.env.VITE_API_BASE_URL}/board`;
const PREFS_URL = `${import.meta.env.VITE_API_BASE_URL}/userpreferences`;

// Status mapping (API uses integers)
const statusMap = {
    0: 'ToDo',
    1: 'InProgress',
    2: 'Done'
};

const reverseStatusMap = {
    'ToDo': 'ToDo',
    'InProgress': 'InProgress',
    'Done': 'Done'
};

// Priority mapping
export const priorityMap = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
    3: 'Critical'
};

export const reversePriorityMap = {
    'Low': '0',
    'Medium': '1',
    'High': '2',
    'Critical': '3'
};

const mapTaskFromApi = (task) => ({
    ...task,
    status: statusMap[task.status] ?? 'ToDo',
    isCompleted: task.isCompleted === true,
    requestDate: task.requestDate,
    dueDate: task.dueDate,
    taskType: task.taskType || 'Enhance',
    priority: priorityMap[task.priority] ?? 'Medium',
});

const mapTaskToApi = (task) => ({
    ...task,
    status: reverseStatusMap[task.status] ?? 'ToDo',
    isCompleted: task.isCompleted === true,
    requestDate: task.requestDate,
    dueDate: task.dueDate,
    taskType: task.taskType || 'Enhance',
    priority: reversePriorityMap[task.priority] ?? '1',
});

// Task operations
export const getAllTasks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.map(mapTaskFromApi);
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

export const getTasksPaginated = async ({
    page = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
}) => {
    try {
        const response = await axios.get(`${API_URL}/paginated`, {
            params: { page, pageSize, sortBy, sortOrder }
        });
        return {
            tasks: response.data.tasks.map(mapTaskFromApi),
            hasMore: response.data.hasMore,
            currentPage: response.data.currentPage,
            pageSize: response.data.pageSize,
            totalCount: response.data.totalCount
        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const searchTasks = async ({
    searchTerm = '',
    page = 1,
    pageSize = 10,
    taskType = '',
    status = '',
    priority = null,
    overdue = null
}) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { searchTerm, page, pageSize, taskType, status, priority, overdue }
        });
        return {
            tasks: response.data.tasks.map(mapTaskFromApi),
            hasMore: response.data.hasMore,
            currentPage: response.data.currentPage,
            pageSize: response.data.pageSize,
            totalCount: response.data.totalCount
        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
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
    const payload = mapTaskToApi(data);
    await axios.put(`${API_URL}/${id}`, payload);
};

export const deleteTask = async id => {
    await axios.delete(`${API_URL}/${id}`);
};

// Analytics
export const getAnalyticsSummary = async () => {
    const response = await axios.get(`${API_URL}/analytics/summary`);
    return response.data;
};

export const getTasksByType = async () => {
    const response = await axios.get(`${API_URL}/analytics/by-type`);
    return response.data;
};

export const getTasksByPriority = async () => {
    const response = await axios.get(`${API_URL}/analytics/by-priority`);
    return response.data;
};

// Board customization
export const getBoardColumns = async () => {
    const response = await axios.get(`${BOARD_URL}/columns`);
    return response.data;
};

export const createBoardColumn = async (data) => {
    const response = await axios.post(`${BOARD_URL}/columns`, data);
    return response.data;
};

export const updateBoardColumn = async (id, data) => {
    await axios.put(`${BOARD_URL}/columns/${id}`, data);
};

export const deleteBoardColumn = async (id) => {
    await axios.delete(`${BOARD_URL}/columns/${id}`);
};

export const reorderBoardColumns = async (columnIds) => {
    await axios.put(`${BOARD_URL}/columns/reorder`, columnIds);
};

// User preferences
export const getUserPreferences = async (userId) => {
    const response = await axios.get(`${PREFS_URL}/${userId}`);
    return response.data;
};

export const updateUserPreferences = async (userId, data) => {
    const response = await axios.post(`${PREFS_URL}/${userId}`, data);
    return response.data;
};