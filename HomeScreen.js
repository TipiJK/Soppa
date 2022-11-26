import { View, ImageBackground, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default function HomeScreen({ navigation }) {
    
    return (
        <View>
            <ImageBackground source={require('./assets/fieldsplash.jpg')} resizeMode='cover' style={{height: '100%', justifyContent:'space-between'}}>

                <View style={{paddingVertical:170, alignItems: 'center'}}>
                    <Text style={styles.title}>Soppa</Text> 
                </View>

                
                <View style={{alignItems: 'center', marginBottom:80}}>
                    <Button 
                        title='Luo karttoja' 
                        onPress={() => navigation.navigate('Map')} 
                        type='solid' 
                        raised 
                        buttonStyle={styles.button} 
                        containerStyle={styles.buttoncont} 
                        titleStyle={styles.btnText}/>
                    <Button 
                        title='Pelaajat' 
                        onPress={() => navigation.navigate('Players')} 
                        type='solid' 
                        raised 
                        buttonStyle={styles.button} 
                        containerStyle={styles.buttoncont} 
                        titleStyle={styles.btnText}/>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 70,
        borderRadius: 10,
        width: '80%',
    },
    button: {
        height: 70,
        backgroundColor: '#bee6c6',
    },
    btnText: {
        fontSize: 25,
        color: '#34633d',
        fontWeight: 'bold',
    },
   title: {
        fontSize: 100,
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: "#000",
        textShadowOffset: {
          width: 8,
          height: 12,
        },
        textShadowRadius: 10,
    },
  });
  