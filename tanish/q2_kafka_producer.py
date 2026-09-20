import json
import os
import time

from kafka import KafkaProducer
from kafka.errors import KafkaError

TOPIC_NAME = "server_metrics"
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")


def create_messages():
    messages = []
    for idx in range(1, 11):
        server_id = f"server{idx:02d}"
        messages.append({
            "server_id": server_id,
            "cpu_usage": 40 + (idx * 5) % 55,
            "memory_usage": 50 + (idx * 7) % 40,
        })
    return messages


def publish_messages():
    messages = create_messages()
    for attempt in range(1, 21):
        try:
            producer = KafkaProducer(
                bootstrap_servers=[BOOTSTRAP_SERVERS],
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                api_version=(0, 10, 2),
            )
            for message in messages:
                producer.send(TOPIC_NAME, value=message)
                print(f"Sent: {message}")
                time.sleep(0.5)
            producer.flush()
            producer.close()
            print(f"Successfully published {len(messages)} messages to topic '{TOPIC_NAME}'.")
            return
        except KafkaError as exc:
            if attempt == 20:
                raise RuntimeError(f"Unable to publish messages to '{TOPIC_NAME}': {exc}") from exc
            print(f"Kafka broker not ready yet (attempt {attempt}/20), retrying in 2 seconds...")
            time.sleep(2)


if __name__ == "__main__":
    publish_messages()
