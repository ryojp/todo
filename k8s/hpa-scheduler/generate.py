#!/usr/bin/env python3

from collections import namedtuple
import csv
import os


BASE_DIR = "k8s/hpa-scheduler/"
OUTPUT_DIR = os.path.join(BASE_DIR, "generated/")
CRONJOB_TEMPLATE_FILE = os.path.join(BASE_DIR, "cronjob-template.yml")
CRONJOB_CSV_FILE = os.path.join(BASE_DIR, "cronjob.csv")
TIMEZONE_DIFF = int(os.environ.get("TIMEZONE_DIFF", +9))  # UTC+0900

Config = namedtuple("Config", "NAMESPACE,HPA,HOUR,MINUTE,MIN_REPLICAS,MAX_REPLICAS")


def substitute_template_yml(
    config: Config, template: str = CRONJOB_TEMPLATE_FILE
) -> str:
    # read the template file content
    with open(template, "r") as f:
        content = f.read()

    # convert "3" -> "03" etc.
    minute, hour = config.MINUTE.rjust(2, "0"), config.HOUR.rjust(2, "0")

    # convert timezone to UTC
    utc_hour = (int(hour) - TIMEZONE_DIFF) % 24
    utc_hour = str(utc_hour).rjust(2, "0")

    return (
        content.replace("__CRON__", f"{minute} {utc_hour} * * *")
        .replace("__NAMESPACE__", config.NAMESPACE)
        .replace("__HPA__", config.HPA)
        .replace("__HOURMIN__", hour + minute)
        .replace("__MIN__", config.MIN_REPLICAS)
        .replace("__MAX__", config.MAX_REPLICAS)
    )


def read_csv(csv_filename: str) -> list[Config]:
    with open(csv_filename) as f:
        reader = csv.reader(f)

        # make sure the CSV header matches the `Config` type
        assert Config._fields == tuple(next(reader))  # RHS: reading the CSV header

        return list(map(Config._make, reader))


def write_yml(filename: str, content: str) -> None:
    with open(filename, "w") as f:
        f.write(content)


def generate_filename(config: Config) -> str:
    return (
        f'cj-{config.HPA}{config.HOUR.rjust(2, "0")}{config.MINUTE.rjust(2, "0")}.yml'
    )


def generate_yml_from_csv(csv_filename: str, outdir: str) -> None:
    os.makedirs(outdir, exist_ok=True)
    for config in read_csv(csv_filename=csv_filename):
        _filename = generate_filename(config)
        _content = substitute_template_yml(config=config)
        write_yml(os.path.join(outdir, _filename), _content)


if __name__ == "__main__":
    generate_yml_from_csv(CRONJOB_CSV_FILE, OUTPUT_DIR)
