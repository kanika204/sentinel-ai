from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta


def collect_metrics():
    metrics = {
        "cpu": 87,
        "memory": 65,
        "response_time": "420ms",
    }
    print(f"Collected metrics: {metrics}")
    return metrics


def process_metrics(**context):
    metrics = context["task_instance"].xcom_pull(task_ids="collect_metrics")
    print(f"Processed metrics: {metrics}")
    return metrics


def detect_anomaly(**context):
    metrics = context["task_instance"].xcom_pull(task_ids="process_metrics")
    cpu = metrics["cpu"]
    if cpu > 80:
        print("Anomaly detected: High CPU usage")
    else:
        print("No anomaly detected")


def generate_report(**context):
    print("===== AIOps Report =====")
    print("Metrics collected successfully")
    print("Metrics processed successfully")
    print("Anomaly detection completed")
    print("========================")


with DAG(
    dag_id="aiops_monitoring_workflow",
    default_args={
        "owner": "aiops",
        "depends_on_past": False,
        "retries": 1,
        "retry_delay": timedelta(minutes=2),
    },
    description="Basic AIOps workflow using PythonOperators",
    start_date=datetime(2025, 1, 1),
    schedule="@daily",
    catchup=False,
) as dag:

    collect_metrics_task = PythonOperator(
        task_id="collect_metrics",
        python_callable=collect_metrics,
    )

    process_metrics_task = PythonOperator(
        task_id="process_metrics",
        python_callable=process_metrics,
    )

    detect_anomaly_task = PythonOperator(
        task_id="detect_anomaly",
        python_callable=detect_anomaly,
    )

    generate_report_task = PythonOperator(
        task_id="generate_report",
        python_callable=generate_report,
    )

    collect_metrics_task >> process_metrics_task >> detect_anomaly_task >> generate_report_task
