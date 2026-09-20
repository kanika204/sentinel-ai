import statistics
from typing import List, Dict, Any

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def generate_dataset() -> List[Dict[str, Any]]:
    """Create a sample log dataset with a few obvious CPU anomalies."""
    timestamps = [
        "10:00", "10:01", "10:02", "10:03", "10:04", "10:05", "10:06", "10:07",
        "10:08", "10:09", "10:10", "10:11", "10:12", "10:13", "10:14", "10:15",
        "10:16", "10:17", "10:18", "10:19",
    ]

    cpu_values = [
        42, 48, 55, 50, 46, 95, 52, 49, 47, 53,
        51, 44, 97, 48, 50, 54, 46, 52, 92, 49,
    ]

    memory_values = [
        50, 53, 52, 49, 48, 78, 54, 51, 57, 56,
        51, 52, 80, 54, 55, 53, 52, 54, 75, 51,
    ]

    response_values = [
        210, 220, 205, 214, 225, 510, 200, 230, 220, 215,
        225, 210, 560, 215, 220, 210, 220, 215, 480, 218,
    ]

    records = []
    for ts, cpu, mem, resp in zip(timestamps, cpu_values, memory_values, response_values):
        records.append({
            "timestamp": ts,
            "cpu_usage": cpu,
            "memory_usage": mem,
            "response_time": resp,
        })

    return records


def calculate_statistics(records: List[Dict[str, Any]]) -> Dict[str, float]:
    cpu_values = [r["cpu_usage"] for r in records]
    memory_values = [r["memory_usage"] for r in records]
    response_values = [r["response_time"] for r in records]

    return {
        "avg_cpu": statistics.mean(cpu_values),
        "avg_memory": statistics.mean(memory_values),
        "avg_response": statistics.mean(response_values),
        "max_cpu": max(cpu_values),
        "max_memory": max(memory_values),
        "max_response": max(response_values),
    }


def detect_anomalies(records: List[Dict[str, Any]], cpu_threshold: float = 85.0) -> List[Dict[str, Any]]:
    anomalies = []
    for record in records:
        if record["cpu_usage"] > cpu_threshold:
            anomalies.append({
                "timestamp": record["timestamp"],
                "cpu_usage": record["cpu_usage"],
                "status": "ANOMALY",
            })
    return anomalies


def display_anomalies(anomalies: List[Dict[str, Any]]) -> None:
    print(f"Anomalies detected: {len(anomalies)}")
    print("\nTimestamp       CPU       Status")
    for item in anomalies:
        print(f"{item['timestamp']:<14} {item['cpu_usage']:>3}%      {item['status']}")


def plot_metrics(records: List[Dict[str, Any]], anomalies: List[Dict[str, Any]]) -> None:
    timestamps = [r["timestamp"] for r in records]
    cpu_values = [r["cpu_usage"] for r in records]
    anomaly_points = {item["timestamp"]: item["cpu_usage"] for item in anomalies}

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(timestamps, cpu_values, marker="o", linewidth=2, color="tab:blue", label="CPU Usage (%)")

    for ts, value in anomaly_points.items():
        idx = timestamps.index(ts)
        ax.scatter(ts, value, color="red", s=80, label="Anomaly" if idx == 0 else "")

    ax.axhline(85, color="orange", linestyle="--", linewidth=1, label="Threshold (85%)")
    ax.set_title("Server CPU Usage and Anomalies")
    ax.set_xlabel("Timestamp")
    ax.set_ylabel("CPU (%)")
    ax.grid(True, linestyle="--", alpha=0.5)
    ax.legend(loc="upper right")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig("q1_cpu_anomalies.png")
    plt.close(fig)


def main() -> None:
    records = generate_dataset()
    stats = calculate_statistics(records)
    anomalies = detect_anomalies(records)

    print(f"Total records: {len(records)}")
    print(f"Average CPU: {stats['avg_cpu']:.2f}%")
    print(f"Average Memory: {stats['avg_memory']:.2f}%")
    print(f"Average Response Time: {stats['avg_response']:.2f} ms")
    print()

    display_anomalies(anomalies)
    plot_metrics(records, anomalies)
    print("\nGraph saved to q1_cpu_anomalies.png")


if __name__ == "__main__":
    main()
