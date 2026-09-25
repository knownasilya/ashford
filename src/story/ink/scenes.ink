// Ink for cutscenes. A cutscene step { ink: 'keep_enter' } runs a knot.

=== keep_enter ===
Cold stones, and old ones.
Part of the wall has fallen across the gate. The dust is still settling.
-> DONE

// The fallen gate. Osric talks through the stones, but will not give his name.
=== rubble ===
{ flag("help_tobin") && flag("help_hal"):
    You hear a groan behind the stones. Help is on the way. #who:narrator
    -> DONE
}
The wall has fallen across the gate. The stones are too heavy to move alone. #who:narrator
{ not heard: -> heard }
{~Still there? Did you find help?|Is anyone coming?|Hurry. My leg...} #who:osric
-> DONE

= heard
Hello? Is someone out there? #who:osric
The wall came down in the night. I cannot move the stones, and my leg is caught. #who:osric
* [Who are you?]
    Does it matter? Get me out first. #who:osric
* [Hold on. I will get help.]
    Bless you. #who:osric
- ~ set_flag("heard_voice")
Find someone strong. Two, if you can. #who:osric
-> DONE
