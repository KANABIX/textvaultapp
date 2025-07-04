import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ViewScreen from './screens/ViewScreen';

export type RootStackParamList = {
  Home: undefined;
  View: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'TextVault' }} />
        <Stack.Screen name="View" component={ViewScreen} options={{ title: 'View Secret' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 