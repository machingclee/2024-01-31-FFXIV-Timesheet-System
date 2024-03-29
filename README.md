# How does it look?

A functioning page has been deployed here:

- https://ffxiv-timesheet.vercel.app/timesheet

Preview of the system:

![Alt text](timetable-3.png)

# What is the Usage

This is a timesheet system written for determinng timeslots that are available for all member in a static team (you can use it for arranging any kind of meetings).

# About Login

## Why Login?

- Only the person who create timesheet needs to login. This is because we want to associate the timetable created by you with your account so that you can manage it.

- Logined user can:

  - Create events (we define `event` a set of `timetable`'s in a row for 1 week)
  - Delete events

## Who don't need to Login?

For people just to fill the timetable, however, their record can be altered by any people. So please just share the timetable link to related members.

Any sharable link is like:

```
https://ffxiv-timesheet.vercel.app/timesheet/detail?weeklyId=9f084019-29b2-4ca9-ab4a-638713583cb0
```

The `weeklyId` information is usually non-guessable. Feel free to share it with your members.

## Way to Login

We use Google login.

The backend is held as a lambda function but since I have not purchased any domain, the login destination may seem weird:

<img src="login.png" width="400"/>

which is actually the endpoint created by AWS lambda service, **_not anything malicious_**.
