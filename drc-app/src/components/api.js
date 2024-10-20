import axios from 'axios';

export const loginUser = async (email, password) => {
  const data = {
    id: email,
    pw: password
  };

  const url = ""; //url 유포 절대 금지!!!

  try {
    const response = await axios.post(url, data);
    console.log('Data sent successfully:', response.data);
} catch (error) {
    console.error('Error sending data:', error);
}
};

// export const SignUpUser = async (email, password, nickname, birthDate) => { //nickname, birthDate 수정 필요
//   const data = {
//     id: "(아이디)@이메일( 예 : gmail.com )",
//     pw: "(비밀번호는 최소 8자, 하나의 문자, 숫자, 특수 문자가 포함)",
//     nickname: "(20자 이내)",
//     birthDate: "(예 : 2024-10-11)"
//   }
  
//     const url = ""; //url 배포 금지
  
//     try {
//       const response = await axios.post(url, data);
//       console.log('Data sent successfully:', response.data);
//   } catch (error) {
//       console.error('Error sending data:', error);
//   }
//   };