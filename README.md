# Decentralized Medical Equipment Donation Tracking

A blockchain-based system for tracking medical equipment donations from donors to recipients, with verification and impact measurement capabilities.

## Overview

This project implements a set of smart contracts on the Stacks blockchain using Clarity to create a transparent, secure, and efficient system for tracking medical equipment donations. The system enables:

- Registration and verification of medical equipment donations
- Verification of donors to ensure legitimate sources
- Matching of equipment with appropriate healthcare facilities
- Tracking the impact and usage of donated equipment

## Smart Contracts

The system consists of four main smart contracts:

1. **Equipment Registry Contract** (`equipment-registry.clar`)
    - Records details of donated medical devices
    - Tracks equipment status throughout the donation lifecycle
    - Manages assignment to recipients

2. **Donor Verification Contract** (`donor-verification.clar`)
    - Validates legitimate sources of equipment
    - Manages verification authorities
    - Tracks donor verification status

3. **Recipient Matching Contract** (`recipient-matching.clar`)
    - Connects donations with appropriate facilities
    - Verifies recipient healthcare facilities
    - Manages equipment requests and delivery confirmations

4. **Impact Measurement Contract** (`impact-measurement.clar`)
    - Tracks usage and benefits of donated items
    - Records maintenance events
    - Collects impact reports from recipients

## Workflow

1. **Equipment Registration**
    - Donors register medical equipment with detailed information
    - Equipment starts in "registered" status

2. **Verification Process**
    - Authorized verifiers validate donor legitimacy
    - Equipment status updated to "verified" when approved

3. **Recipient Matching**
    - Healthcare facilities register their needs
    - Facilities are verified by authorized verifiers
    - Verified recipients can request verified equipment
    - Donors approve and assign equipment to recipients

4. **Delivery and Impact Tracking**
    - Recipients confirm receipt of equipment
    - Recipients initialize usage tracking
    - Ongoing updates on patients served, hours in use
    - Impact reports document real-world benefits

## Development

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Node.js](https://nodejs.org/) - For running tests

### Setup

1. Clone the repository
