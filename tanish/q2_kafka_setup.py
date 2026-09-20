import os
import time

from kafka import KafkaAdminClient
from kafka.admin import NewTopic
from kafka.errors import KafkaError, TopicAlreadyExistsError


TOPIC_NAME = "server_metrics"
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")


def create_topic():
    retry_count = 20
    for attempt in range(1, retry_count + 1):
        try:
            admin_client = KafkaAdminClient(
                bootstrap_servers=BOOTSTRAP_SERVERS,
                client_id="server_metrics_admin",
                request_timeout_ms=10000,
                api_version=(0, 10, 2),
            )
            topic = NewTopic(name=TOPIC_NAME, num_partitions=1, replication_factor=1)
            admin_client.create_topics(new_topics=[topic], validate_only=False)
            admin_client.close()
            print(f"Topic '{TOPIC_NAME}' created successfully on {BOOTSTRAP_SERVERS}.")
            return
        except TopicAlreadyExistsError:
            admin_client.close()
            print(f"Topic '{TOPIC_NAME}' already exists on {BOOTSTRAP_SERVERS}.")
            return
        except KafkaError as exc:
            if attempt == retry_count:
                raise RuntimeError(f"Unable to create topic '{TOPIC_NAME}': {exc}") from exc
            print(f"Kafka not ready yet (attempt {attempt}/{retry_count}), retrying in 2 seconds...")
            time.sleep(2)


if __name__ == "__main__":
    create_topic()
