import axios from "axios";
import {API_URL} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 그래프용 분석 결과 가져오기
export const getAcceleration = async (twoWeeksAgo, currentDate) => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log("가속 횟수 가져오기 함수 들어옴");

        // 쿼리 매개변수로 날짜를 포함하여 API 요청
        const response = await apiClient.get("/abnormal/weeklySAcl", {
            params: {
                startDate: twoWeeksAgo,
                endDate: currentDate,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("급가속 그래프용 반환값", response.data);

        return response.data; // response.data로 수정
    } catch (error) {
        console.error("급가속 그래프용 값 호출 오류: ", error.response.data);
        throw error;
    }
}

// // 전주 대비 급가속 횟수 조회
// export const getWeeklyAcceleration = async () => {
//     try {
//         const token = await AsyncStorage.getItem('token');

//         const response = await apiClient.get("/user/acceleration",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//             },
//         });

//         console.log("급가속 전주 대비 반환값", response.data);

//         return response.date;
//     } catch (error) {
//         console.error("급가속 그래프용 값 호출 오류: ", error.response.data);
//         throw error;
//     }
// }