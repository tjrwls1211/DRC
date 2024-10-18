import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={Styles.container}>      
      <Text style={Styles.LogoText}>DRC</Text>
      <View style = {Styles.LoginView}>

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
        
        <TouchableOpacity 
          style={Styles.RegisterBtn}
          onPress = {
          ()=>{
            props.navigation.navigate("Home")
          }
        }>
        <Text style={Styles.BtnText}>Register</Text>
        </TouchableOpacity>
        
        


      </View>
    </View>
  )
}

export default LoginScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  LoginView:{
    flex: 1,
    padding:20,
    margin: 35,
    marginBottom: "50%",
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 6
  },
  LogoText: {
    fontSize: 30,
    marginTop:"30%",
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
  RegisterBtn: {
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
  }
})
