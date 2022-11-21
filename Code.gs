//Change this to true to always start on a Monday (default is Today)
const start_on_monday = false;
//Change this to the number of days you wish to display on your schedule
const number_of_days = 7;
//Change this folder to a new folder you create just for this one PDF
const folder = '---YOUR-GOOGLE-DRIVE-FOLDER-ID---';
//Change this to change the name of the generated file
const filename = 'Calendar.pdf'
//Do not change this
const last_updated_key = 'LAST_UPDATE';

function CalendarToPDF()
{
  this.start_time = new Date();
  this.last_updated = 0;
  this.userProps = PropertiesService.getUserProperties();
  last_updated_raw = this.userProps.getProperty(last_updated_key);
  if (last_updated_raw != null) {
    this.last_updated = new Date().setTime(last_updated_raw);
  }
  console.log('Last Updated: '+this.last_updated);

  //Start from today
  this.start_day = new Date();
  if (start_on_monday) {
    //Start from Monday
    this.start_day = getPreviousMonday(this.start_day);
  }
  
  if (getEvents() && checkUpdateRequired()) {
    console.log('Updating schedule');
    var pdf = Utilities.newBlob(getScheduleContent(), MimeType.HTML, filename).getAs("application/pdf");
    saveUpdateFile(pdf);

    this.userProps.setProperty(last_updated_key, this.start_time.getTime().toFixed()); 
  }
}

function getEvents()
{
  this.events = [];

  for (x = 0; x < number_of_days; x++) {
    var this_day = new Date(this.start_day.getTime()+(x*(24*3600*1000)));
    this.events[Utilities.formatDate(this_day,'Europe/London', 'E dd MMM yyyy')] = CalendarApp.getDefaultCalendar().getEventsForDay(this_day);
  }

  return true;
}

function checkUpdateRequired()
{
  var updated_needed = false;
  for (var this_day in this.events) {
    for(e = 0; e < this.events[this_day].length; e++) {
      var event_last_updated = this.events[this_day][e].getLastUpdated();
      if (event_last_updated > this.last_updated) {
        console.log('Event Last Updated: '+event_last_updated);
        updated_needed = true;
      }
    }
  }

  return updated_needed;
}

function getScheduleContent()
{
  var content = getHeader();
  for (var this_day in this.events) {
    content += '<div class="date-top"><span>'+this_day+'</span>';

    for (e = 0; e < this.events[this_day].length; e++) {
      content += getEventContent(this.events[this_day][e]);
    }

    content += '</div>';
  }

  content += getFooter();

  return content;
}

function getEventContent(event)
{
  var content = '';

  var owner = false;
  if (event.getMyStatus() == CalendarApp.GuestStatus.NO) {
      var status = 'No';
  } else if (event.getMyStatus() == CalendarApp.GuestStatus.YES) {
      var status = 'Yes';
  } else if (event.getMyStatus() == CalendarApp.GuestStatus.MAYBE) {
      var status = 'Maybe';
  } else if (event.getMyStatus() == CalendarApp.GuestStatus.INVITED) {
      var status = 'Invited';
  } else if (event.getMyStatus() == CalendarApp.GuestStatus.OWNER) {
      var status = 'Yes';
      var owner = true;
  }
  if (status != 'No') {
    content += '<div class="event">';
    var time = Utilities.formatDate(event.getStartTime(),'Europe/London', 'HH:mm')+' - '+Utilities.formatDate(event.getEndTime(),'Europe/London', 'HH:mm');
    var title = event.getTitle();
    var organizer = event.getOriginalCalendarId();
    var location = event.getLocation();
    var description = event.getDescription().replace(/\s/,' ').replace('&nbsp;',' ');
    var hangout_link = '';

    if (event.getId().match(/@/)) {
      var event_id = event.getId().split("@")[0]
    } else {
      var event_id = event.getId();
    }
    try {
      var full_event = Calendar.Events.get("primary", event_id);
      if (full_event != null) {
        var hangout_link = full_event.hangoutLink;
      }
    } catch(err) {
      //skip event that doesn't belong to this user
    }

    content += '<p class="event-header"><span class="event-date">'+time+'</span><span class="event-title">'+title+'</span></p>';
    content += '<div class="event-detail">';
    if (!owner) {
      content += '<p><strong>Organizer:</strong> '+organizer+'</p>';
    }
    if (location != '') {
      content += '<p><strong>Location:</strong> '+location+'</p>';
    }
    if (typeof hangout_link != 'undefined') {
      content += '<p><strong>Meet:</strong> <a href="'+hangout_link+'">'+hangout_link+'</a></p>';
    }
    content += '<p><strong>Going?</strong> '+status+'</p>';
    if (description != '') {
      content += '<p><strong>Description:</strong> '+description+'</p>';
    }
    content += '</div>';
    content += '</div>';
  }

  return content;
}

function getPreviousMonday(date){
  var d = Number(Utilities.formatDate(date, 'Europe/London', "u"));
  if(d == 1) {
    return date;
  } else {
    // subtract by d-1 days
    return new Date(date.getTime()-(d-1)*(24*3600*1000));
  }
}

function getFolder()
{
  return DriveApp.getFolderById(folder);
}

function getHeader()
{
  return ''
+'<html>'
+'<head>'
+'<style type="text/css">'
+'body {'
+'    font-family: Arial,sans-serif;'
+'    margin-top: 1em;'
+'    margin-bottom: 1em;'
+'    margin-left: 1em;'
+'    margin-right: 1em;'
+'}'
+'#calendarTitle {'
+'    font-size: 1.25em;'
+'    font-weight: bolder;'
+'    padding-left: 0.1em;'
+'}'
+'.date-top {'
+'    font-size: 1.0em;'
+'    margin-top: 0px;'
+'    margin-bottom: 0px;'
+'    margin-left: 0px;'
+'    margin-right: 0px;'
+'    margin-top: 1em;'
+'    padding-left: 1em;'
+'    padding-right: 1em;'
+'}'
+'.date-top span {'
+'    font-weight: bold;'
+'}'
+'.event-header {'
+'    font-weight: bold;'
+'    margin-top: 1em;'
+'    margin-bottom: 0.25em;'
+'    margin-left: 0px;'
+'    margin-right: 0px;'
+'}'
+'.event-date {'
+'}'
+'.event-title {'
+'	  padding-left: 1em;'
+'}'
+'.event {'
+'    font-size: 0.9em;'
+'    margin-top: 0px;'
+'    margin-bottom: 0px;'
+'    margin-left: 0px;'
+'    margin-right: 0px;'
+'    padding-top: 0em;'
+'    padding-left: 5em;'
+'    padding-right: 1em;'
+'    padding-bottom: 0em;'
+'    page-break-inside: avoid;'
+'}'
+'.event-detail {'
+'    margin-top: 0px;'
+'    margin-bottom: 0px;'
+'    margin-left: 2em;'
+'    margin-right: 0px;'
+'  	border-left: 1px solid #ccc;'
+'  	padding-left: 1em;'
+'    font-size: 0.9em;'
+'}'
+'.event-detail p {'
+'    margin-top: 0px;'
+'    margin-bottom: 0px;'
+'    margin-left: 0px;'
+'    margin-right: 0px;'
+'    padding-top: 0.25em;'
+'    padding-bottom: 0.25em;'
+'    overflow: wrap;'
+'}'
+'</style>'
+'</head>'
+'<body>'
+'<p id="calendarTitle">Calendar for '+CalendarApp.getDefaultCalendar().getName()+'</p>';
}

function getFooter()
{
  return ''
 +'</body>'
 +'</html>';
}

function saveUpdateFile(pdf)
{
    var folder = getFolder();
    var existing_files = folder.getFilesByName(filename);
    if (existing_files.hasNext()) {
      while (existing_files.hasNext()) {
        var existing_file = existing_files.next();
        Drive.Files.update(
          {
            title: existing_file.getName(),
            mimeType: existing_file.getMimeType()
          },
          existing_file.getId(),
          pdf
        );
      }
    } else {
      var new_file = folder.createFile(pdf);
      drive_id = new_file.getId();
    }
}

// emulate python's pop
const dictPop = (obj, key, def) => {
  if (key in obj) {
    let val = obj[key];
    delete obj[key];
    return val;
  } else if (def !== undefined) {
    return def;
  } else {
    throw `key ${key} not in dictionary`
  }
}

function reset()
{
  this.userProps = PropertiesService.getUserProperties();
  last_updated_raw = this.userProps.deleteProperty(last_updated_key);
}
