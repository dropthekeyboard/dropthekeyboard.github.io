#!/usr/bin/env python3
"""
Markdown 문법 오류 자동 교정 스크립트
mk_250924.json 파일의 reason과 content 필드에서 **가 줄바꿈과 함께 사용되어 닫히지 않는 문제를 수정
"""

import json
import re
import sys
from typing import Any, Dict

def fix_markdown_bold(text: str) -> str:
    """
    잘못된 Markdown bold 문법을 수정합니다.
    
    문제: "**text\n**more text"
    수정: "**text**\n**more text**"
    """
    if not isinstance(text, str):
        return text
    
    # 패턴: ** 시작 후 줄바꿈이 있고 다른 **로 시작하는 줄이 있는 경우
    pattern = r'\*\*([^*\n]+)\n\*\*([^*]*?)(?=\n|$)'
    
    def replace_func(match):
        first_part = match.group(1).strip()
        second_part = match.group(2).strip()
        
        # 첫 번째 부분을 닫고, 두 번째 부분을 새로 시작
        return f"**{first_part}**\n**{second_part}**"
    
    # 반복적으로 적용하여 연속된 패턴도 처리
    fixed_text = text
    prev_text = ""
    
    while prev_text != fixed_text:
        prev_text = fixed_text
        fixed_text = re.sub(pattern, replace_func, fixed_text)
    
    # 마지막에 **로 시작하지만 닫히지 않은 경우 처리
    # 패턴: **text (끝에 ** 없음)
    lines = fixed_text.split('\n')
    fixed_lines = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('**') and not line.endswith('**') and '**' not in line[2:]:
            # **로 시작하지만 닫히지 않은 경우
            line = line + '**'
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def fix_json_object(obj: Any) -> Any:
    """
    JSON 객체를 재귀적으로 순회하며 문자열 필드의 Markdown을 수정합니다.
    """
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key in ['reason', 'content'] and isinstance(value, str):
                obj[key] = fix_markdown_bold(value)
            else:
                obj[key] = fix_json_object(value)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            obj[i] = fix_json_object(item)
    
    return obj

def main():
    input_file = 'src/data/mk_250924.json'
    backup_file = f'{input_file}.backup'
    
    try:
        # 원본 파일 백업
        with open(input_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            f.write(original_content)
        
        print(f"✓ 백업 파일 생성: {backup_file}")
        
        # JSON 파싱
        data = json.loads(original_content)
        
        # Markdown 교정
        fixed_data = fix_json_object(data)
        
        # 수정된 내용을 파일에 쓰기
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(fixed_data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Markdown 문법 교정 완료: {input_file}")
        
        # 변경사항 요약 출력
        print("\n수정된 패턴:")
        print("- **텍스트\\n**다른텍스트 → **텍스트**\\n**다른텍스트**")
        print("- **텍스트 (닫히지 않음) → **텍스트**")
        
    except FileNotFoundError:
        print(f"❌ 파일을 찾을 수 없습니다: {input_file}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ JSON 파싱 오류: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        # 오류 시 백업에서 복원
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_content = f.read()
        with open(input_file, 'w', encoding='utf-8') as f:
            f.write(backup_content)
        print(f"✓ 백업에서 복원됨: {input_file}")
        sys.exit(1)

if __name__ == "__main__":
    main()