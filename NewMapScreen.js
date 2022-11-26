import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import {push, ref, onValue} from 'firebase/database';
import database from './firebase';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from "moment";


export default function NewMapScreen({ navigation }) {

  const windowwidth = Dimensions.get('window').width;
  const windowheight = Dimensions.get('window').height;
  const [shot, setShot] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [playerUnset, setPlayerUnset] = useState(true);
  const [goalUnset, setGoalUnset] = useState(true);
  const [goalResult, setGoalResult] = useState(true);
  const [dropOpen, setDropOpen] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [pressStatus, setPressStatus] = useState(false);
  const date = moment()
    .utcOffset('+02:00')
    .format('YYYYMMDDhhmmss');
  // console.log(date);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const itemsRef = ref(database, 'players/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      items.sort(function(a, b){return a.pNumber - b.pNumber});
      setAllPlayers(items);
      // console.log(items);
    })
  }, []);
  
  const fieldTouch = (x, y) => {
    setShot([{ pLocationX: x, pLocationY: y}]);
    setPlayerUnset(false);
  }

  const goalTouch = (x, y) => {
    setShot([{...shot[0], gLocationX: x, gLocationY: y}]);
    setGoalUnset(false);
  }

  const finalize = () => {
    setShot([{...shot[0], gResult: goalResult, playerId: playerId, dateTime: date}])
    setPlayerUnset(true);
    setGoalUnset(true);
    setDone(!done);
  }

  React.useEffect(() => {
    // console.log('saveshot: ', shot[0]);
    push(
      ref(database, 'shots/'),
      shot[0]);
  }, [done]);

  const handlePress = () => {
    setGoalResult(!goalResult);
    setPressStatus(!pressStatus);
  }

  //console.log('playerstate: ', shot);


  return (
      <View style={styles.container}>
        <ImageBackground source={require('./assets/football-ground-vector2.jpg')} resizeMode='contain' style={{maxWidth: windowwidth}}>
          <View style={{width: '100%', height: '100%', }}>
            { playerUnset &&
              <TouchableWithoutFeedback onPress={(evt) => {fieldTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}}>
                <View style={{width: windowwidth, height: windowheight }}>

                </View>
            </TouchableWithoutFeedback>}

            {!playerUnset && <View
                style={[
                styles.pointStyle,
                  {
                    top: parseFloat(shot[0].pLocationY -11),
                    left: parseFloat(shot[0].pLocationX -11),
                  },
                ]}
            />}

            { !playerUnset &&
              <TouchableWithoutFeedback onPress={(evt) => {goalTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}}>
                <View>
                <Image source={require('./assets/vectorgoal.png')} resizeMode='contain' style={{width: windowwidth}}/>
                  {shot[0].gLocationX && <View
                    style={[
                      styles.pointStyle,
                      {
                        top: parseFloat(shot[0].gLocationY -11),
                        left: parseFloat(shot[0].gLocationX -11),
                      },
                    ]}
                  />}
                </View>
              </TouchableWithoutFeedback>}

            {!goalUnset && <View style={styles.goalview}>
              <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <Button type='solid' raised buttonStyle={pressStatus ? styles.unpressed : styles.pressed } containerStyle={styles.buttoncont} title="Maali" onPress={handlePress}/>
                <Button type='solid' raised buttonStyle={pressStatus ? styles.pressed : styles.unpressed } containerStyle={styles.buttoncont} title="Torjunta" onPress={handlePress}/>
              </View>
              <DropDownPicker
                  schema={{
                    label: 'pNumber',
                    value: 'key'
                  }}
                  open={dropOpen}
                  value={playerId}
                  items={allPlayers}
                  setOpen={setDropOpen}
                  setValue={setPlayerId}
              />
              <Button containerStyle={styles.savebutton} raised icon={{name: 'done', color:'white'}} onPress={finalize} title=' Tallenna ' />
            </View>}
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
    backgroundColor: 'red',
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
});
