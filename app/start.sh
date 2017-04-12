#!/bin/bash

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

# Enable i2c and other interfaces
modprobe i2c-dev || true

# Start resin-wifi-connect
printf "Checking if we are connected to the internet via a google ping...\n\n"
wget --spider http://google.com 2>&1
if [ $? -eq 0 ]; then
	printf "\nconnected to internet, skipping wifi-connect\n\n"
else
	printf "\nnot connected, starting wifi-connect\n\n"
	node src/app.js
fi

node /usr/src/app/index.js
