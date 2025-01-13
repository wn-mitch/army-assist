import json
import re

# Define the phases and their corresponding text patterns
phase_patterns = {
    "Command": ["start of the battle round", "in your Command phase", "must be your Warlord", "At the end of your Command phase","If a model from your army with the Leader ability can be attached","At the start of your Command phase","each time you take a Battle-shock test","Stratagem","selected as your Warlord","Objective Control","Declare Battle Formations step","army cannot contain","attached to this unit instead","cannot be your Warlord","that unit takes a Battle-shock or Leadership test","include any ETHEREAL units","synapse","at the end of any phase","be attached to this unit","Battle-shock step","Battle-shock step","This OFFICER can issue","Leadership tests", "Officer","different Orders","At the start of the battle","each player’s Command phase","at the end of your opponent’s turn","use a Fate dice","Battle-shock or Leadership test","given Enhancements","Leadership characteristic","attach up to two Leader units","issues an Order","at the start of any phase","at the start of any Command phase","must select one of the keywords below","re-roll Leadership and Battle-shock","TRANSPORT keyword","Reanimation Protocols","start of the first battle round","pain token","cabal point","Battle-shock test is taken for that unit","Infiltrators","Scouts",'you select this model to include in your army',"Blessings of Khorne","Chapter, a successor","Miracle dice","re-roll Battle-shock tests","Shadow of Chaos","takes a Battle-shock test","is your Warlord","include this FORTIFICATION in your army","this FORTIFICATION is set up","model in this unit is destroyed, any remaining","opponent gains a CP as the result of an ability","At the end of each phase","this model’s unit fails a Battle-shock test","When this model is set up","Acts of Faith", "Act of Faith","FORTIFICATION must be set up","you can include","first set up on the battlefield","that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it","has the PSYKER keyword","You must attach","this unit contains no","Shadow in the Warp","either player’s Command phase","your Army Faction is not AGENTS OF THE IMPERIUM"],
    
    "Movement": ["Move characteristic", "at the end of your Movement phase", "At the start of your Movement phase", "after this unit ends a Normal move", "in your Movement phase","unit arrives from Strategic Reserves","this unit ends a Normal move","when an enemy unit ends a Normal, Advance or Fall Back move","unit is eligible to charge in a turn in which it Advanced","redeploy","reserves","Normal move","in which it Advanced","Advance and Charge rolls","that unit is selected to Fall Back","can be set up or end any type of move","Deep Strike","Enemy units cannot start or end an Advance move","this unit or an enemy unit ends a move","this model is selected to Advance","set up in the Reinforcements step","at the end of any phase","disembark","embark","is selected to Fall Back","Remained Stationary","use a Fate dice","re-roll Advance rolls","at the start of any phase","Normal or Advance move","TRANSPORT keyword","Eviscerating Fly-by","pain token","cabal point","Normal, Advance or Fall Back move","Miracle dice","opponent gains a CP as the result of an ability","At the end of each phase", "Act of Faith","Acts of Faith","re-roll Charge and Advance rolls","that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it","this unit contains no","Thievin’ Scavengers"],
    
    "Shooting": ["eadbanger", "each time a model in that unit makes a ranged attack", "from the Toughness characteristic of models in that unit", "Each time a model in this unit makes a ranged attack", "unit is selected to shoot in your Shooting phase","ranged weapons equipped by models in this unit","snazzgun","shoot","fire overwatch","weapons equipped by models in that unit","this model has shot","Grenades","makes an attack that targets","this model destroys an enemy unit","ranged weapon","ranged attack made","ranged attacks","model in that unit makes an attack","ranged attack","improve the Ballistic Skill and Weapon Skill","attack has been allocated to this model","Greater Good ability","this unit makes an attack","MARKERLIGHT","cannon","at the end of any phase","destroys an enemy","making a Hit roll for a model in this unit","Heavy weapons equipped by models","Praetor launcher","bearer’s unit has shot","model is destroyed","use a Fate dice","missile launcher","to the Range characteristic","at the start of any phase","attack with a Psychic weapon","exitus rifle","select a PSYKER unit as the target","bearer’s unit makes an attack","purifying flame","Dark Pact","FIRE PRISM","pain token","cabal point","weapon targets a unit more than","storm eagle rockets","Miracle dice","contagion range","model in that unit makes a Psychic Attack","when an attack is allocated to the bearer","makes an attack with a Blast weapon","shokk attack gun","your army with this ability has shot","opponent gains a CP as the result of an ability","At the end of each phase", "Act of Faith", "Acts of Faith","is more than 24\" from the bearer","this model makes an attack","that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it","this unit contains no","to the Attacks characteristic of weapons","bearer has shot with this weapon"],
    
    "Charge": ["re-roll Charge rolls", "unit is eligible to declare a charge","eligible to declare a charge this turn","this unit ends a Charge move","this model ends a Charge move","unit is eligible to charge in a turn in which it Advanced","declare a charge","Advance and Charge rolls","Charge move","at the end of any phase","Charge rolls made for the bearer","use a Fate dice","at the start of any phase","pain token","cabal point","Miracle dice","opponent gains a CP as the result of an ability","At the end of each phase","each time a Charge roll","Acts of Faith", "Act of Faith","re-roll Charge and Advance rolls","that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it","re-roll the Charge roll","start of your Charge phase","this unit contains no","to Charge rolls made"],
    
    "Fight": ["each time a model in that unit makes a melee attack", "to the Attacks characteristic of this model’s melee weapons", "choppa", "melee weapons equipped by models in that unit", "from the Toughness characteristic of models in that unit", "urty syringe","unit Consolidates","At the start of the Fight phase","Each time this model makes a melee attack","dread klaw","Each time this model is selected to fight","heroic intervention","dread killsaws","weapons equipped by models in that unit","this unit is selected to fight","makes an attack that targets","unit is selected to fight","this model destroys an enemy unit","model in that unit makes an attack","model fights","crushing teeth and claws","improve the Ballistic Skill and Weapon Skill","attack has been allocated to this model","this unit makes an attack","synapse","at the end of any phase","melee weapons", "melee attack", "melee attacks", "melee weapon","destroys an enemy","Fights First","making a Hit roll for a model in this unit","power axe", "model is destroyed","use a Fate dice","at the start of any phase","attack with a Psychic weapon","enemy unit finishes making its attacks","select a PSYKER unit as the target","bearer’s unit makes an attack","end of the Fight phase","Dark Pact","pain token","cabal point","Miracle dice","contagion range","model in that unit makes a Psychic Attack","when an attack is allocated to the bearer","helbrute fists","hellforged weapons","In the Fight phase","las-talon","opponent gains a CP as the result of an ability","At the end of each phase","Once per Fight phase","Acts of Faith","Weapon Skill characteristic","this model makes an attack","that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it","this unit contains no","to the Attacks characteristic of weapons"],
    
    "Saves": ["attack targets this model", "fire overwatch", "attack is allocated to this model", "Feel No Pain", "models in that unit have the Benefit of Cover", "each time an attack targets this unit","invulnerable save","bearer’s Toughness", "bearer has a Wounds characteristic","Bodyguard unit is destroyed","Lone Operative","models in that unit have the Stealth","destroyed by a melee attack","make a saving throw","each time an attack targets that unit","attack targets this unit","bearer has the SMOKE","declares a charge against the bearer’s unit","Enemy units cannot start or end an Advance move","this unit or an enemy unit ends a move","has a Save characteristic","bearer has the Stealth","you can ignore any or all modifiers to the characteristics of models in that unit and to any roll or test made for models in that unit","at the end of any phase","as the target of a charge","SMOKE keyword","bearer’s Wounds characteristic","its Toughness characteristic","use a Fate dice","attack is allocated to a model in that unit","attack is allocated to a model in this unit","Wounds characteristic","saving throw is failed for this model","at the start of any phase","Deadly Demise ability", "crew token","enemy unit finishes making its attacks","enemy unit fails a Battle-shock test","cult ambush","Dark Pact","pain token","cabal point","attack is allocated to this FORTIFICATION","Toughness characteristic","Enemy units that are set up on the battlefield as Reinforcements","Miracle dice","model in that unit makes a Psychic Attack","against this PSYKER","Foul spores","FORTIFICATION suffers a mortal wound","model in this unit is destroyed, any remaining","each time an attack is allocated to that model","opponent gains a CP as the result of an ability","select this model as the target of an attack","At the end of each phase","has the Benefits of Cover","models from this unit were destroyed","in this unit is destroyed","enemy unit must take a Desperate Escape test","to any armour saving throw made against that attack","a saving throw is failed for the bearer’s unit","Acts of Faith","Act of Faith","attack is made against this unit","that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it","model has the Benefit of Cover","this unit contains no","kustom force field"],
}

# Define a mapping of datasheet_ids to phases
datasheet_phase_mapping = {
    "Movement": ["000000025","000000508","000001476"],
    "Shooting": ["000000508","000001484","000000941","000000855","000000038","000002202","000001476","000001041","000002471","000002500","000001464","000002519","000002593","000003838","000002725"],
    "Charge": ["000000508","000001476"],
    "Fight": ["000000308","000000508","000000306","000000941","000000855","000002202","000001476","000001479","000001041","000002471","000002500","000001464","000002519","000002593","000003838","000002725"],
    "Command": ["000000508","000001476"],
    "Saves": ["000000508","000000941","000000855","000002544","000001476"],
}


def determine_phases(description, datasheet_id):
    phases = []
    for phase, patterns in phase_patterns.items():
        for pattern in patterns:
            if re.search(pattern, description, re.IGNORECASE):
                phases.append(phase)
                break
    for phase, ids in datasheet_phase_mapping.items():
        if datasheet_id in ids:
            if phase not in phases:
                phases.append(phase)
    return phases

# <[\w]+[\w=\\"\-\d\s#/\.]*>([\w\d\s\+\\[\],:\.\-]+)</[\w]+>
# Tag extraction regex

def process_abilities(input_file, output_file):
    with open(input_file, 'r') as infile:
        abilities = json.load(infile)

    for ability in abilities:
        description = ability.get("description", "")
        datasheet_id = ability.get("datasheet_id", "")
        ability["description"] = description
        ability["phases"] = determine_phases(description, datasheet_id)

    with open(output_file, 'w') as outfile:
        json.dump(abilities, outfile, indent=4)


if __name__ == "__main__":
    input_file = './src/assets/json/Datasheets_abilities.json'  # Corrected file path
    output_file = './src/assets/json/Abilities_modified.json'  # Corrected file path
    process_abilities(input_file, output_file)
