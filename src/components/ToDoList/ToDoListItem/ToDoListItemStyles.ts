import styled from 'styled-components';
import { List } from 'antd';

export const StyledListItem = styled(List.Item)`
  .actions-left {
    display: flex;
    gap: 8px;
  }
  .button-with-icon .anticon {
    font-size: 1.5rem;
  }
  .button-with-icon span {
    font-size: 0.875rem;
  }
  .favorite-task {
    background-color: #fffae6;
    border-left: 0.25rem solid #fadb14;
  }
  .completed-task {
    text-decoration: line-through;
    color: gray;
  }
  .title-clickable,
  .description-clickable {
    cursor: pointer;
  }
`;
