# **Hostman**

This is a CLI (Command Line Interface) for managing the hosts file located at C:\Windows\System32\drivers\etc.

## **Install**

```shell
npm install @imjano/hostman_cli -g
```

## **Available Commands**

### **create**

Create a new host entry in the hosts file with the provided domain and IP.

#### **Options**

-   `--domain:` specify the domain of the host.
-   `--ip:` specify the IP address associated with the host.
-   `--y:` skip confirmations.

#### Usage example

```shell
hostman create --domain example.com --ip 192.168.1.100 --y
```

### **open**

Read and print the contents of the hosts file to the console.

#### Usage example

```shell
hostman open
```

### **list**

Display a table of hosts present in the hosts file. If no options are specified, hostman will only list the hosts created by itself.

#### **Options**

-   `--all:` Display a table of hosts present in the hosts file. If no options are specified, hostman will only list the hosts created by this hostman.
-   `--others:` show only the hosts that were not created by this hostman.

#### Usage example

```shell
hostman list
```

```shell
hostman list --all
```

```shell
hostman list --others
```

### **delete**

Delete the host entry that matches the provided ID.

#### **Options**

-   `--id:` specify the ID of the host to delete.
-   `--y:` skip confirmations.

#### Usage example

```shell
hostman delete 1 --y
```

### **backup**

Perform operations related to backups of the hosts file. If no options are specified, hostman will create a new backup.

#### **Options**

-   `--list:` display a list of all saved backups.
-   `--id:` specify the ID of the backup.
-   `--open:` print the backup with the provided ID to the console.
-   `--restore:` restore the hosts file to the selected version with the specified ID.
-   `--y:` skip confirmations.

#### Usage example

```shell
hostman backup
```

```shell
hostman list
```

```shell
hostman open --id 1
```

```shell
hostman restore --id 1
```

### **update**

This command should be executed every time a modification is made to the hosts file to update the configuration.

#### **Options**

-   `--list:` display a list of all saved backups.
-   `--id:` specify the ID of the backup.
-   `--open:` print the backup with the provided ID to the console.
-   `--restore:` restore the hosts file to the selected version with the specified ID.
-   `--y:` skip confirmations.
    .

#### Usage example

```shell
hostman update
```
