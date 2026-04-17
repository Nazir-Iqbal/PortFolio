#!/bin/bash
# Build script for Vercel - collects static files
pip install uv
uv pip install --system -r requirements.txt
python3 manage.py collectstatic --noinput
