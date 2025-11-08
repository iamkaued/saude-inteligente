# app/analysis.py
import random

def analyze_file(filepath: str) -> dict:
    """
    Simula a análise de um exame.
    Retorna um resultado aleatório representando a conclusão da análise.
    """

    # Simula resultados possíveis
    resultados = [
        {"nivel_risco": "Baixo", "mensagem": "Exame dentro da normalidade."},
        {"nivel_risco": "Moderado", "mensagem": "Alguns indicadores estão fora da faixa ideal."},
        {"nivel_risco": "Alto", "mensagem": "Recomenda-se avaliação médica detalhada."},
    ]

    # Escolhe um resultado aleatório para simular a IA
    resultado_escolhido = random.choice(resultados)

    return {
        "status": "processado",
        "resultado": resultado_escolhido,
        "sumario": "Análise concluída automaticamente pela API Saúde Inteligente."
    }