import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground } from 'react-native';

import { ref, onValue, orderByChild, equalTo, query} from 'firebase/database';
import database from './firebase';

export default function NewMapScreen({ route, navigation }) {

  const windowwidth = Dimensions.get('window').width;
  const {player} = route.params;
  const [shots, setShots] = useState([]);

  useEffect(() => {
    const itemsRef = query(ref(database, 'shots/'), orderByChild('playerId'), equalTo(player.key));
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setShots(items);
      //console.log(items);
    })
  }, []);
  

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
                  <View
                    style={[styles.true,
                      {
                        top: parseFloat(shots[i].pLocationY -11),
                        left: parseFloat(shots[i].pLocationX -11),
                      },
                    ]}
                  />)
                }
              else {
                return(
                  <View
                    style={[styles.false,
                      {
                        top: parseFloat(shots[i].pLocationY -11),
                        left: parseFloat(shots[i].pLocationX -11),
                      },
                    ]}
                  />)
              }
            })}
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
  dropdown: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  },
  goalview: {
    backgroundColor:'#bee6c6',
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#34633d',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttoncont: {
    width: '50%',
    marginVertical: 10,
  },
  pressed: {
    backgroundColor: '#34633d',
  },
  unpressed: {
    backgroundColor: 'white',
  },

  savebutton: {
    width: '50%',
    marginVertical: 10,
    alignSelf: 'center',
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
