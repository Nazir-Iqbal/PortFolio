import os
from django.shortcuts import render


def home(request):
    context = {
        'linkedin_url': os.environ.get('LINKEDIN_URL', '#'),
        'naukri_url': os.environ.get('NAUKRI_URL', '#'),
        'codeforces_url': os.environ.get('CODEFORCES_URL', '#'),
        'github_url': os.environ.get('GITHUB_URL', '#'),
        'django_tweet_url': os.environ.get('DJANGO_TWEET_URL', '#'),
        'analytics_platform_url': os.environ.get('ANALYTICS_PLATFORM_URL', '#'),
    }
    return render(request, 'index.html', context)
