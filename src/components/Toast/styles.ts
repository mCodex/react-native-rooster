import { Platform, TouchableOpacity, View } from 'react-native';
import styled, { css } from 'styled-components/native';
import { animated } from 'react-spring/native.cjs';

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

const AnimatedButton = animated<any>(TouchableOpacity);

export const Container = styled(AnimatedButton)<IContainer>`
  align-self: center;
  position: absolute;

  bottom: ${(props) => props.bottom || 20}px;
  padding: 20px;

  background-color: ${(props) => props.bgColor[props.type ?? 'info']};
  box-shadow: 1px 1px 2px ${(props) => props.bgColor[props.type ?? 'info']};
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
      font-weight: ${Platform.OS === 'android' ? 'normal' : 'bold'};
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

const AnimatedView = animated<any>(View);

export const ProgressBar = styled(AnimatedView)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: auto;
  background-color: #fff;
  height: 2px;
`;
