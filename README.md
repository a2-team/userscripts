# userscripts

This repo contains users scripts which helps to import inquries from AirBnb and FeWo to the admin interface.
The scripts injecting a button on the website of AirBnb/FeWo when the current page is a inquiry.
Clicking on it will you redirect to the admin interface and via HTTP GET parameters the form will be auto filled in.

Unfortunately this don't work sometimes because it rely on the DOM structure which is changed quite often.

## WILL BE REPLACED

These usescripts rely also on the user actions which can never automate the whole process.
These scripts should be replaced by a solution where emails are parsed directly form AirBnb and FeWo via (zapier email parser)[https://parser.zapier.com/]
