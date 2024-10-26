// 2차 인증 필요 상태를 위한 Context(공유데이터 담은 객체) 생성 코드
import React, { createContext, useContext, useState } from 'react';

// 2차 인증 필요 상태 Context 생성
const TwoFAContext = createContext();

// Context Provider 컴포넌트
export const TwoFAProvider = ({ children }) => {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false); // 2차 인증 활성화 상태
  
    return (
      <TwoFAContext.Provider value={{ is2FAEnabled, setIs2FAEnabled }}>
        {children}
      </TwoFAContext.Provider>
    );
  };
  
  // Context 사용을 위한 커스텀 훅
  export const useTwoFA = () => {
    return useContext(TwoFAContext);
  };