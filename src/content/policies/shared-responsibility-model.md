---
title: Shared Responsibility Model
description: Understanding the security breakdown between Hot Aisle and the client.
date: '2026-02-05'
---

* * *

Last modified: **May 25th, 2024**

### What is a Shared Responsibility Model?

A Shared Responsibility Model is a tool to help communicate the distinction between the responsibilities held by Hot Aisle and the responsibilities held by our clients when using the Hot Aisle platform. The diagram below illustrates the basic aspects of Hot Aisle for which the client is ultimately responsible, as well as those for which Hot Aisle itself is ultimately responsible. You can read more about each listed aspect under the diagram.

Security and compliance on Hot Aisle operates as a **shared responsibility** between Hot Aisle and our customers. This shared model relieves the operational burden of customers while Hot Aisle operates, manages, and controls its components.

The Shared Responsibility Model below delineates the responsibilities that platform customers ("Client") maintain, versus those that Hot Aisle itself maintains.

### Terms

*   **Client**: A Hot Aisle customer
*   **End user**: A user connecting to the Client's services; the Client's customers

* * *

## Client responsibilities

Any aspects of using Hot Aisle Cloud that are within the Client's absolute control are the responsibility of the Client.

The following are elements that fall under the user's responsibility:

*   **Client software and applications and client-side data**: the software and applications users choose to run within their containers, as well as all client-side data, is the sole responsibility of the user.
*   **Any guest Operating System used on Virtual Servers**: users are responsible for guest Operating Systems and network configurations, including firewall configurations.

The following are all Client responsibilities described in depth.

### Customer access layer

| Responsibility | Description |
| :--- | :--- |
| **Customer data access** | The method by which end users normally access hosted data is the Client's responsibility. |
| **Collection, protection and use** | The methods by which any data is collected from or about end users is the Client's responsibility. |
| **Privacy Policy requirements** | It is the Client's responsibility to adhere to all legal, acceptable use, and requirements as stipulated in the [Hot Aisle Privacy Policy](/policies/privacy-policy). |

### Application layer

| Responsibility | Description |
| :--- | :--- |
| **Application code** | The performance, reliability, security, and management of the Client's application is the Client's responsibility. |

### Access layer

| Responsibility | Description |
| :--- | :--- |
| **Identity and Access Management (IAM)** | All identity-based access management (IAM) configurations are the Client's responsibility. |
| **Environment security** | Secure configuration of the Client's application environment is the Client's responsibility. |
| **Network policies and firewalls** | Secure configuration of the Client's network policies or firewalls is the Client's responsibility. |

### Data layer

| Responsibility | Description |
| :--- | :--- |
| **Data classification** | It is the responsibility of the Client to properly classify different types of data collected from or about end users for security purposes. |
| **Data protection** | It is the responsibility of the Client to ensure that classified data is adequately secured. |
| **Encryption** | It is the responsibility of the Client to ensure that any data determined to require encryption is encrypted. |
| **Disaster recovery plans and backups** | It is the responsibility of the Client to construct any backup systems or disaster recovery pipelines. |

* * *

## Hot Aisle responsibilities

Hot Aisle’s responsibilities begin at the physical level in the data centers housing Hot Aisle hardware.

It is our responsibility to ensure that our physical data centers are always secure, and that power is always on and flowing to where it is needed.

**Storage, compute power, and networking infrastructure** are all the responsibilities of Hot Aisle. Our high-performance GPUs and CPUs all fall under the care of our dedicated teams. Networking infrastructure is also the responsibility of Hot Aisle’s infrastructure teams.

The following are all Hot Aisle responsibilities described in depth.

### Platform layer

| Responsibility | Description |
| :--- | :--- |
| **Networking** | All networking infrastructure enabling connectivity between containers within the Hot Aisle cluster is the responsibility of Hot Aisle. |
| **API services** | The functionality and availability of all API services pertaining to Hot Aisle is the responsibility of Hot Aisle. |
| **Hypervisor services** | All services related to hypervisors for Virtual Servers or other products are the responsibility of Hot Aisle. |
| **Virtual Private Cloud** | The reliability, accessibility, serviceability and security of the Hot Aisle VPC is the responsibility of Hot Aisle. |

### Compute layer

| Responsibility | Description |
| :--- | :--- |
| **Operating Systems** | The integrity of all native Operating Systems offered directly through Hot Aisle (but not guest OSes, which fall under the responsibility of the Client) is the responsibility of Hot Aisle. |
| **Container support** | The health and functionality of containers within the Hot Aisle cluster is the responsibility of Hot Aisle. |
| **Hardware drivers** | The integrity of any drivers installed on Hot Aisle hardware is the responsibility of Hot Aisle. |
| **Health checking and mitigation** | The availability and serviceability of Hot Aisle infrastructure is the responsibility of Hot Aisle. |
| **Endpoint detection and response** | The monitoring of all Hot Aisle endpoints to ensure security an functionality as part of endpoint detection and response ("EDR") is the responsibility of Hot Aisle. |

### Network layer

| Responsibility | Description |
| :--- | :--- |
| **Internal and external connectivity** | The integrity of all native Operating Systems offered directly through Hot Aisle (but not guest OSes, which fall under the responsibility of the Client) is the responsibility of Hot Aisle. |
| **Routing** | The health and functionality of containers within the Hot Aisle cluster is the responsibility of Hot Aisle. |
| **Perimeter monitoring** | The integrity of any drivers installed on Hot Aisle hardware is the responsibility of Hot Aisle. |
| **Firewalls** | The availability and serviceability of Hot Aisle infrastructure is the responsibility of Hot Aisle. |

### Physical layer

| Responsibility | Description |
| :--- | :--- |
| **Data center security** | The security of all data centers and Hot Aisle hardware housed within them is the responsibility of Hot Aisle. |
| **Power and cooling** | The availability and proper flow of power, as well as the availability and proper flow of data center cooling, is the responsibility of Hot Aisle. |
| **IT inventory and access management** | Processing hardware inventory and access to Hot Aisle hardware is the responsibility of Hot Aisle. |
| **Physical networking** | The integrity and serviceability of the physical networking infrastructure for Hot Aisle is the responsibility of Hot Aisle. |
