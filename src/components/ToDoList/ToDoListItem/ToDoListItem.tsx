import { List, Button, Tooltip } from 'antd';
import {
  StarOutlined,
  StarFilled,
  CheckCircleOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { Task, TaskStatus } from '../../../store/types';

import { StyledListItem } from './ToDoListItemStyles';

type ToDoListItemProps = {
  task: Task;
  isFavorite: boolean;
  isLoadingTasks: boolean;
  onEdit: (item: Task) => void;
  onDelete: (id: number) => void;
  onFavorite: (id: number) => void;
  onComplete: (
    id: number,
    title: string,
    description: string,
    status: TaskStatus
  ) => void;
};

function ToDoListItem({
  task,
  isFavorite,
  onEdit,
  onDelete,
  onFavorite,
  onComplete,
  isLoadingTasks,
}: ToDoListItemProps) {
  const { id, attributes } = task;
  if (!id || !attributes) {
    return null;
  }
  return (
    <StyledListItem className={isFavorite ? 'favorite-task' : ''}>
      <div className='actions-left'>
        <Tooltip
          title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0.1}
        >
          <Button
            className='button-with-icon'
            type='link'
            onClick={() => onFavorite(id)}
            disabled={isLoadingTasks}
            icon={isFavorite ? <StarFilled /> : <StarOutlined />}
          />
        </Tooltip>
        <Tooltip
          title={
            attributes.status === 'completed'
              ? 'Снять отметку'
              : 'Отметить как выполненное'
          }
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0.1}
        >
          <Button
            className='button-with-icon'
            type='link'
            onClick={() =>
              onComplete(
                id,
                attributes.title,
                attributes.description,
                attributes.status
              )
            }
            icon={
              attributes.status === 'completed' ? (
                <CheckCircleFilled />
              ) : (
                <CheckCircleOutlined />
              )
            }
            disabled={isLoadingTasks}
          />
        </Tooltip>
      </div>
      <List.Item.Meta
        title={
          <span
            className={`title-clickable ${
              attributes.status === 'completed' ? 'completed-task' : ''
            }`}
            onClick={() => onEdit(task)}
          >
            {attributes.title}
          </span>
        }
        description={
          <span
            className={`description-clickable ${
              attributes.status === 'completed' ? 'completed-task' : ''
            }`}
            onClick={() => onEdit(task)}
          >
            {attributes.description}
          </span>
        }
      />
      <div className='actions-right'>
        <Button
          className='button-with-icon'
          type='link'
          onClick={() => onEdit(task)}
          disabled={isLoadingTasks}
        >
          Изменить
        </Button>
        <Button
          className='button-with-icon'
          type='link'
          onClick={() => onDelete(id)}
          disabled={isLoadingTasks}
          danger
        >
          Удалить
        </Button>
      </div>
    </StyledListItem>
  );
}

export default ToDoListItem;
