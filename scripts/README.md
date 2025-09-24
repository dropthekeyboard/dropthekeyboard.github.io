# Asset Deployment Script

This Python script automatically processes JSON files containing Data URLs and converts them to actual asset files, significantly reducing file sizes and improving performance.

## Features

- ✅ **Data URL Extraction**: Automatically finds `audioUrl` and `imageUrl` fields containing Data URLs
- ✅ **File Conversion**: Converts base64 data to actual files (MP3, JPG, PNG, etc.)
- ✅ **Smart Deduplication**: Uses MD5 hashing to avoid storing duplicate files
- ✅ **URL Replacement**: Replaces Data URLs with relative asset paths
- ✅ **Scenario Merging**: Combines multiple JSON files into a single scenarios.json
- ✅ **Progress Reporting**: Shows detailed processing information and statistics

## Usage

### Basic Usage
```bash
# Process files using npm scripts
bun run deploy-assets

# Or run directly with Python
python3 scripts/deploy-assets.py
```

### Clean Deployment
```bash
# Clean existing assets before deployment
bun run deploy-assets:clean

# Or with Python
python3 scripts/deploy-assets.py --clean
```

### Custom Paths
```bash
python3 scripts/deploy-assets.py \
  --input input_json \
  --output src/data/scenarios.json \
  --assets public/assets/deployed
```

## Directory Structure

```
project/
├── input_json/                    # Input JSON files with Data URLs
│   └── *.json
├── public/assets/deployed/        # Generated asset files
│   ├── f0bb839b.mp3
│   ├── ba35a140.jpg
│   └── 316f9ece.png
├── src/data/
│   └── scenarios.json             # Processed JSON with asset paths
└── scripts/
    ├── deploy-assets.py           # Main deployment script
    └── README.md                  # This file
```

## Supported File Types

| MIME Type | Extension | Description |
|-----------|-----------|-------------|
| `audio/mpeg` | `.mp3` | MP3 audio files |
| `audio/wav` | `.wav` | WAV audio files |
| `audio/ogg` | `.ogg` | OGG audio files |
| `image/jpeg` | `.jpg` | JPEG images |
| `image/png` | `.png` | PNG images |
| `image/gif` | `.gif` | GIF images |
| `image/webp` | `.webp` | WebP images |

## Example Output

```
🚀 Starting Asset Deployment
Input directory: input_json
Output file: src/data/scenarios.json
Assets directory: public/assets/deployed

📁 Found 1 JSON files

Processing: use_case_1_restaurant_reservation_final_음성추가.json
  Found 8 data URLs
  Processing audioUrl (314963 chars)
  Saved: f0bb839b.mp3 (230.7 KB)
  Processing audioUrl (132179 chars)
  Saved: 8c6d806e.mp3 (96.8 KB)
  Processing imageUrl (140979 chars)
  Saved: ba35a140.jpg (103.2 KB)
  Duplicate file found, reusing: f0bb839b.mp3
  Replacing 6 URLs...

📊 Deployment Summary
├─ Processed files: 6
├─ URL replacements: 8
├─ URL size reduction: 100.0%
├─ Total asset size: 1.09 MB
└─ File types:
   ├─ audio/mpeg (.mp3): 4 files
   ├─ image/jpeg (.jpg): 1 files
   ├─ image/png (.png): 1 files

🎉 Asset deployment completed successfully!
```

## Benefits

### Performance Improvements
- **Reduced JSON size**: Data URLs are replaced with short relative paths
- **Faster loading**: Assets are loaded separately and can be cached
- **Memory efficiency**: No base64 decoding overhead in the browser

### Development Benefits
- **Cleaner code**: No massive base64 strings cluttering JSON files
- **Better version control**: Assets are stored as binary files
- **Easy debugging**: Actual files can be inspected directly

### File Management
- **Deduplication**: Identical assets are stored only once
- **Organized structure**: All assets in dedicated directory
- **Hash-based naming**: Prevents filename conflicts

## Error Handling

The script includes comprehensive error handling:
- Invalid Data URL formats are skipped with warnings
- Unsupported MIME types are reported
- File write errors are logged
- Base64 decoding failures are handled gracefully

## Requirements

- Python 3.6+
- Standard library only (no external dependencies)