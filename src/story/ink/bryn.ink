// Bryn, a travelling minstrel. A tour of ink features:
//   visit counts ({not greet: ...}), shuffles {~a|b}, tunnels (-> song ->),
//   switch blocks, nested choices (++), ink variables, game functions
//   (coins, add_coins, set_flag), and #who tags for a second speaker.

VAR songs_heard = 0
VAR paid_rumour = false

=== bryn ===
{ not greet: -> greet }
{~Back for more, friend?|Ah, my audience returns.|You again! Good. I hate an empty square.}
-> menu

= greet
A listener! Sit, sit.
* [Who are you?]
    ~ reveal("bryn")
    Bryn of Coldwater. Singer of songs, teller of lies. Mostly songs.
* [I am only passing through.]
    Everyone is. That is what roads are for.
- -> menu

= menu
+ [Sing me something.]
    -> song ->
    -> menu
+ { flag("veil_met") && not flag("clue_names") } [What do old names mean?]
    Names are songs, friend. I collect them.
    Edith means rich in war. Aelfgifu, gift of the elves.
    Wynflaed means joy and beauty. And Elswyth means strong as the elves.
    Why do you ask? No, do not tell me. I will make a song of it later.
    ~ set_flag("clue_names")
    -> menu
* [What news on the road?]
    Tolls are up. Wolves are down. The Earl's reeve is as fat as ever.
    -> menu
+ { not paid_rumour } [Do you know anything about the bell?]
    Ah. Knowing costs, friend. One coin.
    ++ { coins() >= 1 } [Pay one coin.]
        ~ add_coins(-1)
        ~ paid_rumour = true
        There is a song about Osric the ringer. Forty years, never once late. Until he was.
        When a man loses the one thing he was good at, he does strange things to keep hold of it.
        So where would he go? #who:you
        Where old things go to be forgotten. Up the north road, to the old keep.
        ~ set_flag("clue_keep")
        -> menu
    ++ [Not today.]
        Your loss. It is a very good rumour.
        -> menu
+ [Goodbye.]
    {~May your road be dry.|Fare well. Tell your friends about me.|Go on, then. I will practise on the ducks.}
    -> DONE

// A tunnel: it plays a song, then returns to wherever it was called from.
= song
~ songs_heard++
{ songs_heard:
- 1: This one is about a miller's daughter who married a river. It ends wet.
- 2: This one is about a goose that became a bishop. I will spare you the third verse.
- 3: This one is sad. It is about a bell that forgot its own voice.
- else: That is all three songs I know. Please do not tell anyone.
}
{ flag("osric_coming"): I hear the old ringer is coming down from the keep. That will make a fine fourth song. }
->->
