# Auto Click Dicoding Waiting list to event

Dicoding doesn't have the option to add a batch of people from the waiting list to the event. Imagine having 500 people on the waiting list and wanting to add them to the event list. It wouldn't make sense to click and add each person manually.

## Bonus

Dicoding also requires you to submit a request to obtain the email addresses of your event participants.
You can use this javascript to get the emails from the javascript console.

```js
// Select all TD elements with the specified class and data attribute
const emailElements = document.querySelectorAll('td.js-email-address[data-th="Email"]');

// Extract emails into an array
const emails = Array.from(emailElements).map(element => element.textContent);

// Now 'emails' contains all the email addresses
console.log(emails.join(","));
```
