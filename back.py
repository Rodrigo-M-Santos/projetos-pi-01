from django.db import models

class Demanda(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

class Arquivo(models.Model):
    nome = models.CharField(max_length=255)
    arquivo = models.FileField(upload_to='arquivos/')
    data_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome


 from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Demanda, Arquivo
from django.core.files.storage import default_storage
import json

def listar_demandas(request):
    demandas = Demanda.objects.all().order_by('-criado_em')
    data = [{'id': demanda.id, 'titulo': demanda.titulo, 'descricao': demanda.descricao} for demanda in demandas]
    return JsonResponse(data, safe=False)

@csrf_exempt
def adicionar_demanda(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            titulo = data.get('titulo')
            descricao = data.get('descricao')
            if titulo and descricao:
                demanda = Demanda(titulo=titulo, descricao=descricao)
                demanda.save()
                return JsonResponse({'id': demanda.id, 'titulo': demanda.titulo, 'descricao': demanda.descricao}, status=201)
            else:
                return JsonResponse({'error': 'Título e descrição são obrigatórios.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados JSON inválidos.'}, status=400)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)

@csrf_exempt
def excluir_demanda(request, demanda_id):
    if request.method == 'DELETE':
        try:
            demanda = Demanda.objects.get(pk=demanda_id)
            demanda.delete()
            return JsonResponse({'message': 'Demanda excluída com sucesso.'}, status=200)
        except Demanda.DoesNotExist:
            return JsonResponse({'error': 'Demanda não encontrada.'}, status=404)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)

def listar_arquivos(request):
    arquivos = Arquivo.objects.all().order_by('-data_upload')
    data = [{'id': arquivo.id, 'nome': arquivo.nome, 'url': arquivo.arquivo.url} for arquivo in arquivos]
    return JsonResponse(data, safe=False)

@csrf_exempt
def upload_arquivos(request):
    if request.method == 'POST':
        arquivos = request.FILES.getlist('arquivos')
        arquivos_criados = []
        for arquivo_enviado in arquivos:
            arquivo = Arquivo(nome=arquivo_enviado.name, arquivo=arquivo_enviado)
            arquivo.save()
            arquivos_criados.append({'id': arquivo.id, 'nome': arquivo.nome, 'url': arquivo.arquivo.url})
        return JsonResponse(arquivos_criados, status=201, safe=False)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)

@csrf_exempt
def excluir_arquivo(request, arquivo_id):
    if request.method == 'DELETE':
        try:
            arquivo = Arquivo.objects.get(pk=arquivo_id)
            # Opcional: Excluir o arquivo do sistema de arquivos também
            default_storage.delete(arquivo.arquivo.name)
            arquivo.delete()
            return JsonResponse({'message': 'Arquivo excluído com sucesso.'}, status=200)
        except Arquivo.DoesNotExist:
            return JsonResponse({'error': 'Arquivo não encontrado.'}, status=404)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)  


 from django.urls import path
from . import views

urlpatterns = [
    path('demandas/', views.listar_demandas, name='listar_demandas'),
    path('demandas/adicionar/', views.adicionar_demanda, name='adicionar_demanda'),
    path('demandas/excluir/<int:demanda_id>/', views.excluir_demanda, name='excluir_demanda'),
    path('arquivos/', views.listar_arquivos, name='listar_arquivos'),
    path('arquivos/upload/', views.upload_arquivos, name='upload_arquivos'),
    path('arquivos/excluir/<int:arquivo_id>/', views.excluir_arquivo, name='excluir_arquivo'),
]

from django.urls import path
from . import views

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('planner_app.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
