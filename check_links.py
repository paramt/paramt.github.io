#!/usr/bin/env python

import csv
import requests

links = []

with open("_data/projects.csv") as f:
    lines = f
    lines = f.readlines()

    for l in  csv.reader(lines, quotechar='"', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True):
        links.append(l[4])

    links.pop(0)

for url in links:
    print(url)
    try:
        request = requests.get(url)
        if request.status_code == 200:
            print("Web site exists")
    except:
        print("Web site does not exist")
        exit(1)
