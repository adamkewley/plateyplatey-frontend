#!/bin/bash

inotifywait -e modify --exclude="#|flycheck" -m -r src/ | xargs -I {} make all
