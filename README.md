# Clusterio Remote Scripts Plugin

Plugin allowing scripts to invoked on hosts remotely.


## Installation

Run the following commands in the folder Clusterio is installed to:

    npm install @hornwitser/remote_scripts
    npx clusteriocontroller plugin add @hornwitser/remote_scripts

Substitute clusteriocontroller with clusteriohost or clusterioctl if this a dedicate host or ctl installation respectively.

When installing on a host create a folder named `scripts` in the Clusterio host installation folder and pupulate it with scripts that you want to make remotely accessible.
See [/examples](/examples) for examples of scripts that can be added to hosts.

## Usage

Use clusterioctl to list and execute commands on the host.

    npx clusterioctl remote-scripts host-list my-host
    npx clusterioctl remote-scripts host-run my-host dl-factorio.sh 1.1.101
