#!/usr/bin/env python3
"""
Scenario Steps Manager

A Python script to manage steps in scenario JSON files.
Supports adding and removing steps with proper validation.

Usage:
    python manage_steps.py --file ljy_250923.json --add-step '{"type": "send-message", "action": {...}}' --insert-at 0
    python manage_steps.py --file ljy_250923.json --remove-step 5
"""

import json
import argparse
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum


class MessageType(str, Enum):
    VOICE = "voice"
    TEXT = "text"
    DTMF = "dtmf"
    IMAGE = "image"


class SenderType(str, Enum):
    AGENT = "agent"
    CUSTOMER = "customer"
    SERVER = "server"


@dataclass
class Message:
    """Message data structure"""
    from_: str
    to: str
    timestamp: int
    content: str
    type: MessageType
    senderType: SenderType
    id: Optional[str] = None
    reason: Optional[str] = None
    callSession: Optional[Dict[str, Any]] = None
    imageUrl: Optional[str] = None


@dataclass
class Call:
    """Call data structure"""
    from_: str
    to: str
    timestamp: int
    reason: Optional[str] = None
    senderType: Optional[SenderType] = None
    id: Optional[str] = None


@dataclass
class APICall:
    """API call data structure"""
    from_: str
    to: str
    timestamp: int
    service: str
    request: str
    reason: Optional[str] = None
    senderType: Optional[SenderType] = None
    id: Optional[str] = None


@dataclass
class APIResponse:
    """API response data structure"""
    from_: str
    to: str
    timestamp: int
    service: str
    response: str
    senderType: Optional[SenderType] = None
    id: Optional[str] = None


class StepType(str, Enum):
    SEND_MESSAGE = "send-message"
    MAKE_CALL = "make-call"
    ACCEPT_CALL = "accept-call"
    FINISH_CALL = "finish-call"
    API_CALL = "api-call"
    API_RESPONSE = "api-response"


@dataclass
class AgenticStep:
    """Base class for agentic steps"""
    type: StepType
    action: Union[Message, Call, APICall, APIResponse]


def load_scenario_json(file_path: str) -> Dict[str, Any]:
    """Load scenario JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {file_path}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")


def save_scenario_json(file_path: str, data: Dict[str, Any]) -> None:
    """Save scenario JSON file with proper formatting"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved to {file_path}")
    except Exception as e:
        raise Exception(f"Failed to save file: {e}")


def validate_step(step_data: Dict[str, Any]) -> AgenticStep:
    """Validate step data against expected types"""
    if 'type' not in step_data or 'action' not in step_data:
        raise ValueError("Step must have 'type' and 'action' fields")

    step_type = step_data['type']
    action_data = step_data['action']

    # Validate action has required Deliverable fields
    required_fields = ['from', 'to', 'timestamp']
    for field in required_fields:
        if field not in action_data:
            raise ValueError(f"Action missing required field: {field}")

    try:
        if step_type == StepType.SEND_MESSAGE:
            # Validate Message specific fields
            if 'content' not in action_data or 'type' not in action_data:
                raise ValueError("send-message action must have 'content' and 'type' fields")

            message = Message(
                from_=action_data['from'],
                to=action_data['to'],
                timestamp=action_data['timestamp'],
                id=action_data.get('id'),
                content=action_data['content'],
                type=MessageType(action_data['type']),
                senderType=SenderType(action_data['senderType']),
                reason=action_data.get('reason'),
                callSession=action_data.get('callSession'),
                imageUrl=action_data.get('imageUrl')
            )
            return AgenticStep(type=StepType.SEND_MESSAGE, action=message)

        elif step_type in [StepType.MAKE_CALL, StepType.ACCEPT_CALL, StepType.FINISH_CALL]:
            call = Call(
                from_=action_data['from'],
                to=action_data['to'],
                timestamp=action_data['timestamp'],
                id=action_data.get('id'),
                reason=action_data.get('reason'),
                senderType=SenderType(action_data['senderType']) if 'senderType' in action_data else None
            )
            return AgenticStep(type=StepType(step_type), action=call)

        elif step_type == StepType.API_CALL:
            if 'service' not in action_data or 'request' not in action_data:
                raise ValueError("api-call action must have 'service' and 'request' fields")

            api_call = APICall(
                from_=action_data['from'],
                to=action_data['to'],
                timestamp=action_data['timestamp'],
                id=action_data.get('id'),
                service=action_data['service'],
                request=action_data['request'],
                reason=action_data.get('reason'),
                senderType=SenderType(action_data['senderType']) if 'senderType' in action_data else None
            )
            return AgenticStep(type=StepType.API_CALL, action=api_call)

        elif step_type == StepType.API_RESPONSE:
            if 'service' not in action_data or 'response' not in action_data:
                raise ValueError("api-response action must have 'service' and 'response' fields")

            api_response = APIResponse(
                from_=action_data['from'],
                to=action_data['to'],
                timestamp=action_data['timestamp'],
                id=action_data.get('id'),
                service=action_data['service'],
                response=action_data['response'],
                senderType=SenderType(action_data['senderType']) if 'senderType' in action_data else None
            )
            return AgenticStep(type=StepType.API_RESPONSE, action=api_response)

        else:
            raise ValueError(f"Unknown step type: {step_type}")

    except ValueError as e:
        raise ValueError(f"Invalid step data: {e}")


def add_step(scenario_data: Dict[str, Any], step_json: str, insert_at: Optional[int] = None) -> Dict[str, Any]:
    """Add a step to the scenario"""
    # Parse step JSON
    try:
        step_data = json.loads(step_json)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON for step: {e}")

    # Validate step
    validated_step = validate_step(step_data)

    # Find the scenario key (should be the only key in the JSON)
    scenario_key = list(scenario_data.keys())[0]
    scenario = scenario_data[scenario_key]

    if 'steps' not in scenario:
        raise ValueError("Scenario does not have a 'steps' array")

    steps = scenario['steps']

    # Convert validated step back to dict for JSON storage
    step_dict = {
        'type': validated_step.type.value,
        'action': {
            'from': validated_step.action.from_,
            'to': validated_step.action.to,
            'timestamp': validated_step.action.timestamp,
            **({'id': validated_step.action.id} if validated_step.action.id else {}),
        }
    }

    # Add type-specific fields
    if isinstance(validated_step.action, Message):
        step_dict['action'].update({
            'content': validated_step.action.content,
            'type': validated_step.action.type.value,
            'senderType': validated_step.action.senderType.value,
            **({'reason': validated_step.action.reason} if validated_step.action.reason else {}),
            **({'callSession': validated_step.action.callSession} if validated_step.action.callSession else {}),
            **({'imageUrl': validated_step.action.imageUrl} if validated_step.action.imageUrl else {}),
        })
    elif isinstance(validated_step.action, Call):
        if validated_step.action.reason:
            step_dict['action']['reason'] = validated_step.action.reason
        if validated_step.action.senderType:
            step_dict['action']['senderType'] = validated_step.action.senderType.value
    elif isinstance(validated_step.action, APICall):
        step_dict['action'].update({
            'service': validated_step.action.service,
            'request': validated_step.action.request,
            **({'reason': validated_step.action.reason} if validated_step.action.reason else {}),
            **({'senderType': validated_step.action.senderType.value} if validated_step.action.senderType else {}),
        })
    elif isinstance(validated_step.action, APIResponse):
        step_dict['action'].update({
            'service': validated_step.action.service,
            'response': validated_step.action.response,
            **({'senderType': validated_step.action.senderType.value} if validated_step.action.senderType else {}),
        })

    # Insert at specified position or append
    if insert_at is not None:
        if insert_at < 0 or insert_at > len(steps):
            raise ValueError(f"Invalid insert position: {insert_at}. Must be between 0 and {len(steps)}")
        steps.insert(insert_at, step_dict)
        print(f"Step inserted at position {insert_at}")
    else:
        steps.append(step_dict)
        print(f"Step appended at position {len(steps) - 1}")

    return scenario_data


def remove_step(scenario_data: Dict[str, Any], step_index: int) -> Dict[str, Any]:
    """Remove a step from the scenario"""
    scenario_key = list(scenario_data.keys())[0]
    scenario = scenario_data[scenario_key]

    if 'steps' not in scenario:
        raise ValueError("Scenario does not have a 'steps' array")

    steps = scenario['steps']

    if step_index < 0 or step_index >= len(steps):
        raise ValueError(f"Invalid step index: {step_index}. Must be between 0 and {len(steps) - 1}")

    removed_step = steps.pop(step_index)
    print(f"Removed step at index {step_index}: {removed_step['type']}")

    return scenario_data


def list_steps(scenario_data: Dict[str, Any]) -> None:
    """List all steps in the scenario"""
    scenario_key = list(scenario_data.keys())[0]
    scenario = scenario_data[scenario_key]
    steps = scenario.get('steps', [])

    print(f"\nScenario: {scenario.get('title', 'Unknown')}")
    print(f"Total steps: {len(steps)}")
    print("-" * 50)

    for i, step in enumerate(steps):
        step_type = step.get('type', 'unknown')
        action = step.get('action', {})
        from_ = action.get('from', 'unknown')
        to = action.get('to', 'unknown')
        content_preview = ""
        if 'content' in action:
            content = action['content']
            content_preview = content[:50] + "..." if len(content) > 50 else content

        print(f"{i:2d}. {step_type:12s} | {from_:15s} -> {to:15s} | {content_preview}")


def main():
    parser = argparse.ArgumentParser(
        description="Manage steps in scenario JSON files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Add a step at the beginning
  python manage_steps.py --add-step '{"type": "send-message", "action": {"from": "customer", "to": "agent", "timestamp": 1234567890, "content": "Hello", "type": "text", "senderType": "customer"}}' --insert-at 0

  # Remove a step at index 5
  python manage_steps.py --remove-step 5

  # List all steps
  python manage_steps.py --list

  # Use custom file
  python manage_steps.py --file custom_scenario.json --list
        """
    )

    parser.add_argument(
        '--file',
        default='ljy_250923.json',
        help='Path to the scenario JSON file (default: ljy_250923.json)'
    )

    parser.add_argument(
        '--add-step',
        help='JSON string of the step to add'
    )

    parser.add_argument(
        '--insert-at',
        type=int,
        help='Position to insert the new step (0-based index). If not specified, appends to the end'
    )

    parser.add_argument(
        '--remove-step',
        type=int,
        help='Index of the step to remove (0-based)'
    )

    parser.add_argument(
        '--list',
        action='store_true',
        help='List all steps in the scenario'
    )

    args = parser.parse_args()

    # Validate arguments
    actions = [args.add_step, args.remove_step, args.list]
    if sum(action is not None and action is not False for action in actions) != 1:
        parser.error("Exactly one action must be specified: --add-step, --remove-step, or --list")

    if args.add_step and args.insert_at is not None and args.insert_at < 0:
        parser.error("--insert-at must be a non-negative integer")

    try:
        # Load scenario data
        scenario_data = load_scenario_json(args.file)

        # Perform requested action
        if args.list:
            list_steps(scenario_data)
        elif args.add_step:
            scenario_data = add_step(scenario_data, args.add_step, args.insert_at)
            save_scenario_json(args.file, scenario_data)
        elif args.remove_step is not None:
            scenario_data = remove_step(scenario_data, args.remove_step)
            save_scenario_json(args.file, scenario_data)

    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())