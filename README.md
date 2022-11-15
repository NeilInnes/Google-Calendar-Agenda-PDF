#  Installation
  
1. Go to https://drive.google.com/ and create a new Google App Script:
<img src="https://user-images.githubusercontent.com/4203000/201925758-abeb187c-8991-4187-8098-68b2e1b5c37d.png" width="400">

2. Edit the name of the Project, call it 'Calendar Agenda PDF':
<img src="https://user-images.githubusercontent.com/4203000/201926884-846bdf11-cedf-45bf-8032-e8288996aaae.png" width="400">

3. Paste in the code from the `script.txt` file in this repository

4. Create a new folder called `Calendar Agenda` in https://drive.google.com/ 

5. Get the ID of this folder, this is the part after https://drive.google.com/drive/folders/ in the URL when you click into it

6. Replace `---YOUR-GOOGLE-DRIVE-FOLDER-ID---` with the ID of your Google Drive folder

7. Ensure you have `Drive API` and `Google Calendar` added under the Services menu. If not, click the `+` button and add them:
<img src="https://user-images.githubusercontent.com/4203000/201925973-08181afb-4b20-41d6-ac0a-04c3633a4419.png" width="400">

8. Test run the script. Click the save icon , ensure `CalendarToPDF` is in the function list and click `Run`:
<img src="https://user-images.githubusercontent.com/4203000/201926013-597c2887-be77-4d71-b0b0-ce59ca89205c.png" width="400">

9. Make sure it creates the `Calendar.pdf` file in your `Calendar Agenda` folder correctly

10. Schedule it to run automatically - click the clock icon to go to `Triggers` and add a new trigger as follows:
<img src="https://user-images.githubusercontent.com/4203000/201926073-67bb20fd-0e4c-4998-9dbc-31f0f8912e7c.png" width="400">
