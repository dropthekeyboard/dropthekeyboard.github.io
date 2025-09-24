#!/usr/bin/env python3
"""
Asset Deployment Script for A2A Demo

This script processes JSON files containing Data URLs and converts them to actual asset files.
It extracts audio and image data URLs, saves them as files, and replaces the URLs with relative paths.

Usage:
    python scripts/deploy-assets.py
    python scripts/deploy-assets.py --clean  # Clean existing assets first
    python scripts/deploy-assets.py --input input_json --output src/data --assets public/assets/deployed
"""

import argparse
import base64
import hashlib
import json
import os
import re
import shutil
import sys
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional

# MIME type to file extension mapping
MIME_TO_EXT = {
    'audio/mpeg': '.mp3',
    'audio/mp3': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp'
}

class AssetFile:
    def __init__(self, data: bytes, mime_type: str, original_url: str):
        self.data = data
        self.mime_type = mime_type
        self.original_url = original_url
        self.extension = MIME_TO_EXT.get(mime_type, '.bin')
        self.hash = hashlib.md5(data).hexdigest()[:8]  # Short hash for filename
        self.filename = f"{self.hash}{self.extension}"

class ProcessResult:
    def __init__(self, original_url: str, new_url: str, file_path: str):
        self.original_url = original_url
        self.new_url = new_url
        self.file_path = file_path

class AssetDeployer:
    def __init__(self, input_dir: str, output_path: str, assets_dir: str):
        self.input_dir = Path(input_dir)
        self.output_path = Path(output_path)
        self.assets_dir = Path(assets_dir)
        self.processed_files = {}  # hash -> AssetFile mapping for deduplication
        self.replacements = []  # List of ProcessResult objects

        # Ensure directories exist
        self.assets_dir.mkdir(parents=True, exist_ok=True)
        self.output_path.parent.mkdir(parents=True, exist_ok=True)

    def extract_data_urls(self, obj: Any, path: str = "") -> List[Tuple[str, str, List[str]]]:
        """
        Recursively extract data URLs from nested JSON objects.
        Returns list of (field_name, data_url, json_path) tuples.
        """
        results = []

        if isinstance(obj, dict):
            for key, value in obj.items():
                current_path = f"{path}.{key}" if path else key
                if key in ['audioUrl', 'imageUrl'] and isinstance(value, str) and value.startswith('data:'):
                    results.append((key, value, current_path.split('.')))
                elif isinstance(value, (dict, list)):
                    results.extend(self.extract_data_urls(value, current_path))
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                current_path = f"{path}[{i}]"
                if isinstance(item, (dict, list)):
                    results.extend(self.extract_data_urls(item, current_path))

        return results

    def parse_data_url(self, data_url: str) -> Optional[AssetFile]:
        """Parse data URL and return AssetFile object."""
        try:
            # Extract MIME type and base64 data
            match = re.match(r'data:([^;]+);base64,(.+)', data_url)
            if not match:
                print(f"Invalid data URL format: {data_url[:100]}...")
                return None

            mime_type = match.group(1)
            base64_data = match.group(2)

            # Validate MIME type
            if mime_type not in MIME_TO_EXT:
                print(f"Unsupported MIME type: {mime_type}")
                return None

            # Decode base64 data
            try:
                data = base64.b64decode(base64_data)
            except Exception as e:
                print(f"Failed to decode base64 data: {e}")
                return None

            return AssetFile(data, mime_type, data_url)

        except Exception as e:
            print(f"Error parsing data URL: {e}")
            return None

    def save_asset_file(self, asset: AssetFile) -> str:
        """Save asset file to disk and return relative path."""
        # Check if we already have this file (deduplication)
        if asset.hash in self.processed_files:
            existing = self.processed_files[asset.hash]
            print(f"  Duplicate file found, reusing: {existing.filename}")
            return f"/assets/deployed/{existing.filename}"

        # Save new file
        file_path = self.assets_dir / asset.filename
        try:
            with open(file_path, 'wb') as f:
                f.write(asset.data)

            # Store for deduplication
            self.processed_files[asset.hash] = asset

            size_kb = len(asset.data) / 1024
            print(f"  Saved: {asset.filename} ({size_kb:.1f} KB)")

            return f"/assets/deployed/{asset.filename}"

        except Exception as e:
            print(f"Error saving file {asset.filename}: {e}")
            return None

    def replace_urls_in_object(self, obj: Any, replacements: Dict[str, str]) -> Any:
        """Recursively replace URLs in nested JSON objects."""
        if isinstance(obj, dict):
            result = {}
            for key, value in obj.items():
                if isinstance(value, str) and value in replacements:
                    result[key] = replacements[value]
                    print(f"    Replaced {key}: {value[:50]}... -> {replacements[value]}")
                elif isinstance(value, (dict, list)):
                    result[key] = self.replace_urls_in_object(value, replacements)
                else:
                    result[key] = value
            return result
        elif isinstance(obj, list):
            return [self.replace_urls_in_object(item, replacements) for item in obj]
        else:
            return obj

    def process_json_file(self, file_path: Path) -> Dict[str, Any]:
        """Process a single JSON file and return the processed data."""
        print(f"\nProcessing: {file_path.name}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None

        # Extract all data URLs
        data_urls = self.extract_data_urls(data)
        print(f"  Found {len(data_urls)} data URLs")

        if not data_urls:
            return data

        # Process each data URL
        url_replacements = {}
        for field_name, data_url, json_path in data_urls:
            print(f"  Processing {field_name} ({len(data_url)} chars)")

            # Parse and save asset
            asset = self.parse_data_url(data_url)
            if asset:
                new_url = self.save_asset_file(asset)
                if new_url:
                    url_replacements[data_url] = new_url

                    # Track for reporting
                    result = ProcessResult(data_url, new_url, str(self.assets_dir / asset.filename))
                    self.replacements.append(result)

        # Replace URLs in the data
        if url_replacements:
            print(f"  Replacing {len(url_replacements)} URLs...")
            processed_data = self.replace_urls_in_object(data, url_replacements)
            return processed_data

        return data

    def merge_scenarios(self, scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Merge multiple scenario objects into a single scenarios.json structure."""
        merged = {}

        for i, scenario in enumerate(scenarios):
            # Extract the main scenario object (assume it's the first/main key)
            if isinstance(scenario, dict):
                # If it's already a scenario object, use it directly
                if 'id' in scenario and 'title' in scenario:
                    scenario_id = scenario['id']
                    merged[scenario_id] = scenario
                else:
                    # If it's a wrapper object, extract the first scenario
                    for key, value in scenario.items():
                        if isinstance(value, dict) and 'id' in value and 'title' in value:
                            merged[key] = value
                            break

        return merged

    def deploy_assets(self, clean: bool = False) -> bool:
        """Main deployment function."""
        print("🚀 Starting Asset Deployment")
        print(f"Input directory: {self.input_dir}")
        print(f"Output file: {self.output_path}")
        print(f"Assets directory: {self.assets_dir}")

        # Clean existing assets if requested
        if clean and self.assets_dir.exists():
            print(f"\n🧹 Cleaning existing assets...")
            shutil.rmtree(self.assets_dir)
            self.assets_dir.mkdir(parents=True, exist_ok=True)

        # Find all JSON files in input directory
        json_files = list(self.input_dir.glob("*.json"))
        if not json_files:
            print(f"❌ No JSON files found in {self.input_dir}")
            return False

        print(f"\n📁 Found {len(json_files)} JSON files")

        # Process each JSON file
        processed_scenarios = []
        for json_file in json_files:
            result = self.process_json_file(json_file)
            if result:
                processed_scenarios.append(result)

        if not processed_scenarios:
            print("❌ No scenarios were processed successfully")
            return False

        # Merge scenarios
        print(f"\n🔀 Merging {len(processed_scenarios)} scenarios...")
        merged_data = self.merge_scenarios(processed_scenarios)

        # Save merged result
        try:
            with open(self.output_path, 'w', encoding='utf-8') as f:
                json.dump(merged_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Saved merged scenarios to: {self.output_path}")
        except Exception as e:
            print(f"❌ Error saving merged file: {e}")
            return False

        # Print summary
        self.print_summary()
        return True

    def print_summary(self):
        """Print deployment summary."""
        print(f"\n📊 Deployment Summary")
        print(f"├─ Processed files: {len(self.processed_files)}")
        print(f"├─ URL replacements: {len(self.replacements)}")

        # Calculate space savings
        original_size = sum(len(r.original_url) for r in self.replacements)
        new_size = sum(len(r.new_url) for r in self.replacements)
        if original_size > 0:
            savings_pct = ((original_size - new_size) / original_size) * 100
            print(f"├─ URL size reduction: {savings_pct:.1f}%")

        # File type breakdown
        file_types = {}
        total_size = 0
        for asset in self.processed_files.values():
            file_types[asset.mime_type] = file_types.get(asset.mime_type, 0) + 1
            total_size += len(asset.data)

        print(f"├─ Total asset size: {total_size / 1024 / 1024:.2f} MB")
        print(f"└─ File types:")
        for mime_type, count in file_types.items():
            ext = MIME_TO_EXT.get(mime_type, '.bin')
            print(f"   ├─ {mime_type} ({ext}): {count} files")

def main():
    parser = argparse.ArgumentParser(
        description="Deploy assets from JSON data URLs to static files",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        '--input', '-i',
        default='input_json',
        help='Input directory containing JSON files (default: input_json)'
    )

    parser.add_argument(
        '--output', '-o',
        default='src/data/scenarios.json',
        help='Output JSON file path (default: src/data/scenarios.json)'
    )

    parser.add_argument(
        '--assets', '-a',
        default='public/assets/deployed',
        help='Assets output directory (default: public/assets/deployed)'
    )

    parser.add_argument(
        '--clean', '-c',
        action='store_true',
        help='Clean existing assets before deployment'
    )

    args = parser.parse_args()

    # Create deployer and run
    deployer = AssetDeployer(args.input, args.output, args.assets)

    try:
        success = deployer.deploy_assets(clean=args.clean)
        if success:
            print("\n🎉 Asset deployment completed successfully!")
            sys.exit(0)
        else:
            print("\n💥 Asset deployment failed!")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️  Deployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()