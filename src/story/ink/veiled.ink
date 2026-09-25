// The veiled woman: a side quest to learn a name.
// She will not say it. Three people each know part of it:
//   Mara  (the river saw my mark)       -> clue_e      : her mark was an E
//   Aldric (the priest gave me my name) -> clue_elves  : a name "with the elves in it"
//   Bryn  (the singer knows meanings)   -> clue_names  : Edith, Aelfgifu, Wynflaed, Elswyth
// Only Elswyth starts with E and has the elves in it.
// Each time she slips away she moves on: village -> keep -> church.

=== veiled ===
{ flag("elswyth_named"): -> named }
{ met: -> again }
- (met)
~ set_flag("veil_met")
You look at me as if I owe you something.
- (ask)
+ [What is your name?]
    A name is a gift. I do not give it to strangers.
    But you may earn it.
    The river saw my mark. The priest gave me my name. The singer knows what names mean.
    -> ask
+ { flag("clue_names") } [I think I know your name.]
    Then say it.
    ++ [Edith.] -> wrong
    ++ [Aelfgifu.] -> wrong
    ++ [Wynflaed.] -> wrong
    ++ [Elswyth.] -> right
    ++ [I am not sure yet.] -> slip
+ [Goodbye.] -> slip

= again
{~You again.|You are persistent.|Still following me?}
-> veiled.ask

= wrong
No. That is not my name.
-> slip

= slip
{ flag("veil_2"):
    She turns her face to the wall. #who:narrator
- else:
    She pulls her veil close and walks away. #who:narrator
    { flag("veil_1"):
        ~ set_flag("veil_2")
    - else:
        ~ set_flag("veil_1")
    }
}
-> DONE

= right
...
~ reveal("elswyth")
~ set_flag("elswyth_named")
Elswyth. No one has said it aloud in twenty years.
My father rang the bell of this village. I left when I was young, and I did not come back.
When I heard the bell had gone quiet, I knew something was wrong with him.
~ reveal("osric")
~ set_flag("clue_keep")
His name is Osric. He hides in the old keep when he is angry. He always did.
Be gentle with him. He has only ever had the bell.
-> DONE

= named
{ flag("osric_coming"):
    My father is coming down. I heard. Thank you.
- else:
    Go gently, pilgrim.
}
-> DONE
