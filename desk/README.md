# Engram's Gall Agent

This readme is to act as a general reference for the Gall Agent built for the Engram app.  As Hoon is quite an exciting language to both code, as well as read, we figured it would be helpful to lay out how we structured our system, as well as the reasons behind certain decisions we made.  This should allow any new individuals who begin the treacherous journey into our Gall Agent to grasp a strong understanding of the different sections of code.

## Data Types

As the different data types make up the underlying foundation for which this app is built off of, it makes sense to outline those first.

The first types are those that are utilized in many places of the code, however are not directly referenced by the Gall State.  These are:

- id:  `@` - This is the general identifier for both folder and documents.  We do not explicitly declare the type of the id as we wanted to have more freedom from the frontend to decide that, however this can be narrowed down later
- athr:  `@p` - This is the ship that authored an update.  The `@p` aura is used in several other places, however those are just referenced by the aura directly rather than using our defined type
- dcont:  `(list @ud)` - This is the main storage for our document.  The reason that we store it as a list of unsigned integers is due to our use of the Y.js library.  To handle multiple editors, we decided to utilize one of the already existing and robust javascript libraries, rather than going out and building our own in hoon.  As Y.js stores its data in a very particular format, the best method of storage was through their encoded document state, ending up as a javascript Uint8Array, which we then converted to a simple list of unsigned integers.
- updt: `[author=athr cont=dcont time=@da]` - This is the main storage for how we propagate out changes to each of the editors on the document.  The first data point is the author of the update.  The next value is the document content.  This is of the type displayed above, as both the document state as well as the changes between different document states can be encoded in the same way.  The final value is the time the update was propagated out, based on the origin agent's clock.
- 
