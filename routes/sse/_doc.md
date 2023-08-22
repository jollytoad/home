This is a demonstration of controlling streams of content via [SSE] (Server Sent
Events) using [htmx].

[SSE]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
[htmx]: https://htmx.org/extensions/server-sent-events

There are two important elements, a _control_ and an _output_.

When you hit the **Start** button, a GET request is made to swap in a new
_control_ element which provides the htmx attributes to kick off the SSE
request, targetting the _output_ element.

The SSE feed returns a number of rendered items, which are appended to the
_output_, and finishes with an out-of-band swap of the _control_ element which
terminates the SSE feed.

The **Stop** button will also make a request to swap the _control_ element,
manually terminating the feed.

Refresh the page to start again.

Open the browser console to see the swapping in action, and/or take a look at
the source code (link at bottom of page) to see the gritty details.
