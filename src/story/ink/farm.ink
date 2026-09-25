// Hollin Farm: Col (Tobin's son, sick in bed), his wife Hild, their
// daughter Ebba, and a goose. Hild or Col lets you take wood for the forge.
// Shows: game counters (count), conditional text, and reveal() when
// someone points a person out by name.

=== hild ===
{ not intro: -> intro }
-> menu

= intro
You look lost. This is Hollin farm.
{ flag("need_wood"): Did Tobin send you? He only sends people when he wants something. }
-> menu

= menu
+ { flag("need_wood") && not flag("wood_ok") } [Tobin needs wood for his forge.]
    ~ reveal("hild")
    The forge went cold? Of course it did. I am Hild, Col's wife.
    Col has been in bed four days. He always kept that fire fed.
    Take what you need from the pile by the house. One bundle at a time, or you will break your back.
    ~ set_flag("wood_ok")
    -> menu
+ { flag("wood_ok") && not flag("forge_lit") } [How much wood does Tobin need?]
    { count("wood_delivered"):
    - 0: Three bundles, you said. You have not carried one yet.
    - 1: You have carried one. Two more.
    - 2: One more, and the old man can sulk at his fire again.
    }
    -> menu
+ [Who lives here?]
    ~ reveal("col")
    ~ reveal("ebba")
    My husband Col. He is inside, in bed with a fever.
    And our girl Ebba, there, fighting the goose. She will lose.
    -> menu
+ [Goodbye.] -> DONE

=== col ===
{ not visit: -> visit }
{~Mm. Is it morning?|(He coughs.) Still here?|Tell Hild I am not dying. She worries.}
-> ask

= visit
Who is that? Not Hild. (He coughs.)
~ reveal("col")
I am Col. Tobin's boy. I keep his fire. Kept it.
- (ask)
+ { flag("need_wood") && not flag("wood_ok") } [Your father needs wood for the forge.]
    Take it. The pile by the door.
    Tell him I am sorry the fire went out.
    ~ set_flag("wood_ok")
    -> ask
+ { flag("forge_lit") && not flag("told_col") } [The forge is burning again.]
    ~ set_flag("told_col")
    Good. Good. He would sulk for a week otherwise.
    -> ask
+ [Rest now.] -> DONE

=== ebba ===
{ not hello: -> hello }
{~The goose bit me again.|Papa is still asleep.|Grandpa Tobin makes horseshoes. Did you know?|Are you carrying wood for Grandpa? You walk funny.}
-> DONE

= hello
Are you here for the goose? Nobody wants the goose.
~ reveal("ebba")
I am Ebba. Papa is sick, so I am in charge of the goose.
-> DONE

=== goose ===
{~HONK.|HONK!|The goose glares at you. #who:narrator|HONK. HONK.}
-> DONE
