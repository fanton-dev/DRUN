#!/bin/sh
# Checking for root permisions
if [[ $EUID -ne 0 ]]; then
   echo "[Error] This script must be run as root" 
   exit 1
fi

# Installing utilities if not already present
if ! command -v qmicli &> /dev/null
then
   echo "[Info] Installing libqmi-utils"
   apt-get update
   apt-get install libqmi-utils
fi

if ! command -v udhcpc &> /dev/null
then
   echo "[Info] Installing udhcpc"
   apt-get update
   apt-get install udhcpc
fi

# Cellural enable + statistics
echo "[Info] Enabling cellural radio"
qmicli -d /dev/cdc-wdm0 --dms-set-operating-mode='online'

echo "[Debug] Listing network statistics"
qmicli -d /dev/cdc-wdm0 --nas-get-signal-strength
qmicli -d /dev/cdc-wdm0 --nas-get-home-network
qmicli -d /dev/cdc-wdm0 -w

# Setting the interface protocol
echo "[Info] Setting interface to use \"raw-ip\""
ip link set wwan0 down
echo 'Y' | tee /sys/class/net/wwan0/qmi/raw_ip
ip link set wwan0 up

# Connecting to LTE
echo "[Info] Connect to the mobile internet"
qmicli -p -d /dev/cdc-wdm0 --device-open-net='net-raw-ip|net-no-qos-header' --wds-start-network="apn='internet.a1.bg',ip-type=4" --client-no-release-cid

# DHCP configuration
echo "[Info] Configuring network using DHCP"
udhcpc -i wwan0
