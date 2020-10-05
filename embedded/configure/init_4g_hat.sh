#!/bin/sh
# Checking for root permisions
if [[ $EUID -ne 0 ]]; then
   echo "[Error] This script must be run as root" 
   exit 1
fi

# Sourced from the raspi-config configuration utility
# github.com/RPi-Distro/raspi-config/blob/master/raspi-config
# Helper functions for config saving and platform checking
set_config_var() {
    lua - "$1" "$2" "$3" <<EOF > "$3.bak"
local key=assert(arg[1])
local value=assert(arg[2])
local fn=assert(arg[3])
local file=assert(io.open(fn))
local made_change=false
for line in file:lines() do
if line:match("^#?%s*"..key.."=.*$") then
    line=key.."="..value
    made_change=true
end
print(line)
end
if not made_change then
print(key.."="..value)
end
EOF
    mv "$3.bak" "$3"
}

is_pi () {
  ARCH=$(dpkg --print-architecture)
  if [ "$ARCH" = "armhf" ] || [ "$ARCH" = "arm64" ] ; then
    return 0
  else
    return 1
  fi
}

if is_pi ; then
  CMDLINE=/boot/cmdline.txt
else
  CMDLINE=/proc/cmdline
fi

# Disables login over serial
echo "[Info] Disabling serial login"
sed -i $CMDLINE -e "s/console=ttyAMA0,[0-9]\+ //"
sed -i $CMDLINE -e "s/console=serial0,[0-9]\+ //"

# Enabling the UART
echo "[Info] Enabling serial port hardware"
set_config_var enable_uart 1 $CONFIG
if ! grep -q "enable_uart=1" /boot/config.txt ; then
    echo "enable_uart=1" >> /boot/config.txt
fi

# Rebooting the system
echo "[Info] Rebooting"
reboot