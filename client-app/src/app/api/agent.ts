import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { Photo, Profile, UserActivity } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = "http://localhost:5000/api";

// include token as a header in requests
axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

// Let pass a second in every response to simulate a busy prod environment.
// Handle rejections by navigating to other components of poping up toasts.
axios.interceptors.response.use(async response => {
  await sleep(1000);
  
  // override response to include pagination metadata if there is any
  const pagination = response.headers["pagination"];
  if (pagination) {
    response.data = new PaginatedResult(response.data, JSON.parse(pagination));
    return response as AxiosResponse<PaginatedResult<any>>;
  }

  return response;
}, (error: AxiosError) => {
  const { data, status, config } = error.response as AxiosResponse;
  switch (status) {
    case 400:
      if (config.method === 'get'
        && Object.prototype.hasOwnProperty.call(data.errors, 'id'))
      {
        router.navigate('/not-found');
      }

      if (data.errors) {
        const modalStateErrors = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modalStateErrors.push(data.errors[key]);
          }
        }
        throw modalStateErrors.flat();
      } else {
        toast.error(data);
      }
      break;
    case 401:
      toast.error('unauthorized')
      break;
    case 403:
      toast.error('forbidden')
      break;
    case 404:
      router.navigate('/not-found')
      break;
    case 500:
      store.commonStore.setError(data);
      router.navigate('/server-error');
      break;
  }
  return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>("/activities", { params })
    .then(responseBody),
  
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) => requests.post<User>("/account/register", user)
}

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),

  update: (profile: Partial<Profile>) => requests.put<void>("/profiles", profile),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  listFollowing: (username: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),

  listActivities: (username: string, predicate: string) => 
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),

  // needed a payload to put the blob and perform the request
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: {"Content-Type": "multipart/form-data"}
    });
  },

  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`)
}

const agent = { Activities, Account, Profiles }

export default agent;