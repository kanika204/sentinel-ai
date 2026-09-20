import json
import os

from kafka import KafkaConsumer

TOPIC_NAME = "server_metrics"
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")


def monitor_server_metrics():
    consumer = KafkaConsumer(
        TOPIC_NAME,
        bootstrap_servers=[BOOTSTRAP_SERVERS],
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    )

    anomaly_count = 0

    try:
        for message in consumer:
            metric = message.value
            server_id = metric["server_id"]
            cpu = metric["cpu_usage"]

            print(f"Message received: {server_id} | CPU: {cpu}%")

            if cpu > 80:
                anomaly_count += 1
                print(f"ALERT: High CPU detected on {server_id}")
            else:
                print("Normal")

            print(f"Total anomalies detected: {anomaly_count}")
            print("-" * 40)
    except KeyboardInterrupt:
        print("Monitor stopped.")
    finally:
        consumer.close()
        print(f"Final total anomalies detected: {anomaly_count}")


if __name__ == "__main__":
    monitor_server_metrics()
