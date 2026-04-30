
# Desafio DSMD — Microsserviços de Pagamento e Notificação

## Visão Geral
Este repositório contém dois serviços independentes:
- **ms-payment-service**: recebe solicitação via REST, persiste a transação no Postgres e publica eventos no RabbitMQ.
- **ms-notification-service**: consome eventos do RabbitMQ e registra notificações (logs).

A infraestrutura (Postgres + RabbitMQ) é provisionada via **docker-compose**, conforme exigido no desafio.

## Requisitos do Desafio Atendidos
- Serviços independentes (executam separadamente).
- Comunicação assíncrona via mensageria (RabbitMQ).
- Persistência da transação no banco (Postgres).
- Fluxo exigido (I–VI):
  1) Payment salva transação com status pendente
  2) Payment publica evento para notificação (solicitação recebida)
  3) Notification consome e notifica recebimento
  4) Payment confirma a transação e atualiza status para sucesso
  5) Payment publica evento para notificação (confirmação)
  6) Notification consome e notifica confirmação

## Arquitetura de Mensagens (RabbitMQ)
- **Fila**: `notification`
- **Eventos publicados pelo payment**:
  - `register` → notificação de recebimento da solicitação
  - `confirmation` → notificação de confirmação do pagamento

## Como Executar (LOCAL + Docker Infra)
### 1) Subir Infra (Postgres + RabbitMQ)
```bash
docker compose up -d
docker ps
