import os
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


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


SYSTEM_PROMPT = """You are Nazir Iqbal's portfolio assistant. Answer questions about Nazir concisely and helpfully.

About Nazir:
- Software Engineer / Backend Developer based in Pune, India
- B.E. Computer Science from Army Institute of Technology, Pune (CGPA: 8.6, 2021-2025)
- Currently at Solytics Partners (Jun 2025 – Present) as Backend Developer
- Previously at ZS Associates (Jan 2025 – May 2025) as BTS Associate – Intern

Key Skills: Python, Django, REST APIs, OAuth2/JWT, Celery, Redis, PostgreSQL, Apache Spark, Docker, Kubernetes, AWS, Azure CI/CD, LangChain/RAG, Scikit-learn, Power BI, ReactJS, C++, Java, JavaScript

Current Work at Solytics Partners:
- Multi-Tenant OAuth2 Authentication System (40% faster login, 10+ clients)
- Project Ownership System with RBAC
- Celery-Based Async Processing (40% efficiency gain, 50% less latency)
- Vendor-Agnostic Logging Framework (Elastic, Datadog, Dynatrace)
- GenAI-Powered Analytics Platform using LLMs and RAG with Milvus
- Freeware Service serving 1,000+ users
- Apache Spark integration for distributed processing

Work at ZS Associates:
- Revamped CI/CD Pipelines (30% faster deploys, 20% more releases)
- Hive-Based Data Ingestion (40% less latency)
- ETL Pipelines with Python/DAG/Multithreading (200-300% faster)
- 4-Layer Data Architecture with Spark + Power BI

Projects:
- Django Tweet: AI-Powered Real-Time Chat & Streaming Platform (50+ users, OpenAI + Claude APIs)
- Analytics Platform for ML: Full-stack ML platform with 5 service layers, model suggestions, side-by-side comparison

Achievements:
- Codeforces Specialist (1528 rating)
- CodeChef 5-Star (2000+ score)
- Secretary, Coding Club (100+ students)
- Joint Secretary, Tech Board

Contact: naziriqbal01102003@gmail.com, +91 8522867367
LinkedIn: linkedin.com/in/nazir-iqbal33
GitHub: github.com/Nazir-Iqbal
Codeforces: codeforces.com/profile/Delta_Naz

Keep responses brief (2-4 sentences max). Be friendly and professional."""


@csrf_exempt
@require_POST
def chat_api(request):
    try:
        body = json.loads(request.body)
        user_message = body.get('message', '').strip()
        if not user_message or len(user_message) > 500:
            return JsonResponse({'error': 'Invalid message'}, status=400)

        from openai import OpenAI
        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': user_message},
            ],
            max_tokens=200,
            temperature=0.7,
        )

        reply = response.choices[0].message.content.strip()
        return JsonResponse({'reply': reply})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Something went wrong'}, status=500)
