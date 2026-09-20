# AIOps Lab

This repository contains the step-by-step AIOps exercises requested in the task.

## Completed steps

- Question 1: AIOps log anomaly detection
- Question 2: Kafka topic creation and metric publishing
- Question 3: Kafka metric consumption and high-CPU alerting
- Question 4: Airflow AIOps workflow orchestration
- Question 5: Integrated Kafka anomaly monitoring

## Run Q3

Start Kafka and run the consumer:

```bash
docker compose up -d
python q3_kafka_consumer.py
```

The consumer continuously reads `server_metrics`, displays each server metric, and prints an alert when CPU usage is greater than 80%.

## Run Q4

Place [q4_airflow_aiops_dag.py](q4_airflow_aiops_dag.py) in the Airflow DAGs folder. The workflow runs `collect_metrics`, `process_metrics`, `detect_anomaly`, and `generate_report` in sequence.

## Run Q5

Start Kafka and run the integrated monitor:

```bash
docker compose up -d
python q5_integrated_aiops_monitor.py
```

The monitor consumes `server_metrics`, alerts when CPU usage is greater than 80%, and maintains a running and final anomaly total.
