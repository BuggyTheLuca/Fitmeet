import { ScrollView, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../assets/styles/colors';

export default function ScrollableScreen({ children }: { children: React.ReactNode }) {
  return (
    
      <ScrollView>
        <SafeAreaView style={styles.container}>
          {children}
        </SafeAreaView>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: colors.white,
      minHeight: Dimensions.get('window').height
  }
})