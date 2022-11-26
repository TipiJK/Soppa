import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, Input, Icon } from 'react-native-elements';
import database from './firebase';
import {push, ref, onValue, remove, update} from 'firebase/database';
import { TouchableOpacity } from 'react-native';

export default function PlayerScreen({ navigation }) {
    const [pFirstName, setPFirstName] = useState('');
    const [pLastName, setPLastName] = useState('');
    const [pNumber, setPNumber] = useState('');
    const [pKey, setPKey] = useState('');
    const [pInfo, setPInfo] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
  
  
    useEffect(() => {
        const itemsRef = ref(database, 'players/');
        onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
        items.sort(function(a, b){
          let x = a.pLastName.toLowerCase();
          let y = b.pLastName.toLowerCase();
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
        });
        setPInfo(items);
        //console.log(items);
        })
    }, []);

  const saveItem = () => {
    setShowForm(false);
    push(
      ref(database, 'players/'),
      {'pFirstName':pFirstName, 'pLastName': pLastName, 'pNumber': pNumber});
    resetActive();
  };

  const deleteItem = (key) => {
    //console.log('delete item', key);
    remove(ref(database, 'players/'+ key))
    setEditForm(!editForm);
    resetActive();
  };

  const updateItem = (key) => {
    setEditForm(!editForm);
    update(
        ref(database, 'players/'+ key), 
        {'pFirstName':pFirstName, 'pLastName': pLastName, 'pNumber': pNumber});
    resetActive();
}


  const editPlayer = (key, i) => {
    setEditForm(!editForm);
    setPFirstName(pInfo[i].pFirstName);
    setPLastName(pInfo[i].pLastName);
    setPNumber(pInfo[i].pNumber);
    setPKey(key);
  }

  const resetActive = () => {
    setPFirstName('');
    setPLastName('');
    setPNumber('');
    setPKey('');
  }
    
    return (
        <View style={{height: '100%', justifyContent: 'space-between'}}>
            <View style={{justifyContent: 'flex-start'}}>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showForm}
                        onRequestClose={() => {
                        setShowForm(!showForm);
                        }}>
                            <View style={styles.form}>
                                <Input 
                                    onChangeText={pFirstName => setPFirstName(pFirstName)}
                                    value={pFirstName}
                                    label="Etunimi"
                                />
                                <Input 
                                    onChangeText={pLastName => setPLastName(pLastName)}
                                    value={pLastName}
                                    label="Sukunimi"
                                />
                                <Input 
                                    onChangeText={pNumber => setPNumber(pNumber)}
                                    value={pNumber}
                                    label="Pelinumero"
                                />
                                <Button 
                                    raised 
                                    icon={{name: 'done', color:'white'}} 
                                    onPress={saveItem} 
                                    title=' Tallenna ' />
                            </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editForm}
                        onRequestClose={() => {
                        setEditForm(!editForm);
                        resetActive();
                        }}>
                            <View style={styles.form}>
                                <Input 
                                    placeholder={pFirstName}
                                    onChangeText={pFirstName => setPFirstName(pFirstName)}
                                    value={pFirstName}
                                    label="Etunimi"
                                />
                                <Input 
                                    placeholder={pLastName}
                                    onChangeText={pLastName => setPLastName(pLastName)}
                                    value={pLastName}
                                    label="Sukunimi"
                                />
                                <Input 
                                    placeholder={pNumber}
                                    onChangeText={pNumber => setPNumber(pNumber)}
                                    value={pNumber}
                                    label="Pelinumero"
                                />
                                <View style={{flexDirection:'row'}}>
                                    <Button 
                                        containerStyle={{marginHorizontal: 15}}
                                        buttonStyle={{width: 130}}
                                        raised 
                                        icon={{name: 'delete', color:'red'}} 
                                        onPress={() => deleteItem(pKey)} 
                                        title=' Poista ' />
                                    <Button 
                                        containerStyle={{marginHorizontal: 15}}
                                        buttonStyle={{width: 130}}
                                        raised 
                                        icon={{name: 'done', color:'white'}} 
                                        onPress={() => updateItem(pKey)} 
                                        title=' Tallenna ' />
                                </View>
                            </View>
                    </Modal>
                </View>

                <View>
                        <FlatList
                          data={pInfo}
                          renderItem={({item, index}) =>
                            <View> 
                              <TouchableOpacity 
                                onPress={() => navigation.navigate('PlayerShots', {player: item})} 
                                onLongPress={() => editPlayer(item.key, index)} 
                                style={styles.horzContainer}>
                                  <View style= {{ width: 80}}>
                                    <Text style={styles.items}>
                                        {item.pNumber}
                                    </Text>
                                  </View>
                                  <View style= {{ flexDirection: 'row', justifyContent:'space-between', width: 300, alignItems: 'center'}}>
                                    <Text style={styles.items}>
                                        {item.pLastName}, {item.pFirstName}
                                    </Text>
                                  
                                  <Icon 
                                        type='material' 
                                        color='blue' 
                                        name='navigate-next'
                                  />
                                  </View>
                              </TouchableOpacity>
                              <View style= {{ width: '70%', height: 1 }} />
                            </View>
                          }
                        />
                </View>
            </View>
            <View style={{position:'absolute', bottom: 10, right: 10}}>
                <Icon 
                    type='material' 
                    reverse 
                    color= 'blue' 
                    name='add' 
                    onPress={()=>{setShowForm(true)}} 
                    title=' Uusi pelaaja ' />
            </View>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    horzContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    form: {
        marginTop: 120,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    items: {
      padding: 16,
      fontSize: 17,
    },
  });