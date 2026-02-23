import { View, StyleSheet } from 'react-native';
import WagashiMap from '../../src/components/WagashiMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <WagashiMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
