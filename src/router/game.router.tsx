import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthRouteNames, GameRouteNames } from './route-names';
import { Text } from 'react-native';
import LobbyScreen from '../screens/game/Lobby.screen';
import TableScreen from '../screens/game/Table.screen';
import UserDetailsScreen from '../screens/game/UserDetails.screen';

const GameStack = createNativeStackNavigator();


const gameRoutes = (
    <GameStack.Navigator>
        <GameStack.Screen name ={GameRouteNames.LOBBY} component={LobbyScreen} options={
            {
                header: () => null,
                // headerTitle: (props) => <Text {...props} style={{fontSize: 24}}>Lobby</Text>
            }
        } />
        <GameStack.Screen name ={GameRouteNames.TABLE} component={TableScreen} options={
            {
                headerTitle: (props) => <Text {...props} style={{fontSize: 24}}>Game</Text>
            }
        } />
        <GameStack.Screen name ={GameRouteNames.USER_DETAILS} component={UserDetailsScreen} options={
            {
                headerTitle: (props) => <Text {...props} style={{fontSize: 24}}>User Details</Text>
            }
        } />
    </GameStack.Navigator>
)

export default gameRoutes;