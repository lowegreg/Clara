import styled from 'styled-components';
import { palette } from 'styled-theme';

const TableDemoStyle = styled.div`
  .ant-tabs-content {
    margin-top: 40px;
  }

  .ant-tabs-nav {
    > div {
      color: ${palette('secondary', 2)};

      &.ant-tabs-ink-bar {
        background-color: ${palette('primary', 0)};
      }

      &.ant-tabs-tab-active {
        color: ${palette('primary', 0)};
      }
    }
  }
  .add-button {
    display: inline-block;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    width: 0;
    height: 12px;
    position: relative;
    cursor: pointer;
    margin: 15px;
    padding: 10px 20px;
    border: 1px solid #018dc4;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    font: normal 16px/normal "Times New Roman", Times, serif;
    color: rgba(255,255,255,0.9);
    -o-text-overflow: clip;
    text-overflow: clip;
    background: #0199d9;
    -webkit-box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2) ;
    box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2) ;
    text-shadow: -1px -1px 0 rgba(15,73,168,0.66) ;
    -webkit-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
    -moz-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
    -o-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
    transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
  }
`;

export default TableDemoStyle;
