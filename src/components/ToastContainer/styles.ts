import styled, { css } from 'styled-components/native';

interface IContainer {
  bottom: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  bgColor: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

interface IMessageAndTitle {
  fontFamilyBold?: string | null | undefined;
  fontFamilyRegular?: string | null | undefined;
}

export const Container = styled.TouchableOpacity<IContainer>`
  align-self: center;
  position: absolute;

  bottom: ${(props) => props.bottom || 20}px;
  padding: 20px;

  background-color: ${(props) => props.bgColor[props.type ?? 'info']};
  box-shadow: 2px 2px 4px ${(props) => props.bgColor[props.type ?? 'info']};
  border-radius: 5px;
`;

export const Title = styled.Text<IMessageAndTitle>`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;

  ${(props) =>
    props.fontFamilyBold &&
    css`
      font-family: ${props.fontFamilyBold};

      /* Need to override font-weight, because Android won't display the custom font*/
      font-weight: normal;
    `}
`;

export const Message = styled.Text<IMessageAndTitle>`
  color: #fff;
  font-size: 14px;

  ${(props) =>
    props.fontFamilyRegular &&
    css`
      font-family: ${props.fontFamilyRegular};
    `}
`;
