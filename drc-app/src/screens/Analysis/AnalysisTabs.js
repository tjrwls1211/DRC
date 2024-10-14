import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SuddenAcceleration from "./SuddenAcceleration";
import SuddenBraking from "./SuddenBraking";
import SamePedal from "./SamePedal";
  
const Tab = createBottomTabNavigator();
  
export default function AnalysisTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="급가속 분석" component={SuddenAcceleration} />
            <Tab.Screen name="급정거 분석" component={SuddenBraking} />
            <Tab.Screen name="페달동시사용 분석" component={SamePedal} />
        </Tab.Navigator>
    );
}