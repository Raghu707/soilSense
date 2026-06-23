import axios from "axios";

const API = "https://soilsense-1-zp8c.onrender.com/api";
// const API= "http://localhost:5000/api";

// ✅ Get token helper
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};


/* =================================
   ✅ AUTH APIs
================================= */

export const login = (data: any) => {
  return axios.post(`${API}/users/login`, data);
};

export const register = (data: any) => {
  return axios.post(`${API}/users/register`, data);
};


/* =================================
   ✅ PROJECT APIs (UPDATED ✅)
================================= */

// ✅ Get all projects (admin + student)
export const getProjects = () => {
  return axios.get(`${API}/projects`, getAuthHeader());
};

// ✅ Get single project (for details page later)
export const getProjectById = (id: string) => {
  return axios.get(`${API}/projects/${id}`, getAuthHeader());
};

// ✅ Create project (admin)
export const createProject = (data: any) => {
  return axios.post(`${API}/projects`, data, getAuthHeader());
};

// ✅ Update project
export const updateProject = (id: string, data: any) => {
  return axios.put(`${API}/projects/${id}`, data, getAuthHeader());
};

// ✅ Delete project
export const deleteProject = (id: string) => {
  return axios.delete(`${API}/projects/${id}`, getAuthHeader());
};


/* =================================
   ✅ SENSOR APIs
================================= */

export const getSensors = () => {
  return axios.get(`${API}/sensors/all-sensors`, getAuthHeader());
};

export const getSensorById = (id: string) => {
  return axios.get(`${API}/sensors/all-sensors/${id}`, getAuthHeader());
};

export const createSensor = (data: any) => {
  return axios.post(`${API}/sensors/add-sensor`, data, getAuthHeader());
};

export const updateSensor = (id: string, data: any) => {
  return axios.put(`${API}/sensors/add-sensor/${id}`, data, getAuthHeader());
};

export const deleteSensor = (id: string) => {
  return axios.delete(`${API}/sensors/all-sensors/${id}`, getAuthHeader());
};
export function getUsers() {
  return axios.get('/api/users');
}

// ✅ Fetch Tuya data
export const fetchSensorData = (sensorId: string) => {
  return axios.post(
    `${API}/sensors/fetch`,
    { sensorId },
    getAuthHeader()
  );
};


/* =================================
   ✅ OBSERVATION APIs
================================= */

export const getObservations = () => {
  return axios.get(`${API}/observations`, getAuthHeader());
};

export const getObservationById = (id: string) => {
  return axios.get(`${API}/observations/${id}`, getAuthHeader());
};

export const createObservation = (data: any) => {
  return axios.post(`${API}/observations`, data, getAuthHeader());
};

export const deleteObservation = (id: string) => {
  return axios.delete(`${API}/observations/${id}`, getAuthHeader());
};
export function getStudents() {
  return axios.get(`${API}/users/students`, getAuthHeader())
 
}

export function registerUser(data: any) {
  return axios.post(`${API}/users/register`, data, getAuthHeader());
}

export function deleteUser(id: string) {
  return axios.delete(`${API}/users/${id}`, getAuthHeader());
}
