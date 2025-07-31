#!/bin/bash

# Script to fix video color profiles
# This will re-encode the video with modern color space settings

INPUT_VIDEO="public/vids/nat-fly-girls.webm"
OUTPUT_VIDEO="public/vids/nat-fly-girls-fixed.webm"

echo "Re-encoding video with modern color profiles..."

ffmpeg -i "$INPUT_VIDEO" \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -vf "colorspace=bt709:iall=bt709:fast=1" \
  -color_primaries bt709 \
  -color_trc bt709 \
  -colorspace bt709 \
  -c:a libopus \
  -b:a 128k \
  "$OUTPUT_VIDEO"

if [ $? -eq 0 ]; then
  echo "Video re-encoded successfully!"
  echo "Original file: $INPUT_VIDEO"
  echo "New file: $OUTPUT_VIDEO"
  echo ""
  echo "To use the fixed video, update the src in page.js to:"
  echo "src=\"/vids/nat-fly-girls-fixed.webm\""
else
  echo "Error re-encoding video"
  exit 1
fi 