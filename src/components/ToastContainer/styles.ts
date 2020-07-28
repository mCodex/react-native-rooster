import styled from 'styled-components/native';

interface ContainerProps {
  bottom: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  bgColor: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  align-self: center;
  position: absolute;

  bottom: ${(props) => props.bottom || 20}px;
  padding: 20px;

  background-color: ${(props) => props.bgColor[props.type ?? 'info']};
  box-shadow: 2px 2px 4px ${(props) => props.bgColor[props.type ?? 'info']};
  border-radius: 5px;
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

export const Message = styled.Text`
  color: #fff;
  font-size: 14px;
`;
