import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const PersonalInfoScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>닉네임</Text>
            <Text style={styles.value}>OOO</Text>

            <Text style={styles.label}>ID (Email)</Text>
            <Text style={styles.value}>email_ex</Text>

            <Text style={styles.label}>Password</Text>
            <Text style={styles.value}>********_ex</Text>

            <Text style={styles.lab}>생년월일</Text>
            <Text style={styles.lab}>xxxx/xx/xx_ex</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBootm: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
        color: '#555',
    },
})

export default PersonalInfoScreen;