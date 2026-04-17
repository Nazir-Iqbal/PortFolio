#!/bin/bash
# Build script for Vercel - installs dependencies and collects static files.
set -e

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python manage.py collectstatic --noinput
