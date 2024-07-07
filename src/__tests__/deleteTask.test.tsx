import { act } from 'react';
import { useTaskStore } from '../store/store';

test('deleteTask function deletes an existing task from the store', async () => {
  await act(async () => {
    await useTaskStore
      .getState()
      .addTask('Test Task to Delete', 'Task Description', 'notCompleted');
  });

  const storeState = useTaskStore.getState();
  const addedTask = storeState.tasks.find(
    (task) => task.attributes.title === 'Test Task to Delete'
  );

  if (!addedTask) {
    throw new Error('Task was not created successfully');
  }

  const taskId = addedTask.id;

  await act(async () => {
    await useTaskStore.getState().deleteTask(taskId);
  });

  const tasks = useTaskStore.getState().tasks;
  const deletedTask = tasks.find((task) => task.id === taskId);
  expect(deletedTask).toBeFalsy();
});
