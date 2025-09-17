#!/usr/bin/env python3
"""
MP4 파일의 시작/끝 시간을 추출하고 구간을 자르는 스크립트
Extract start/end time from MP4 file and cut specific segments
"""

import sys
import os
import cv2
import subprocess

def format_time(seconds):
    """초를 HH:MM:SS 형식으로 변환"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def parse_time(time_str):
    """HH:MM:SS 또는 MM:SS 형식을 초로 변환"""
    parts = time_str.split(':')
    if len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return hours * 3600 + minutes * 60 + seconds
    elif len(parts) == 2:
        minutes, seconds = map(int, parts)
        return minutes * 60 + seconds
    else:
        return int(parts[0])

def extract_video_times(video_path):
    """비디오 파일의 시작과 끝 시간을 추출"""
    try:
        # 비디오 캡처 객체 생성
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            print(f"오류: 비디오 파일을 열 수 없습니다 - {video_path}")
            return None, None

        # FPS (초당 프레임 수) 가져오기
        fps = cap.get(cv2.CAP_PROP_FPS)

        # 총 프레임 수 가져오기
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # 캡처 객체 해제
        cap.release()

        if fps == 0 or total_frames == 0:
            print("오류: 비디오 정보를 가져올 수 없습니다")
            return None, None

        # 총 길이 계산 (초)
        duration = total_frames / fps

        # 시작 시간 (항상 0)
        start_time = 0.0

        # 끝 시간 (총 길이)
        end_time = duration

        return start_time, end_time

    except Exception as e:
        print(f"오류: 비디오 파일을 처리할 수 없습니다 - {e}")
        return None, None

def cut_video_ffmpeg(input_path, output_path, start_time, end_time):
    """FFmpeg를 사용하여 비디오 구간 자르기 (정확한 타임스탬프)"""
    try:
        # 시작 시간과 지속 시간 계산
        start_seconds = parse_time(start_time)
        end_seconds = parse_time(end_time)
        duration_seconds = end_seconds - start_seconds

        if duration_seconds <= 0:
            print("오류: 끝 시간이 시작 시간보다 빠릅니다")
            return False

        # FFmpeg 명령어 구성 (output seeking 사용 - 더 정확함)
        cmd = [
            'ffmpeg',
            '-i', input_path,
            '-ss', str(start_seconds),  # 초 단위로 시작 시간 지정
            '-t', str(duration_seconds),  # 지속 시간
            '-c:v', 'libx264',  # H.264 코덱 사용 (재인코딩)
            '-c:a', 'aac',      # AAC 오디오 코덱
            '-preset', 'fast',  # 빠른 인코딩
            '-crf', '22',       # 고품질 설정
            '-avoid_negative_ts', 'make_zero',
            '-fflags', '+genpts',  # 타임스탬프 생성
            output_path,
            '-y'  # 덮어쓰기
        ]

        print(f"FFmpeg 명령어 실행: {' '.join(cmd[:10])}...")  # 명령어 일부만 출력

        # FFmpeg 실행
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print(f"성공: 비디오가 잘렸습니다 - {output_path}")
            return True
        else:
            print(f"오류: FFmpeg 실행 실패")
            print(f"stderr: {result.stderr}")
            return False

    except Exception as e:
        print(f"오류: 비디오 자르기 실패 - {e}")
        return False

def main():
    if len(sys.argv) == 2:
        # 시간 정보 추출 모드
        video_path = sys.argv[1]

        # 파일 존재 확인
        if not os.path.exists(video_path):
            print(f"오류: 파일을 찾을 수 없습니다 - {video_path}")
            sys.exit(1)

        print(f"비디오 파일 분석 중: {video_path}")

        # 시간 추출
        start_time, end_time = extract_video_times(video_path)

        if start_time is not None and end_time is not None:
            print("\n=== MP4 시간 정보 ===")
            print(f"시작 시간: {format_time(start_time)} (0초)")
            print(f"끝 시간: {format_time(end_time)} ({end_time:.2f}초)")
            print(f"총 길이: {format_time(end_time)}")
            print(f"FPS: {cv2.VideoCapture(video_path).get(cv2.CAP_PROP_FPS):.2f}")
            print(f"총 프레임: {int(cv2.VideoCapture(video_path).get(cv2.CAP_PROP_FRAME_COUNT))}")
        else:
            sys.exit(1)

    elif len(sys.argv) == 4:
        # 비디오 자르기 모드
        video_path = sys.argv[1]
        start_time = sys.argv[2]
        end_time = sys.argv[3]

        # 파일 존재 확인
        if not os.path.exists(video_path):
            print(f"오류: 파일을 찾을 수 없습니다 - {video_path}")
            sys.exit(1)

        print(f"비디오 파일: {video_path}")
        print(f"자를 구간: {start_time} ~ {end_time}")

        # 시간 정보 추출
        video_start, video_end = extract_video_times(video_path)
        if video_start is not None and video_end is not None:
            print(f"비디오 총 길이: {format_time(video_end)} ({video_end:.2f}초)")

        # 시작/끝 시간을 초로 변환
        try:
            start_seconds = parse_time(start_time)
            end_seconds = parse_time(end_time)

            if start_seconds >= end_seconds:
                print("오류: 시작 시간이 끝 시간보다 같거나 큽니다")
                sys.exit(1)

            if end_seconds > video_end:
                print(f"경고: 끝 시간이 비디오 길이를 초과합니다 ({format_time(video_end)})")
                end_seconds = video_end

        except ValueError as e:
            print(f"오류: 시간 형식이 잘못되었습니다 - {e}")
            sys.exit(1)

        # 출력 파일 경로 생성
        base_name = os.path.splitext(video_path)[0]
        output_path = f"{base_name}_cut_{start_time.replace(':', '')}_{end_time.replace(':', '')}.mp4"

        print(f"출력 파일: {output_path}")
        print(f"구간 길이: {end_seconds - start_seconds}초")

        # 비디오 자르기
        if cut_video_ffmpeg(video_path, output_path, start_time, end_time):
            print("\n=== 작업 완료 ===")
            print(f"원본 파일: {video_path}")
            print(f"잘린 파일: {output_path}")
            print(f"구간: {start_time} ~ {end_time} ({end_seconds - start_seconds}초)")
        else:
            print("비디오 자르기 실패")
            sys.exit(1)

    else:
        print("사용법:")
        print("  시간 정보 추출: python extract_mp4_times.py <MP4_파일>")
        print("  비디오 자르기:   python extract_mp4_times.py <MP4_파일> <시작시간> <끝시간>")
        print("  예시:")
        print("    python extract_mp4_times.py video.mp4")
        print("    python extract_mp4_times.py video.mp4 0:20 1:00")
        print("    python extract_mp4_times.py video.mp4 20 60")
        sys.exit(1)

if __name__ == "__main__":
    main()