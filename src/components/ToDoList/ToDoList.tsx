import InfiniteScroll from 'react-infinite-scroll-component';
import ToDoListItem from './ToDoListItem/ToDoListItem';
import { Task, TaskStatus } from '../../store/types';

import { StyledList, ScrollableDiv } from './ToDoListStyles';

type ToDoListProps = {
  data: Task[];
  favoriteIds: number[];
  onEdit: (item: Task) => void;
  onDelete: (id: number) => void;
  onFavorite: (id: number) => void;
  onComplete: (
    id: number,
    title: string,
    description: string,
    status: TaskStatus
  ) => void;
  fetchMoreTasks: () => void;
  hasMore: boolean;
  isLoadingTasks: boolean;
};

function ToDoList({
  data,
  favoriteIds,
  onEdit,
  onDelete,
  onFavorite,
  onComplete,
  fetchMoreTasks,
  hasMore,
  isLoadingTasks,
}: ToDoListProps) {
  return (
    <ScrollableDiv id='scrollableDiv'>
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMoreTasks}
        hasMore={hasMore}
        loader={null}
        scrollableTarget='scrollableDiv'
      >
        <StyledList
          size='large'
          bordered
          dataSource={data}
          locale={{ emptyText: 'Нет задач' }}
          renderItem={(item) => {
            const task = item as Task;
            const isFavorite = favoriteIds.includes(task.id);
            return (
              <ToDoListItem
                key={task.id}
                task={task}
                isFavorite={isFavorite}
                isLoadingTasks={isLoadingTasks}
                onEdit={onEdit}
                onDelete={onDelete}
                onFavorite={onFavorite}
                onComplete={onComplete}
              />
            );
          }}
        />
      </InfiniteScroll>
    </ScrollableDiv>
  );
}

export default ToDoList;
