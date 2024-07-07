import { act } from 'react';
import { useTaskStore } from '../store/store';

test('addTask function adds a new task to the store', async () => {
  await act(async () => {
    await useTaskStore
      .getState()
      .addTask('New Test Task', 'Task Description', 'notCompleted');
  });

  const updatedTasks = useTaskStore.getState().tasks;

  const addedTask = updatedTasks.find(
    (task) => task.attributes.title === 'New Test Task'
  );
  expect(addedTask).toBeTruthy();
  expect(addedTask?.attributes.description).toBe('Task Description');
  expect(addedTask?.attributes.status).toBe('notCompleted');
});
