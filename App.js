import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './components/store/auth-context';
import HomeScreen from './screens/tabs/HomeScreen';
import DiscoverScreen from './screens/tabs/DiscoverScreen';
import CreatePostScreen from './screens/tabs/CreatePostScreen';
import ChatScreen from './screens/tabs/ChatScreen';
import ProfileScreen from './screens/tabs/ProfileScreen';
import IconButton from './components/ui/IconButton';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {


  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen 
      name="ScreensOverview" 
      component={ScreensOverview} 
      options={{
        headerShown: false
        }}
        />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedStack/>}
      </NavigationContainer>
  );
}

function ScreensOverview(){

const authCtx = useContext(AuthContext);

  return (
    <BottomTabs.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.primary50},
      headerTintColor: Colors.primary800,
      tabBarStyle: { backgroundColor: Colors.primary50},
      tabBarInactiveTintColor: Colors.primary800,
      tabBarActiveTintColor: Colors.primary400,
    }}
    >
      <BottomTabs.Screen 
        name="Home"
        component={HomeScreen}
        options={{
          title: "Feed",
          tabBarLabel: "Home",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen 
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          tabBarLabel: "Search",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen 
        name="Create"
        component={CreatePostScreen}
        options={{
          title: "Create Post",
          tabBarLabel: "Create",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen 
        name="Chat"
        component={ChatScreen}
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerRight: ({tintColor}) => (
            <IconButton icon="exit" color={tintColor} size={30} onPress={authCtx.logout}/>
          ),
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />     
    </BottomTabs.Navigator>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] =useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');

        if (storedToken) {
            authCtx.authenticate(storedToken);
        }
        setIsTryingLogin(false);
    }  
    fetchToken();
}, []);

if (isTryingLogin) {
  return <AppLoading />;
}

return <Navigation />
}

export default function App() {

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
