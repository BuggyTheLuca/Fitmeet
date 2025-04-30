import { TextProps, Text, StyleSheet } from 'react-native';
import { styles } from './styles';

interface TitleProps extends TextProps {
    fontSize?: number;
    lineHeight?: number;
}

export default function Title({ children,fontSize,lineHeight,style, ...props }: TitleProps) {
    return (
        <Text
            {...props}
            style={[
                styles.title,
                fontSize ? {fontSize: fontSize} : {fontSize: 32},
                lineHeight ? {lineHeight: lineHeight} : {lineHeight: 36},
                style,
            ]}
        >
            {children}
        </Text>
    );
}