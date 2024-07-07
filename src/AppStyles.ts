import styled from 'styled-components';
import { Layout } from 'antd';

export const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: #f0f2f5;
`;

export const StyledLayout = styled(Layout)`
  max-width: 1450px;
  min-width: 750px;
  width: 100%;
`;

export const StyledHeader = styled(Layout.Header)`
  padding: 0;
  user-select: none;
`;

export const StyledContent = styled(Layout.Content)`
  width: 100%;
  padding: 20px 20px;
  overflow: auto;
`;

export const StyledFooter = styled(Layout.Footer)`
  padding: 20px;
  text-align: left;
`;
