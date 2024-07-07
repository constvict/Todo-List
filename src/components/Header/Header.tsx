import { Menu, Button } from 'antd';
import { useTaskStore } from '../../store/store';
import { FilterType } from '../../store/types';

import { HeaderContainer } from './HeaderStyles';

type HeaderProps = {
  handleAddTask: () => void;
};

function Header({ handleAddTask }: HeaderProps) {
  const { setFilter } = useTaskStore();

  const menuItems = [
    { label: 'Все', key: 'all' },
    { label: 'Выполненные', key: 'completed' },
    { label: 'Не выполненные', key: 'notCompleted' },
    { label: 'Избранное', key: 'favorite' },
  ];

  return (
    <HeaderContainer>
      <Menu
        mode='horizontal'
        defaultSelectedKeys={['all']}
        items={menuItems}
        onClick={(e) => {
          setFilter(e.key as FilterType);
        }}
      />
      <Button type='primary' onClick={handleAddTask}>
        Добавить задачу
      </Button>
    </HeaderContainer>
  );
}

export default Header;
