import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Alert } from 'react-native';
import BasicModal from './BasicModal';
import { fetchUserInfo, changeNickname } from '../../api/userInfoAPI';

const NicknameChangeModal = ({ visible, onClose, onConfirm }) => {
    const [newNickname, setNewNickname] = useState('');
    const [Nickname, setNickname] = useState('');

    useEffect(() => {
        const getNickname = async () => {
            try {
                const userInfo = await fetchUserInfo(); // 사용자 정보 가져와서
                setNickname(userInfo.nickname); // 현재 닉네임 저장
            } catch (error) {
                console.error('닉네임 가져오기 오류:', error);
            }
        };

        if (visible) {
            getNickname(); // 모달이 열릴 때만 현재 닉네임 가져오기
        }
    }, [visible]);

    const handleConfirm = async () => {
        try {
            const response = await changeNickname(newNickname); // 새 닉네임으로 변경
            if (response.success) { // 응답의 success가 true인지 확인
                Alert.alert('알림', '닉네임이 변경되었습니다!'); // 성공 시 알림 표시
                onConfirm(response.newData); // 변경 후 호출 (newData에서 새 닉네임 가져오기)
                setNewNickname(''); // 입력 필드 초기화
                onClose(); // 모달 닫기
            }
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
                value={Nickname}
                editable={false} // 현재 닉네임은 수정 불가
            />
            <TextInput
                style={styles.input}
                placeholder="새 닉네임"
                value={newNickname}
                onChangeText={setNewNickname}
            />
        </BasicModal>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#009688',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16,
    },
});

export default NicknameChangeModal;
