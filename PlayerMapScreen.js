import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground, Pressable, Image } from 'react-native';

import { ref, onValue, orderByChild, equalTo, query} from 'firebase/database';
import database from './firebase';
import { Button } from 'react-native-elements';

export default function NewMapScreen({ route, navigation }) {

  const windowwidth = Dimensions.get('window').width;
  const {player} = route.params;
  const [shots, setShots] = useState([]);
  const [goalview, setGoalview] = useState(false);
  const [coord, setCoord] = useState();

  useEffect(() => {
    const itemsRef = query(ref(database, 'shots/'), orderByChild('playerId'), equalTo(player.key));
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setShots(items);
      //console.log(items);
    })
  }, []);

  const shotTouch = (i) => {
    setGoalview(!goalview);
    setCoord(i);
  }

  const GoalFrame = () => {
    if (goalview){
    return(
      <View>
        <Image source={require('./assets/vectorgoal.png')} resizeMode='contain' style={{width: windowwidth}}/>
        {shots[coord].gLocationX && <View
          style={[
            styles.pointStyle,
            {
              top: parseFloat(shots[coord].gLocationY -11),
              left: parseFloat(shots[coord].gLocationX -11),
            },
          ]}
        />}
        <Button type='solid' raised title="Sulje" onPress={()=>{shotTouch('')}}/>
      </View>
    )}
  }
  

  return (
      <View style={styles.container}>
        <ImageBackground source={require('./assets/football-ground-vector2.jpg')} resizeMode='contain' style={{maxWidth: windowwidth}}>
          <View style= {{position:'absolute', top: 10, left: 10}}>
            <Text style= {{fontWeight:'bold', color: '#fff', fontSize: 20}}> {player.pNumber}  {player.pLastName}, {player.pFirstName}</Text>
          </View>
          <View style={{width: '100%', height: '100%', }}>

            {shots.map((value, i) => {
              const goal = shots[i].gResult;
              if(goal){
                return(
                  <Pressable 
                    onPress={()=>{shotTouch(i)}} 
                    style={[styles.true,
                      {
                        top: parseFloat(shots[i].pLocationY -11),
                        left: parseFloat(shots[i].pLocationX -11),
                      },
                    ]}
                  />
                )
              }
              else {
                return(
                  <Pressable 
                    onPress={()=>{shotTouch(i)}} 
                    style={[styles.false,
                      {
                        top: parseFloat(shots[i].pLocationY -11),
                        left: parseFloat(shots[i].pLocationX -11),
                      },
                    ]}
                  />
                )
              }
            })}

            <GoalFrame></GoalFrame>
          </View>
        </ImageBackground>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#20853a',
    alignContent:'flex-start',
    justifyContent: 'flex-start',
  },
  pointStyle: {
    height: 22,
    width: 22,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: 'yellow',
  },
  true: {
    height: 22,
    width: 22,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: 'lightgreen',
    borderWidth: 2,
    borderColor: '#000',
  },
  false: {
    height: 22,
    width: 22,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: '#000',
  },

});
