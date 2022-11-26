import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NewMapScreen from './NewMapScreen';
import HomeScreen from './HomeScreen';
import PlayerScreen from './PlayerScreen';
import PlayerMapScreen from './PlayerMapScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name = "Home" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name = "Map" component={NewMapScreen} options={{title: 'Lisää uusi laukaisu'}}/>
          <Stack.Screen name = "Players" component={PlayerScreen} options={{title: 'Pelaajat'}}/>
          <Stack.Screen name = "PlayerShots" component={PlayerMapScreen} options={{title: ''}}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}