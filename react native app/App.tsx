import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';


//IP ADDRESS to run it on emulator (doesn't work on physical device): 'http://10.0.2.2:3001/'
//To test it on a physical device, set your actual ip address + port. The default port from the server is 3001
export default function App() {
  const [ip, setIp] = useState('http://10.0.2.2:3001/')
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  const [showInputScreen, setShowInputScreen] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false)
  const [data, setData] = useState('')
  const [isVisible, setIsVisible] = useState(false);
  const [ipValue, setIpValue] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowFirstScreen(true)
    setShowInputScreen(false)
    setShowFinalScreen(false)

    fetch(ip)
      .then(response => response.text())
      .then(text => {
        console.log(text);
      })
      .catch(error => {
        console.error(error)
      });
  }, [])


  const atendimento = () => {
    setShowFirstScreen(false)
    setShowInputScreen(true)
  }
  const confirm = () => {
    setShowInputScreen(false)
    setShowFinalScreen(true)

    setLoading(true)
    fetch(`${ip}input`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: data,
      }),
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        setError(false)
        setLoading(false);

        setTimeout(() => {
          setData('')
          setShowFinalScreen(false)
          setShowFirstScreen(true)
        }, 5000)
      })
      .catch(error => {
        setError(true)
      });

  }
  function saveNewIp() {
    setIp(ipValue)
    setIsVisible(false)
  }

  function handleInputData(inputText: any) {
    setData(inputText)
  }
  function handleIpValue(ip: any) {
    setIpValue(ip)
  }
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  function goToFirstScreen() {
    setData('')
    setShowFinalScreen(false)
    setShowFirstScreen(true)
    setShowInputScreen(false)
    setLoading(false)
    setError(false)
    setIsVisible(false)
  }


  return (
    <View style={styles.main_container}>

      {showFirstScreen && (
        <View style={styles.firstScreenContainer}>
          <Text onPress={() => atendimento()} style={styles.btn_firstScreen}>ATENDIMENTO</Text>
          <Image source={require("./images/click3.png")} style={styles.imgClick} />

          <View style={styles.configContainer}>
            <View>
              <TouchableOpacity style={styles.btn_showConfigOptions}>
                <Text onPress={toggleVisibility} ></Text>
              </TouchableOpacity>
              {isVisible &&
                <View>
                  <Text style={styles.configText}>IP atual: {ip}</Text>
                  <Text style={styles.configText}>Configurar novo IP</Text>
                  <TextInput value={ipValue} onChangeText={handleIpValue} style={styles.configInput}></TextInput>
                  <Text onPress={() => saveNewIp()} style={styles.btn_salveIp}>SALVAR</Text>
                </View>
              }
            </View>
          </View>
        </View>
      )}

      {showInputScreen && (
        <View style={styles.secondScreenContainer}>
          <View>
            <Text onPress={() => goToFirstScreen()}  style={styles.btn_back}>Voltar</Text>
          </View>
          <Text style={styles.text}>Digite seu nome</Text>
          <TextInput value={data} onChangeText={handleInputData} style={styles.input}></TextInput>
          <Text onPress={() => confirm()} style={styles.btn_inputSubmit}>CONFIRMAR</Text>
        </View>
      )}

      {showFinalScreen && (
        <View style={styles.outputContainer}>
          {error ?
            <View style={styles.container}>
              <Text style={styles.small_text}>Conecção perdida</Text>
              <Text onPress={() => goToFirstScreen()} style={styles.btn_errorRetreat}>Voltar</Text>
            </View>
            :
            <View style={styles.outputContainer}>
              {loading ?
                <View style={styles.container}>
                  <ActivityIndicator></ActivityIndicator>
                  <Text style={styles.small_text}>Carrendo</Text>
                </View>
                :
                <View style={styles.thirdScreenContainer} >
                  <FastImage source={require("./images/done.gif")} style={styles.imgClick} />
                  <Text style={styles.text_bigger}>Aguarde até ser chamado</Text>
                </View>
              }
            </View>
          }

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: '100%',
    color: 'white',
    backgroundColor: "#003cff",
  },
  firstScreenContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 230,
    backgroundColor: "#003cff",
  },
  btn_firstScreen: {
    width: "90%",
    fontSize: 30,
    padding: 15,
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: '#007AFF',
    color: "white",
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  imgClick: {
    marginTop: 20,
    height: 100,
    width: 100
  },
  configContainer: {
    width: "100%",
    backgroundColor: '#007AFF',
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    paddingRight: 20
  },
  btn_showConfigOptions: {
    width: 20,
    height: 20,
    backgroundColor: "#144BFD",
    borderRadius: 100,
    top: -40,
    position: "absolute",
    right: 30

  },

  configText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10
  },
  configInput: {
    borderColor: "white",
    borderWidth: 0.9,
    width: "100%",
    color: "white",
    marginLeft: 10,

    fontSize: 20,
    letterSpacing: 1
  },
  btn_salveIp: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
    padding: 5,
    marginBottom: 20,
    marginTop: 10,
    width: "100%",
    marginLeft: 10,
    backgroundColor: "#003CFF",
    borderRadius: 5,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },


  /* SECOND SCREEN */
  secondScreenContainer: {
    flex: 1,
    padding: 30,
    paddingTop: 0,
    backgroundColor: "#003cff",
  },
  btn_back:{
    width: 100,
    marginTop: 20,
    marginBottom: 80,
    padding: 5,
    fontSize: 15,
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: '#2054FB',
    color: "white",
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  btn_sencondScreen: {
    fontSize: 35,
    color: "white",
    marginBottom: 20,
    fontFamily: 'Inter-Bold',

  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    color: "white",
    fontSize: 25,
    paddingLeft: 20,
    marginBottom: 25
  },
  btn_inputSubmit: {
    width: "100%",
    fontSize: 30,
    padding: 15,
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: '#007AFF',
    color: "white",
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },


  outputContainer: {
    height: '100%',
    width: "100%",
    backgroundColor: "#003cff",
  },
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  small_text: {
    color: "white",
    fontSize: 25
  },
  btn_errorRetreat: {
    width: '50%',
    marginTop: 20,
    padding: 15,
    fontSize: 25,
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: '#007AFF',
    color: "white",
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  thirdScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: "#003cff",
  },
  text: {
    fontFamily: 'Inter-Bold',
    fontSize: 35,
    color: "#FFFFFFEB",
    marginBottom: 20,
    textAlign: "center"
  },

  text_bigger: {
    fontSize: 50,
    color: "#FFFFFFEB",
    marginBottom: 20,
    fontFamily: 'Inter-Bold'
  }
});


