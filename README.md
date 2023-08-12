1.0Introduction

Autodata is a web portal designed to access CDR records and perform analytical operations on the CDR data pertaining to Nigeria. It has been developed with React.js, Django and AWS ElasticSearch as its primary frameworks.

Autodata is a project developed by Tvast IT Solutions for Shyena Pvt Ltd during August 2020-2021

2.0 Deployment
Autodata is deployed on servers provided by Mr. Ken that can be accessed only through VPN. This document contains all the software and details you need to deploy to access the software.
	
2.1 Required Software

These are the required software for Autodata.

2.11 OpenVPN GUI

OpenVPN GUI is the VPN tool used to connect to the server. We can access the software from the following link
            			Link: https://bit.ly/3j5TpCM
Steps:
•	Use the link to download the software
•	Install the software
•	Add the config file
•	Open a new document in the text editor
•	Add the following text to the document
```
dev tun
persist-tun
persist-key
cipher AES-128-CBC
ncp-ciphers AES-128-GCM
auth SHA1
tls-client
client
resolv-retry infinite
remote 197.210.168.21 1194 udp4
lport 0
auth-user-pass
ca pfSense-UDP4-1194-ca.crt
tls-auth pfSense-UDP4-1194-tls.key 1
remote-cert-tls server
remote-random
```
•	Save the file with the name ontracc.ovpn
•	Run OpenVPN software
•	On the bottom right of your screen, click “^” and choose the openvpn icon.
•	Click “Import config”
•	Import ontracc.ovpn file

3.0 VPN
In order to connect to the VPN you need to add the route to the system subnet
Steps
•	Open Cmd prompt as “Run as administrator”
•	Run the following command on your system
```
route add 10.0.5.0 mask 255.255.255.0 20.20.20.0 -p
```
      Note: Step 2 is required only during the first installation
•	Run OpenVPN software and try to connect to ontracc.ovpn 
•	The following credentials need to be used to connect to the server successfully. 

```
Username: Darshan
Password: Connect@#

```

•	Use SSH to connect to the system

```
ssh -p 22 root@10.0.5.66
```


•	Use the Password: 2adm1n@cdr
4.0 System Configuration

Autodata system that is deployed on the server has 2 parts
•	Autodata-Frontend
•	Autodata-Backend

4.1 Autodata-Frontend
 
Under the case of system data loss or deployment to a new system, the following steps must be undertaken to deploy the system.

4.11 New Installation

To deploy to a new system, we will have to clone the repo and build the system.
Steps
•	Clone the repo from git


```
git clone https://github.com/tvast-it-solutions/autodata-frontend
```


•	Move to the folder
```
cd autodata-frontend/
```

•	Install all the dependencies

```
npm install 
```

•	Build the React project
```
npm run-script build
```

      Note: If you get an error regarding heap-memory you can use the following command to    allocate more memory to the project “export NODE_OPTIONS=--max_old_space_size=8192”
•	Deploy it
We are deploying it to 9000 port in the following command.
```
nohup serve -s build -l 9000 &
```
4.12 System Reboot

 If the UI is down, the following steps can be taken up to 
Steps
•	Move to the folder
```
cd autodata-frontend/
```

•	Build the React project
```
npm run-script build
```

      Note: If you get an error regarding heap-memory you can use the following command to    allocate more memory to the project “export NODE_OPTIONS=--max_old_space_size=8192”
•	Deploy it
We are deploying it to 9000 port in the following command.
```
nohup serve -s build -l 9000 &
```

4.2 Autodata-Backend
 
Under the case of system data loss or deployment to a new system, the following steps must be undertaken to deploy the system.

4.21 New Installation

To deploy to a new system, we will have to clone the repo and build the system.
Steps
•	Clone the repo from git

```
git clone https://github.com/tvast-it-solutions/autodata-backend
```

•	Move to the folder
```
cd autodata-backend/
```

•	Install all the dependencies
```
pip3 install -r requirements.txt
```


•	Execute the migrations
```
python3 manage.py makemigrations
```

      
•	Push the migrations
```
python3 manage.py migrate
```



•	Deploy it
We are deploying it to 8080 port in the following command.

```
nohup python3 manage.py runserver 0.0.0.0:8080 &
```

4.22 System Reboot

 If the Backend is down, the following steps can be taken up to 
Steps
•	Move to the folder
```
cd autodata-backend/
```



•	Deploy it
We are deploying it to 8080 port in the following command.

```
nohup python3 manage.py runserver 0.0.0.0:8080 &
```


5.0 Additional Information

 There is another use case in which the system configuration will be changed. 
5.1 Frontend Global Settings

Few global elements of the frontend react project are present in the config.js file. This can be reached by moving to the folder.

```
cd autodata-frontend/src
```

The config file has the following code
```
module.exports = {
    drawerWidth: 240,
    googleMapsApiKey: 'AIzaSyCNFjFmnGwCekQz-GMUXupRUAEjSkqNmi8',
    apiHost: 'http://10.0.5.66:8080/api',
    DEFAULT_CASE_CHECK_OT: 'DEFAULT_CASE_CHECK_OT',
    FONT_SIZE: 12,
    HEADER_FONT_SIZE: 14
};
```
5.11 Drawer width throughout the application   

If the drawer width must be changed, the width can be set to any number as desired in the “drawerWidth” parameter in the config.js file.
5.12 Google Maps API throughout the application   

Google Maps API key can be set to the API key desired in the “googleMapsApiKey” parameter in the config.js file.
5.13 Backend Connectivity

The frontend is currently configured to reach the backend on port 8080 if this must be changed, the parameter “apiHost” should be changed to the backend endpoint. 
Note: The endpoint for the backend will have “/api” after the port number to reach the backend.  
5.14 CheckOT/ Default Case

As the system has a module in which all jobs can be created without any case creation. We need to configure this default case in the “DEFAULT_CASE_CHECK_OT” parameter. In the application, we have followed the naming culture “DEFAULT_CASE_CHECK_OT” to be the default case.
5.15 Font Size

The frontend is currently configured to have a font size of 12. This can be configured to any numeric number in the “FONT_SIZE” parameter.
5.16 Header Font Size

The frontend is currently configured to have a header font size of 14. This can be configured to any numeric number in the “HEADER_FONT_SIZE” parameter.
5.2 Postgres Set-Up

It has to be noted that when setting up the database the order of creating the first data entry is as follows.
•	Set up the database
•	Create a group in “groups” table
•	Create a user in “accounts” table as admin
•	Create a case under the user
