import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import BasicModal from './BasicModal';
import { fetchCurrentNickname, changeNickname } from '../../api/accountAPI';

const NicknameChangeModal = ({ visible, onClose, onConfirm }) => {
    const [newNickname, setNewNickname] = useState('');
    const [currentNickname, setCurrentNickname] = useState('');

    useEffect(() => {
        const getCurrentNickname = async () => {
            try {
                const nickname = await fetchCurrentNickname(); // 현재 닉네임 가져오기
                setCurrentNickname(nickname); // 상태에 저장
            } catch (error) {
                console.error('닉네임 가져오기 오류:', error);
            }
        };

        if (visible) {
            getCurrentNickname(); // 모달이 열릴 때만 현재 닉네임 가져오기
        }
    }, [visible]);

    const handleConfirm = async () => {
        try {
            await changeNickname(newNickname); // 새 닉네임으로 변경
            onConfirm(newNickname); // 변경 후 호출
            setNewNickname(''); // 입력 필드 초기화
        } catch (error) {
            console.error('닉네임 변경 오류:', error);
        }
    };
    
    return (
        <BasicModal 
        visible={visible} 
        onClose={onClose} 
        onConfirm={handleConfirm} // 수정된 confirm 핸들러
        title="닉네임 수정"
    >
        <TextInput
            style={styles.input}
            placeholder="현재 닉네임"
            value={currentNickname}
            editable={false} // 현재 닉네임은 수정 불가
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