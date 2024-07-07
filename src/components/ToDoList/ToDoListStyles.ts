import styled from 'styled-components';
import { List } from 'antd';

export const StyledList = styled(List)`
  .ant-list-item-meta {
    margin: 0 1rem;
  }
  .ant-list-item-meta-title,
  .ant-list-item-meta-description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ScrollableDiv = styled.div`
  height: 750px;
  overflow: auto;
`;
