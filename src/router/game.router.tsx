import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthRouteNames, GameRouteNames } from './route-names';
import { Text } from 'react-native';
import TableScreen from '../screens/game/Table.screen';

const GameStack = createNativeStackNavigator();


const gameRoutes = (
    <GameStack.Navigator>
        <GameStack.Screen name ={GameRouteNames.TABLE} component={TableScreen} options={
            {
                headerTitle: (props) => <Text {...props} style={{fontSize: 24}}>Games</Text>
            }
        } />
    </GameStack.Navigator>
)

export default gameRoutes;