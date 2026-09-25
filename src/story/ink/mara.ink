// Mara the fisher. Being rude closes her off until you apologise.
// Her mood is an ink variable; what she saw is a game flag, so the
// quest log and other characters can see it.

VAR mara_cold = false

=== mara ===
{ mara_cold: -> cold }
{ intro: -> again }
- (intro) Mind your feet. The dock is slick.
* [Good catch today?]
    Poor. The fish do not like the silence either.
    ~ reveal("mara")
    I am Mara. I fish, when the fish allow it.
    -> saw
* [Out of my way, fishwife.]
    ~ mara_cold = true
    Charming. Then I have nothing to say to you.
    -> DONE

= saw
Three nights ago I was mending nets late.
A hooded man went up the north road. He carried something heavy on his back.
Like a sack of stones. Or iron.
~ set_flag("clue_keep")
+ [Where did he go?]
    North, past the church. Toward the old keep. No one goes there now.
    -> DONE
+ [Thank you{flag("known_mara"):, Mara}.]
    -> DONE

= cold
...
+ [I am sorry. I was rude.]
    ~ mara_cold = false
    ~ reveal("mara")
    Hm. Most folk never say sorry. I am Mara. Ask, then.
    -> again.ask
+ [(Leave.)]
    -> DONE

= again
{Back again?|You again.|Still here, pilgrim?}
- (ask)
+ [What did you see that night?] -> saw
+ { flag("veil_met") && not flag("clue_e") } [Have you seen a woman in a grey veil?]
    Once. She bought an eel and paid in old coin.
    Then she cut a mark into my dock post with her knife. Like she was saying goodbye to it.
    An E, I think. My letters are poor.
    ~ set_flag("clue_e")
    -> ask
+ [Why is the dock so slick?]
    Fish guts and river water. The two things Ashford has plenty of.
    -> ask
+ [Goodbye.] -> DONE
