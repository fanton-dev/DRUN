EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L raspberrypi_zerow_uhat-cache:Connector_Generic_Conn_02x20_Odd_Even J?
U 1 1 5F7A2FFA
P 3450 3850
F 0 "J?" H 3500 4967 50  0000 C CNN
F 1 "Raspberry Pi Zero W" H 3500 4876 50  0000 C CNN
F 2 "" H 3450 3850 50  0001 C CNN
F 3 "" H 3450 3850 50  0001 C CNN
	1    3450 3850
	1    0    0    -1  
$EndComp
$Comp
L raspberrypi_zerow_uhat-cache:Connector_Generic_Conn_02x20_Odd_Even J?
U 1 1 5F7A8FE8
P 6900 3850
F 0 "J?" H 6950 4967 50  0000 C CNN
F 1 "SIM7600X 4G HAT" H 6950 4876 50  0000 C CNN
F 2 "" H 6900 3850 50  0001 C CNN
F 3 "" H 6900 3850 50  0001 C CNN
	1    6900 3850
	1    0    0    -1  
$EndComp
Text Label 2450 3050 0    50   ~ 0
GPIO2_SDA1
Text Label 2450 3150 0    50   ~ 0
GPIO3_SCL1
Text Label 2450 3250 0    50   ~ 0
GPIO4_GPIO_GCLK
Text Label 2450 3450 0    50   ~ 0
GPIO17_GEN0
Wire Wire Line
	2450 3050 3250 3050
Wire Wire Line
	3250 3150 2450 3150
Wire Wire Line
	3250 3250 2450 3250
Wire Wire Line
	3250 3450 2450 3450
Text Label 2450 3550 0    50   ~ 0
GPIO27_GEN2
Text Label 2450 3650 0    50   ~ 0
GPIO22_GEN3
Text Label 2450 3850 0    50   ~ 0
GPIO10_SPI_MOSI
Text Label 2450 3950 0    50   ~ 0
GPIO9_SPI_MISO
Text Label 2450 4050 0    50   ~ 0
GPIO11_SPI_SCLK
Text Label 2450 4250 0    50   ~ 0
ID_SD
Text Label 2450 4350 0    50   ~ 0
GPIO5
Text Label 2450 4450 0    50   ~ 0
GPIO6
Text Label 2450 4550 0    50   ~ 0
GPIO13
Text Label 2450 4650 0    50   ~ 0
GPIO19
Text Label 2450 4750 0    50   ~ 0
GPIO26
Text Label 4100 3250 0    50   ~ 0
GPIO14_TXD0
Text Label 4100 3350 0    50   ~ 0
GPIO15_RXD0
Text Label 4100 3450 0    50   ~ 0
GPIO18_GEN1
Text Label 4100 3650 0    50   ~ 0
GPIO23_GEN4
Text Label 4100 3750 0    50   ~ 0
GPIO24_GEN5
Text Label 4100 3950 0    50   ~ 0
GPIO25_GEN6
Text Label 4100 4050 0    50   ~ 0
GPIO8_SPI_CE0_N
Text Label 4100 4150 0    50   ~ 0
GPIO7_SPI_CE1_N
Text Label 4100 4450 0    50   ~ 0
GPIO12
Text Label 4100 4650 0    50   ~ 0
GPIO16
Text Label 4100 4750 0    50   ~ 0
GPIO20
Text Label 4100 4850 0    50   ~ 0
GPIO21
Wire Wire Line
	3250 3550 2450 3550
Wire Wire Line
	3250 3650 2450 3650
Wire Wire Line
	3250 3850 2450 3850
Wire Wire Line
	3250 3950 2450 3950
Wire Wire Line
	3250 4050 2450 4050
Wire Wire Line
	3250 4250 2450 4250
Wire Wire Line
	3250 4350 2450 4350
Wire Wire Line
	3250 4450 2450 4450
Wire Wire Line
	3250 4550 2450 4550
Wire Wire Line
	2450 4550 2450 4500
Wire Wire Line
	3250 4650 2450 4650
Wire Wire Line
	3250 4750 2450 4750
Wire Wire Line
	3750 3650 4600 3650
Wire Wire Line
	3750 3450 4600 3450
Wire Wire Line
	3750 3350 4600 3350
Wire Wire Line
	3750 3250 4600 3250
Wire Wire Line
	3750 3750 4600 3750
Wire Wire Line
	3750 3950 4600 3950
Wire Wire Line
	3750 4050 4600 4050
Wire Wire Line
	3750 4150 4600 4150
Wire Wire Line
	3750 4450 4600 4450
Wire Wire Line
	3750 4650 4600 4650
Wire Wire Line
	3750 4750 4600 4750
Wire Wire Line
	3750 4850 4600 4850
$Comp
L raspberrypi_zerow_uhat-cache:+3.3V #PWR?
U 1 1 5F7F49F5
P 3100 2750
F 0 "#PWR?" H 3100 2600 50  0001 C CNN
F 1 "+3.3V" H 3115 2923 50  0000 C CNN
F 2 "" H 3100 2750 50  0001 C CNN
F 3 "" H 3100 2750 50  0001 C CNN
	1    3100 2750
	1    0    0    -1  
$EndComp
$Comp
L raspberrypi_zerow_uhat-cache:power_+5V #PWR?
U 1 1 5F7F5FCE
P 4000 2750
F 0 "#PWR?" H 4000 2600 50  0001 C CNN
F 1 "power_+5V" H 4015 2923 50  0000 C CNN
F 2 "" H 4000 2750 50  0001 C CNN
F 3 "" H 4000 2750 50  0001 C CNN
	1    4000 2750
	1    0    0    -1  
$EndComp
$Comp
L raspberrypi_zerow_uhat-cache:power_PWR_FLAG #FLG?
U 1 1 5F7F6799
P 2450 2750
F 0 "#FLG?" H 2450 2825 50  0001 C CNN
F 1 "power_PWR_FLAG" H 2450 2923 50  0000 C CNN
F 2 "" H 2450 2750 50  0001 C CNN
F 3 "" H 2450 2750 50  0001 C CNN
	1    2450 2750
	1    0    0    -1  
$EndComp
$Comp
L raspberrypi_zerow_uhat-cache:power_PWR_FLAG #FLG?
U 1 1 5F8232F7
P 4550 2750
F 0 "#FLG?" H 4550 2825 50  0001 C CNN
F 1 "power_PWR_FLAG" H 4550 2923 50  0000 C CNN
F 2 "" H 4550 2750 50  0001 C CNN
F 3 "" H 4550 2750 50  0001 C CNN
	1    4550 2750
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5F7FA8CC
P 3150 5550
F 0 "#PWR?" H 3150 5300 50  0001 C CNN
F 1 "GND" H 3155 5377 50  0000 C CNN
F 2 "" H 3150 5550 50  0001 C CNN
F 3 "" H 3150 5550 50  0001 C CNN
	1    3150 5550
	1    0    0    -1  
$EndComp
Wire Wire Line
	3250 3350 3150 3350
Wire Wire Line
	3250 4150 3150 4150
Connection ~ 3150 4150
Wire Wire Line
	3150 4150 3150 4850
Wire Wire Line
	3250 4850 3150 4850
Connection ~ 3150 4850
Wire Wire Line
	3150 4850 3150 5550
Wire Wire Line
	3750 3150 3900 3150
Wire Wire Line
	3900 3150 3900 3550
Wire Wire Line
	3900 5550 3150 5550
Connection ~ 3150 5550
Wire Wire Line
	3750 3550 3900 3550
Connection ~ 3900 3550
Wire Wire Line
	3900 3550 3900 3850
Wire Wire Line
	3750 3850 3900 3850
Connection ~ 3900 3850
Text Label 4100 4250 0    50   ~ 0
ID_SC
Wire Wire Line
	3900 3850 3900 4350
Wire Wire Line
	3750 4250 4600 4250
Wire Wire Line
	3750 4350 3900 4350
Connection ~ 3900 4350
Wire Wire Line
	3900 4350 3900 4550
Wire Wire Line
	3750 4550 3900 4550
Connection ~ 3900 4550
Wire Wire Line
	3900 4550 3900 5550
Wire Wire Line
	3150 3350 3150 4150
Wire Wire Line
	3250 3750 3100 3750
Wire Wire Line
	3100 3750 3100 2950
Wire Wire Line
	2450 2750 2450 2950
Connection ~ 3100 2950
Wire Wire Line
	3100 2950 3100 2750
Wire Wire Line
	3100 2950 3250 2950
Wire Wire Line
	3750 2950 4000 2950
Wire Wire Line
	4000 2950 4000 2750
Wire Wire Line
	3750 3050 4000 3050
Wire Wire Line
	4000 3050 4000 2950
Connection ~ 4000 2950
Wire Wire Line
	4550 2950 4550 2750
Wire Wire Line
	4000 2950 4550 2950
Wire Wire Line
	2450 2950 3100 2950
Text GLabel 6700 2950 0    50   Input ~ 0
+3.3V
Text GLabel 6700 3050 0    50   Input ~ 0
GPIO2_SDA1
Text GLabel 6700 3150 0    50   Input ~ 0
GPIO3_SCL1
Text GLabel 6700 3250 0    50   Input ~ 0
GPIO4_GPIO_GCLK
Text GLabel 6700 3350 0    50   Input ~ 0
GND
Text GLabel 6700 3450 0    50   Input ~ 0
GPIO17_GEN0
Text GLabel 6700 3550 0    50   Input ~ 0
GPIO27_GEN2
Text GLabel 6700 3650 0    50   Input ~ 0
GPIO22_GEN3
Text GLabel 6700 3750 0    50   Input ~ 0
+3.3V
Text GLabel 6700 3850 0    50   Input ~ 0
GPIO10_SPI_MOSI
Text GLabel 6700 3950 0    50   Input ~ 0
GPIO9_SPI_MISO
Text GLabel 6700 4050 0    50   Input ~ 0
GPIO11_SPI_SCLK
Text GLabel 6700 4150 0    50   Input ~ 0
GND
Text GLabel 6700 4250 0    50   Input ~ 0
ID_SD
Text GLabel 6700 4350 0    50   Input ~ 0
GPIO5
Text GLabel 6700 4450 0    50   Input ~ 0
GPIO_6
Text GLabel 6700 4550 0    50   Input ~ 0
GPIO13
Text GLabel 6700 4650 0    50   Input ~ 0
GPIO19
Text GLabel 6700 4750 0    50   Input ~ 0
GPIO26
Text GLabel 6700 4850 0    50   Input ~ 0
GND
Text GLabel 7200 2950 2    50   Input ~ 0
+5V
Text GLabel 7200 3050 2    50   Input ~ 0
+5V
Text GLabel 7200 3150 2    50   Input ~ 0
GND
Text GLabel 7200 3250 2    50   Input ~ 0
GPIO14_TXD0
Text GLabel 7200 3350 2    50   Input ~ 0
GPIO15_RXD0
Text GLabel 7200 3450 2    50   Input ~ 0
GPIO18_GEN4
Text GLabel 7200 3550 2    50   Input ~ 0
GND
Text GLabel 7200 3650 2    50   Input ~ 0
GPIO23_GEN4
Text GLabel 7200 3750 2    50   Input ~ 0
GPIO24_GEN5
Text GLabel 7200 3850 2    50   Input ~ 0
GND
Text GLabel 7200 3950 2    50   Input ~ 0
GPIO25_GEN6
Text GLabel 7200 4050 2    50   Input ~ 0
GPIO8_SPI_CE0_N
Text GLabel 7200 4150 2    50   Input ~ 0
GPIO7_SPI_CE1_N
Text GLabel 7200 4250 2    50   Input ~ 0
ID_SC
Text GLabel 7200 4350 2    50   Input ~ 0
GND
Text GLabel 7200 4450 2    50   Input ~ 0
GPIO12
Text GLabel 7200 4550 2    50   Input ~ 0
GND
Text GLabel 7200 4650 2    50   Input ~ 0
GPIO12
Text GLabel 7200 4750 2    50   Input ~ 0
GPIO20
Text GLabel 7200 4850 2    50   Input ~ 0
GPIO21
Text Label 6900 5200 1    50   ~ 0
MAIN
Text Label 7000 5200 1    50   ~ 0
GNSS
$Comp
L Device:Antenna GPS
U 1 1 5F8CD0F8
P 7500 5250
F 0 "GPS" H 7580 5239 50  0000 L CNN
F 1 "Antenna" H 7580 5148 50  0000 L CNN
F 2 "" H 7500 5250 50  0001 C CNN
F 3 "~" H 7500 5250 50  0001 C CNN
	1    7500 5250
	1    0    0    -1  
$EndComp
$Comp
L Device:Antenna APN_Network
U 1 1 5F8CF6FA
P 6000 5250
F 0 "APN_Network" H 6080 5239 50  0000 L CNN
F 1 "Antenna" H 6080 5148 50  0000 L CNN
F 2 "" H 6000 5250 50  0001 C CNN
F 3 "~" H 6000 5250 50  0001 C CNN
	1    6000 5250
	1    0    0    -1  
$EndComp
Wire Wire Line
	7500 5450 7000 5450
Wire Wire Line
	7000 4900 7000 5450
Wire Wire Line
	6000 5450 6900 5450
Wire Wire Line
	6900 4900 6900 5450
$EndSCHEMATC
