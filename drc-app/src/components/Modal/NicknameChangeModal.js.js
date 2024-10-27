import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import BasicModal from './BasicModal';

const NicknameChangeModal = ({ visible, onClose, onConfirm, currentNickname }) => {
    const [newNickname, setNewNickname] = useState('');
  
    return (
      <BasicModal 
        visible={visible} 
        onClose={onClose} 
        onConfirm={() => onConfirm(newNickname)}
        title="닉네임 수정"
      >
            <TextInput
                style={styles.input}
                placeholder="현재 닉네임"
                value={currentNickname}
                editable={false}
            />
            <TextInput
                style={styles.input}
                placeholder="새 닉네임"
                value={newNickname}
                onChangeText={setNewNickname}
            />
        </BasicModal>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#2ECC40', // 에메랄드 그린
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16,
    },
});

export default NicknameChangeModal;