import json
import os

from kafka import KafkaConsumer


TOPIC_NAME = "server_metrics"
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")


def consume_metrics():
    consumer = KafkaConsumer(
        TOPIC_NAME,
        bootstrap_servers=[BOOTSTRAP_SERVERS],
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    )

    try:
        for message in consumer:
            metric = message.value
            print("Received:")
            print(f"Server: {metric['server_id']}")
            print(f"CPU: {metric['cpu_usage']}%")
            print(f"Memory: {metric['memory_usage']}%")

            if metric["cpu_usage"] > 80:
                print(f"ALERT: High CPU detected on {metric['server_id']}")

            print("-" * 30)
    except KeyboardInterrupt:
        print("Consumer stopped.")
    finally:
        consumer.close()


if __name__ == "__main__":
    consume_metrics()
