import { useEffect } from 'react';
import { Form, Skeleton } from 'antd';
import { ToDoList, Header, TaskModal } from './components';
import { useTaskStore } from './store/store';
import { Task, TaskStatus } from './store/types';
import 'antd/dist/reset.css';
import {
  PageWrapper,
  StyledLayout,
  StyledContent,
  StyledFooter,
  StyledHeader,
} from './AppStyles';

function App() {
  const {
    tasks,
    isLoadingTasks,
    favoriteIds,
    editingItem,
    currentPage,
    totalPages,
    isModalVisible,
    fetchTasks,
    toggleFavorite,
    addTask,
    editTask,
    deleteTask,
    showModal,
    hideModal,
  } = useTaskStore();

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchTasks({}, true);
    }
  };

  const handleAddTask = () => {
    showModal(null);
    form.resetFields();
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then(
        (values: {
          title: string;
          description: string;
          completed: boolean;
          favorite: boolean;
        }) => {
          const { title, description, completed, favorite } = values;
          const status: TaskStatus = completed ? 'completed' : 'notCompleted';

          if (editingItem) {
            editTask(editingItem.id, title, description, status, favorite);
          } else {
            addTask(title, description, status, favorite);
          }

          hideModal();
          form.resetFields();
        }
      )
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleModalCancel = () => {
    hideModal();
    form.resetFields();
  };

  const handleEditTask = (task: Task) => {
    const { title, description, status } = task.attributes;
    const isFavorite = favoriteIds.includes(task.id);

    form.setFieldsValue({
      title,
      description,
      completed: status === 'completed',
      favorite: isFavorite,
    });

    showModal(task);
  };

  const handleCompleteTask = (
    id: number,
    title: string,
    description: string,
    status: TaskStatus
  ) => {
    const newStatus = status === 'completed' ? 'notCompleted' : 'completed';
    editTask(id, title, description, newStatus);
  };

  return (
    <PageWrapper>
      <StyledLayout>
        <StyledHeader>
          <Header handleAddTask={handleAddTask} />
        </StyledHeader>
        <StyledContent>
          {isLoadingTasks && tasks.length === 0 ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <ToDoList
              data={tasks}
              favoriteIds={favoriteIds}
              onEdit={handleEditTask}
              onDelete={deleteTask}
              onFavorite={toggleFavorite}
              onComplete={handleCompleteTask}
              fetchMoreTasks={handleLoadMore}
              hasMore={currentPage < totalPages}
              isLoadingTasks={isLoadingTasks}
            />
          )}
        </StyledContent>
        <StyledFooter>ToDoList App</StyledFooter>
        <TaskModal
          isVisible={isModalVisible}
          editingItem={editingItem}
          form={form}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        />
      </StyledLayout>
    </PageWrapper>
  );
}

export default App;
