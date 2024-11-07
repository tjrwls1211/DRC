import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SuddenAcceleration from "./SuddenAcceleration";
import SuddenBraking from "./SuddenBraking";
import SamePedal from "./SamePedal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
  
const Tab = createBottomTabNavigator();
  
export default function AnalysisTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="급가속 분석"
                component={SuddenAcceleration}
                options={{
                    tabBarIcon: () => <Icon name="forwardburger" size={20} color="#000" />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="급정거 분석"
                component={SuddenBraking}
                options={{
                    tabBarIcon: () => <Icon2 name="warning" size={20} color="#000" />,
                    headerShown: false,
                }} 
            />
            <Tab.Screen
                name="페달동시사용 분석"
                component={SamePedal}
                options={{
                    tabBarIcon: () => <Icon2 name="footsteps" size={20} color="#000" />,
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}