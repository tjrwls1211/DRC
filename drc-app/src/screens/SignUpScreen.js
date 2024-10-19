import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useState, useEffect}  from 'react';

const SingUpScreen = () => {
  const navigation = useNavigation();
  const [useCheck, setUseCheck] = useState(false);
  const useBtnEvent =()=>{
    if(useCheck === false) {
      setUseCheck(true)
    }else {
      setUseCheck(false)
    }
  };
  
  return (
    <View style={Styles.container}>      
      <Text style={Styles.LogoText}>DRC</Text>
      <View style = {Styles.RegisterView}>

        <Text>ID (Email)</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={(text) => {this.setState({inputText: text})}}
          placeholder="ID (Email)"
          placeholderTextColor="#D9D9D9"
        />
        <Text>Password</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={(text) => {this.setState({inputText: text})}}
          placeholder="password"
          placeholderTextColor="#D9D9D9"
        />
        <Text>Confirm Password</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={(text) => {this.setState({inputText: text})}}
          placeholder="Confirm Password"
          placeholderTextColor="#D9D9D9"
        />
        <Text>Nickname</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={(text) => {this.setState({inputText: text})}}
          placeholder="Nickname"
          placeholderTextColor="#D9D9D9"
        />
        <Text>Birth Date</Text>
        <TextInput 
          style={Styles.TextInput} 
          onChangeText={(text) => {this.setState({inputText: text})}}
          placeholder="Birth Date"
          placeholderTextColor="#D9D9D9"
        />

        <TouchableOpacity 
          style={Styles.SingUpBtn}
          onPress={() => navigation.navigate("LoginScreen", { screen: 'LoginScreen' })}>
          <Text style={Styles.BtnText}>SingUp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{marginTop: 20}}
          onPress={() => navigation.navigate("LoginScreen", { screen: 'LoginScreen' })}>
        <Text style={Styles.LoginText}>로그인하러가기</Text>
        </TouchableOpacity>



      </View>
    </View>
  )
}

export default SingUpScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  RegisterView:{
    flex: 1,
    padding:20,
    margin: 35,
    marginTop:20,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 6
  },
  LogoText: {
    fontSize: 30,
    marginTop:30,
    textAlign: "center",
  },
  TextInput: {
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 35,
    borderRadius: 6,
    borderColor: '#D9D9D9',
    borderWidth: 1
  },
  SingUpBtn: {
    margin: 10,
    backgroundColor: "black",
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10
  },
  BtnText:{
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
  },
  LoginText: {
    fontSize: 14,
    textAlign: 'center',
    color:'#cccccc',
  } 
})
