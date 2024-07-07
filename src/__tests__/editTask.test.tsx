import { act } from 'react';
import { useTaskStore } from '../store/store';

test('editTask function edits an existing task in the store', async () => {
  await act(async () => {
    await useTaskStore
      .getState()
      .addTask('Task to Edit', 'Initial Description', 'notCompleted');
  });

  const storeState = useTaskStore.getState();
  const addedTask = storeState.tasks.find(
    (task) => task.attributes.title === 'Task to Edit'
  );

  if (!addedTask) {
    throw new Error('Task was not created successfully');
  }

  const taskId = addedTask.id;

  await act(async () => {
    await useTaskStore
      .getState()
      .editTask(taskId, 'Edited Task', 'Updated Description', 'completed');
  });

  const updatedTasks = useTaskStore.getState().tasks;
  const editedTask = updatedTasks.find((task) => task.id === taskId);

  expect(editedTask).toBeTruthy();
  expect(editedTask?.attributes.title).toBe('Edited Task');
  expect(editedTask?.attributes.description).toBe('Updated Description');
  expect(editedTask?.attributes.status).toBe('completed');
});
