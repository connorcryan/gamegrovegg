import React,{ useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './components/store/auth-context';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/tabs/HomeScreen';
import DiscoverScreen from './screens/tabs/DiscoverScreen';
import CreatePostScreen from './screens/tabs/CreatePostScreen';
import ProfileScreen from './screens/tabs/ProfileScreen';
import IconButton from './components/ui/IconButton';
import TextPostDisplay from './components/containers/PostDisplay';
import PostDetailScreen from './components/containers/PostDetail';
import PartyDetailScreen from './components/containers/PartyDetailScreen';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: Colors.primary50 },
  headerTintColor: Colors.primary800,
  contentStyle: { backgroundColor: Colors.primary100 },
};


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="Home"
        component={ScreensOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          title: "GameGrove",
          headerTitle: () => (
            <Image
              source={require("./assets/favicon.png")}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Stack.Screen name="TextPostDisplay" component={TextPostDisplay} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PartyDetailScreen" component={PartyDetailScreen} />
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

function ProfileScreenWrapper() {
  const authCtx = useContext(AuthContext);

  return <ProfileScreen username={authCtx.userData?.username} />;
  
}

function ScreensOverview(){

const authCtx = useContext(AuthContext);
console.log("userData in ScreensOverview:", authCtx.userData);

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
          headerShown: true,
          title: "GameGrove",
          tabBarLabel: "Home",
          headerLeft: () => (
            <Image
              source={require("./assets/headericon.png")}
              style={{ 
                width: 50, 
                height: 50,
                marginHorizontal: 15,
                marginBottom: 15,
               }}
            />
          ),
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
          tabBarLabel: "Discover",
          headerLeft: () => (
            <Image
              source={require("./assets/headericon.png")}
              style={{ 
                width: 50, 
                height: 50,
                marginHorizontal: 15,
                marginBottom: 15,
               }}
            />
          ),
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
          headerLeft: () => (
            <Image
              source={require("./assets/headericon.png")}
              style={{ 
                width: 50, 
                height: 50,
                marginHorizontal: 15,
                marginBottom: 15,
               }}
            />
          ),
          tabBarIcon: ({color, size}) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      {/* <BottomTabs.Screen 
        name="Notification"
        component={NotificationScreen}
        options={{
          title: "Notifications",
          tabBarLabel: "Notifications",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="" size={size} color={color} />
          ),
        }}
      /> */}
      <BottomTabs.Screen 
        name="Profile"
        component={ProfileScreenWrapper}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerLeft: () => (
            <Image
              source={require("./assets/headericon.png")}
              style={{ 
                width: 50, 
                height: 50,
                marginHorizontal: 15,
                marginBottom: 15,
               }}
            />
          ),
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
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');

        console.log('Stored token:', storedToken);
        console.log('Stored userData:', storedUserData);

        if (storedToken) {
            authCtx.authenticate(storedToken);
        }
        setIsTryingLogin(false);
    }  
    fetchToken();
}, []);

useEffect(() => {
  // additonal useEffect for checking AsyncStorage values
  async function checkAsyncStorage() {
    const storedToken = await AsyncStorage.getItem('token');
    const storedUserData = await AsyncStorage.getItem('userData');
    console.log("Stored token:", storedToken);
    console.log("Stored userData:", storedUserData);
  }
  checkAsyncStorage();
}, []); // empty dependency array runs once after the initial render

console.log('authCtx in the root:', authCtx);

if (isTryingLogin) {
  return <AppLoading />;
}
return <Navigation />
}

export default function App() {

  return (
    <>
      <StatusBar style="dark" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
