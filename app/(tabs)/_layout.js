import { Tabs, useRouter } from 'expo-router';
import { Home, Film, Tv, MoreHorizontal, Search, User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const TabLayout = () => {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: 'white',
      tabBarActiveTintColor: '#e91e63',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#121212' },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Fcpb Portal',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/search')} style={{ marginRight: 15 }}>
              <Search color="white" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          headerTitle: 'Fcpb Portal',
          tabBarIcon: ({ color, size }) => <Film color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shows"
        options={{
          title: 'TV Shows',
          headerTitle: 'Fcpb Portal',
          tabBarIcon: ({ color, size }) => <Tv color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerTitle: 'Fcpb Portal',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          headerTitle: 'Fcpb Portal',
          tabBarIcon: ({ color, size }) => <MoreHorizontal color={color} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
