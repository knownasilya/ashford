// Wren, the girl who rings the bell now.
// Shows: once-only (*) vs sticky (+) choices, choice conditions that read
// game flags, and a sequence {a|b|c} that changes each time.

=== wren ===
{ intro: -> menu }
- (intro) Hello! Are you a knight?
* [Just a pilgrim.]
    Oh. That is fine too, I suppose.
* [Yes. A very brave one.]
    I knew it! Your stick is a sword in disguise.
- ~ reveal("wren")
I am Wren. I ring the church bell. Well. I did.
-> menu

= menu
Do you want something?
+ { flag("heard_reason") && not flag("wren_afraid") } [Brother Aldric says you ring the bell now.]
    I did. Three times.
    The rope pulls you right off the floor! I was scared.
    Old Osric used to hold the rope with me. He said the bell has a voice, and you must listen to it.
    I wish he still came to the tower.
    ~ set_flag("wren_afraid")
    -> menu
+ [Have you seen anything strange?]
    {There is a light in the old keep at night. Mother says it is ghosts.|I told you. Ghosts. In the keep.|Mother says I must stop talking about ghosts.}
    ~ set_flag("clue_keep")
    -> menu
+ [Goodbye.] -> DONE
