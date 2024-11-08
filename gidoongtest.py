import matplotlib.pyplot as plt
import numpy as np
from matplotlib.animation import FuncAnimation

# 속도 구간 설정
num_bins = 10
bin_width = 20
max_speed = 200

# 시간 변수 초기화
time = 0

# 속도 구간에 따른 색상 및 상태 레이블 정의
colors = ['green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'orange', 'orange', 'red', 'red']
labels = ['안전', '안전', '안전', '주의', '주의', '주의', '위험', '위험', '고위험', '고위험']

# 그래프 초기 설정
fig, ax = plt.subplots(figsize=(2, 6))
ax.set_ylim(0, num_bins)
ax.axis('off')
ax.set_title("Cylinder Representation of Speed")

# 초기 막대 생성
bars = [ax.bar(1, 1, bottom=i, color="lightgray", width=0.5, edgecolor='black') for i in range(num_bins)]
combined_label_text = ax.text(1, num_bins + 0.5, '', ha='center', color='blue', fontweight='bold')

# 애니메이션 업데이트 함수
def update(frame):
    global time

    # sin 함수를 이용한 속도의 자연스러운 변화
    random_speed = (np.sin(time) * 0.5 + 0.5) * max_speed  # 0~max_speed 사이로 변환
    current_level = int(random_speed // bin_width)

    # 막대 색상 업데이트
    for i, bar in enumerate(bars):
        bar[0].set_color(colors[i] if i <= current_level else "lightgray")

    # 통합 레이블 업데이트
    combined_label_text.set_text(f'Speed: {int(random_speed)} | Status: {labels[current_level]}')

    # 시간 업데이트 (속도 조절 가능)
    time += 0.1  # 시간 증가량을 조절하여 변화 속도 조정 가능

# 애니메이션 실행
ani = FuncAnimation(fig, update, interval=50)  # 50ms마다 업데이트하여 더 자연스러움

plt.show()
