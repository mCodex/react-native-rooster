import styled from 'styled-components/native';

interface ContainerProps {
  bottom: number;
}

export const Container = styled.View<ContainerProps>`
  background-color: red;

  align-self: center;
  position: absolute;

  bottom: ${(props) => props.bottom || 0}px;

  box-shadow: 5px 5px 8px red;
  border-radius: 5px;

  padding: 20px;
`;

export const Text = styled.Text`
  color: #fff;
  font-size: 24px;
`;
