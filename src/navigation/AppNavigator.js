import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthContext } from '../contexts/AuthContext';
import DesafiosScreen from '../screens/DesafiosScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import NovoDesafioScreen from '../screens/NovoDesafioScreen';
import NovoTreinoScreen from '../screens/NovoTreinoScreen';
import TreinoDetalhesScreen from '../screens/TreinoDetalhesScreen';
import TreinosScreen from '../screens/TreinosScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Treinos') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Desafios') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Treinos"
        component={TreinosScreen}
        options={{
          title: 'Treinos',
        }}
      />
      <Tab.Screen
        name="Desafios"
        component={DesafiosScreen}
        options={{
          title: 'Desafios',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!authenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NovoTreino"
              component={NovoTreinoScreen}
              options={{
                title: 'Novo Treino',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="TreinoDetalhes"
              component={TreinoDetalhesScreen}
              options={{
                title: 'Detalhes do Treino',
              }}
            />
            <Stack.Screen
              name="NovoDesafio"
              component={NovoDesafioScreen}
              options={{
                title: 'Novo Desafio',
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});