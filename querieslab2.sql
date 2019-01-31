Lab 2

-- Insert new user 9
insert into person values
  (9, 'Name Deleteson', 't', 2, 'Company Inc.', 'Lieutenant');

-- Delete old user 9
delete from person
  where "ID"=9;

-- Insert team 9
insert into team values
  (9, 'Placeholders', 0, true);

-- Delete team 9
update team
  set active = false
  where "ID"=9;

-- Hard delete team 9
delete from team
  where "ID"=9;

-- Check for available rooms for 9:00 - 10:00
-- find booked rooms
with booked (id)
as
(
    select room
    from booking
    where start <= 900 and booking.end >= 1000
)
select "ID", "Capacity", "Location", "Hourly_price"
from room, booked
where not room."ID" = booked.id
order by "Capacity" asc;


PATH=%PATH%;C:\Program Files\PostgreSQL\10\bin



C:\Users\John\node-js-getting-started>npm install --save express ejs pg knex body-parser method-override morgan locus
npm WARN deprecated parse-stack@0.1.4: Use error-stack-parser instead.

> deasync@0.1.12 install C:\Users\John\node-js-getting-started\node_modules\deasync
> node ./build.js

`win32-x64-node-8` exists; testing
Binary is fine; exiting

> locus@2.0.1 postinstall C:\Users\John\node-js-getting-started\node_modules\locus
> mkdir ./histories

The syntax of the command is incorrect.
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! locus@2.0.1 postinstall: `mkdir ./histories`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the locus@2.0.1 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\John\AppData\Roaming\npm-cache\_logs\2018-04-24T12_45_23_869Z-debug.log
