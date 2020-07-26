import styled from 'styled-components/native';

interface ContainerProps {
  bottom: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  colors: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

export const Container = styled.View<ContainerProps>`
  align-self: center;
  position: absolute;

  bottom: ${(props) => props.bottom || 20}px;
  padding: 20px;

  background-color: ${(props) => props.colors[props.type ?? 'info']};
  box-shadow: 5px 5px 4px ${(props) => props.colors[props.type ?? 'info']};
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
