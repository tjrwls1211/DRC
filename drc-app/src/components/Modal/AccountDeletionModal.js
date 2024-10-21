// 회원 탈퇴 모달
import React, {useState} from 'react';
import { TextInput, Text, StyleSheet} from 'react-native';
import BasicModal from './BasicModal';

const AccountDeleetionModal = ({ visible, onClose, onConfirm }) => {
    const [password, setPassword] = useState('');
    const [authPW, setAuthPW] = useState(''); // 비번 인증 상태
    const [authMessage, setAuthMessage] = useState(''); // 인증 결과 메시지

    // 비밀번호 검증 함수
    const authPassword = () => {
        
    }
}