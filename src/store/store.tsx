import { create } from 'zustand';
import { AxiosError } from 'axios';
import { FetchTasksParams, FilterType, Task, TaskStatus } from '../store/types';
import {
  getTasks,
  getTaskById,
  postTask,
  putTask,
  deleteTask,
} from '../api/api';

export interface TaskState {
  tasks: Task[];
  favoriteIds: number[];
  isLoadingTasks: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filter: FilterType;
  editingItem: Task | null;
  isModalVisible: boolean;
  showModal: (task?: Task | null) => void;
  hideModal: () => void;
  setFilter: (filter: FilterType) => void;
  fetchTasks: (params?: FetchTasksParams, isLoadMore?: boolean) => void;
  fetchFavoriteTasks: () => void;
  addTask: (
    title: string,
    description: string,
    status: TaskStatus,
    favorite?: boolean
  ) => void;
  editTask: (
    id: number,
    title: string,
    description: string,
    status: TaskStatus,
    favorite?: boolean
  ) => void;
  deleteTask: (id: number) => void;
  toggleFavorite: (id: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  favoriteIds: JSON.parse(localStorage.getItem('favoriteIds') || '[]'),
  filter: 'all',
  isLoadingTasks: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  editingItem: null,
  isModalVisible: false,

  setFilter: (filter: FilterType) => {
    set({ filter, currentPage: 1 });
    get().fetchTasks();
  },
  showModal: (task: Task | null = null) => {
    set({ editingItem: task, isModalVisible: true });
  },

  hideModal: () => {
    set({ editingItem: null, isModalVisible: false });
  },
  toggleFavorite: (id: number) => {
    set((state) => {
      const isFavorite = state.favoriteIds.includes(id);
      const newFavoriteIds = isFavorite
        ? state.favoriteIds.filter((favId) => favId !== id)
        : [...state.favoriteIds, id];

      localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));

      return {
        favoriteIds: newFavoriteIds,
        tasks:
          state.filter === 'favorite'
            ? state.tasks.filter((task) => newFavoriteIds.includes(task.id))
            : state.tasks,
      };
    });
  },

  fetchTasks: async (
    params: FetchTasksParams = {},
    loadMore: boolean = false
  ) => {
    const { filter, currentPage, totalPages } = get();

    if (filter === 'favorite') {
      get().fetchFavoriteTasks();
      return;
    }

    if (loadMore && currentPage >= totalPages) return;

    set({ isLoadingTasks: !loadMore, error: null });

    try {
      const page = loadMore ? currentPage + 1 : 1;
      const queryParams = {
        ...params,
        ...(filter !== 'all' && { filters: { status: { $eq: filter } } }),
        pagination: {
          page,
          pageSize: 25,
        },
      };

      const response = await getTasks(queryParams);
      const newTasks = response.data as Task[];
      const { page: newPage, pageCount } = response.meta.pagination;

      const sortedTasks = newTasks.sort(
        (a, b) =>
          new Date(b.attributes.createdAt).getTime() -
          new Date(a.attributes.createdAt).getTime()
      );

      set((state) => ({
        tasks: loadMore ? [...state.tasks, ...sortedTasks] : sortedTasks,
        isLoadingTasks: false,
        currentPage: newPage,
        totalPages: pageCount,
      }));
    } catch (error) {
      set({
        error: (error as AxiosError).message,
        isLoadingTasks: false,
      });
    }
  },

  fetchFavoriteTasks: async () => {
    const { favoriteIds } = get();
    set({ isLoadingTasks: true });
    try {
      const tasks = await Promise.all(
        favoriteIds.map((id) => getTaskById(id).then((res) => res.data))
      );
      set({
        tasks: tasks.reverse(),
        isLoadingTasks: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      set({
        error: axiosError.message,
        isLoadingTasks: false,
      });
    }
  },

  addTask: async (
    title: string,
    description: string,
    status: TaskStatus,
    favorite?: boolean
  ) => {
    try {
      const newTask = await postTask(title, description, status);
      set((state) => {
        const newFavoriteIds = favorite
          ? [...state.favoriteIds, newTask.id]
          : state.favoriteIds;
        localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));
        return {
          tasks: [newTask, ...state.tasks],
          favoriteIds: newFavoriteIds,
          error: null,
        };
      });
    } catch (error) {
      set({
        error: (error as AxiosError).message,
      });
    }
  },

  editTask: async (
    id: number,
    title: string,
    description: string,
    status: TaskStatus,
    favorite?: boolean
  ) => {
    try {
      const updatedTask = await putTask(id, title, description, status);

      set((state) => {
        const isCurrentlyFavorite = state.favoriteIds.includes(id);
        let newFavoriteIds = state.favoriteIds;

        if (favorite && !isCurrentlyFavorite) {
          newFavoriteIds = [...state.favoriteIds, id];
        } else if (!favorite && isCurrentlyFavorite) {
          newFavoriteIds = state.favoriteIds.filter((favId) => favId !== id);
        }

        localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));

        let updatedTasks = state.tasks.map((task) =>
          task.id === id
            ? { ...task, attributes: updatedTask.attributes }
            : task
        );

        if (state.filter !== 'all') {
          updatedTasks = updatedTasks.filter((task) =>
            state.filter === 'completed'
              ? task.attributes.status === 'completed'
              : task.attributes.status === 'notCompleted'
          );
        }

        return {
          tasks: updatedTasks,
          favoriteIds: newFavoriteIds,
          error: null,
        };
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error in editTask:', axiosError);

      if (axiosError.response && axiosError.response.status === 404) {
        set((state) => {
          const updatedTasks = state.tasks.filter((task) => task.id !== id);
          const newFavoriteIds = state.favoriteIds.filter(
            (favId) => favId !== id
          );

          localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));

          return {
            tasks: updatedTasks,
            favoriteIds: newFavoriteIds,
            error: null,
          };
        });
      } else {
        set({
          error: axiosError.message,
        });
      }
    }
  },

  deleteTask: async (id: number) => {
    set({ isLoadingTasks: true });
    try {
      await deleteTask(id);
      set((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== id);
        const newFavoriteIds = state.favoriteIds.filter(
          (favId) => favId !== id
        );

        localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));

        return {
          tasks: updatedTasks,
          favoriteIds: newFavoriteIds,
          isLoadingTasks: false,
          error: null,
        };
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 404) {
        set((state) => {
          const updatedTasks = state.tasks.filter((task) => task.id !== id);
          const newFavoriteIds = state.favoriteIds.filter(
            (favId) => favId !== id
          );

          localStorage.setItem('favoriteIds', JSON.stringify(newFavoriteIds));

          return {
            tasks: updatedTasks,
            favoriteIds: newFavoriteIds,
            isLoadingTasks: false,
            error: null,
          };
        });
      } else {
        set({
          isLoadingTasks: false,
          error: axiosError.message,
        });
      }
    }
  },
}));
