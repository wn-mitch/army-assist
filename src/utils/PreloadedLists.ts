import Phase from "@/types/Phase";
import StoredList from "@/types/StoredList";
import { v4 } from "uuid";

const InvalidText = `Invalid - Invalid - Invalid

# ++ Army Roster ++ [1475 pts]
## Configuration
Battle Size: Incursion (1000 Point limit)
Detachment Choice: Invalid
Show/Hide Options

## Character [390 pts]
Chaos Lord [90 pts]: Mark of Slaanesh, Daemon hammer, Plasma pistol
`;

const Invalid2Text = `Chaos - Chaos Space Marines - The Obscenity vs Jack - [1475 pts]

# ++ Army Roster ++ [1475 pts]
## Configuration
Battle Size: Incursion (1000 Point limit)
Detachment Choice: Pact-bound Zealots
Show/Hide Options

## Character [390 pts]
Not a real unit!`;

const CSMText = `Chaos - Chaos Space Marines - The Obscenity vs Jack - [1475 pts]

# ++ Army Roster ++ [1475 pts]
## Configuration
Battle Size: Incursion (1000 Point limit)
Detachment Choice: Pact-bound Zealots
Show/Hide Options

## Character [390 pts]
Chaos Lord [90 pts]: Mark of Slaanesh, Daemon hammer, Plasma pistol
Dark Apostle [90 pts]: Accursed crozius, Bolt pistol, Warlord, Intoxicating Elixir, Mark of Slaanesh
• 2x Dark Disciple: Close combat weapon
Master of Executions [80 pts]: Axe of dismemberment, Bolt pistol, Mark of Slaanesh
Sorcerer [60 pts]: Bolt pistol, Force weapon, Infernal Gaze, Mark of Tzeentch
Warpsmith [70 pts]: Flamer tendril, Forge weapon, Melta tendril, Plasma pistol, Mark of Slaanesh

## Battleline [340 pts]
Legionaries [170 pts]: Mark of Slaanesh
• 1x Aspiring Champion: Close combat weapon, Heavy melee weapon, Plasma pistol, Chaos icon
• 6x Legionary w/ chainsword: Astartes chainsword, Bolt pistol, Close combat weapon
• 1x Legionary w/ heavy melee weapon: Bolt pistol, Close combat weapon, Heavy melee weapon
• 1x Legionary w/ other weapon: Bolt pistol, Close combat weapon, Meltagun
• 1x Legionary w/ other weapon: Bolt pistol, Close combat weapon, Plasma pistol and Astartes chainsword (Astartes chainsword, Plasma pistol)
Legionaries [170 pts]: Mark of Tzeentch
• 1x Aspiring Champion: Close combat weapon, Heavy melee weapon, Boltgun, Chaos icon
• 1x Legionary w/ balefire tome: Balefire tome, Bolt pistol, Close combat weapon
• 5x Legionary w/ boltgun: Bolt pistol, Boltgun, Close combat weapon
• 1x Legionary w/ heavy melee weapon: Bolt pistol, Close combat weapon, Heavy melee weapon
• 1x Legionary w/ other weapon: Bolt pistol, Close combat weapon, Lascannon
• 1x Legionary w/ other weapon: Bolt pistol, Close combat weapon, Heavy bolter

## Infantry [410 pts]
Chosen [250 pts]: Mark of Slaanesh
• 2x Chosen w/ boltgun and plasma pistol: Accursed weapon, Boltgun, Plasma pistol
• 4x Chosen w/ combi-weapon and bolt pistol: Accursed weapon, Bolt pistol, Combi-weapon
• 2x Chosen w/ paired accursed weapons and bolt pistol: Bolt pistol, Paired accursed weapons
• 1x Chosen w/ power fist and plasma pistol: Boltgun, Plasma pistol, Power fist
• 1x Chosen w/ power fist and plasma pistol: Boltgun, Plasma pistol, Power fist, Chaos icon
Obliterators [160 pts]: Mark of Tzeentch
• 2x Obliterator: Crushing fists, Fleshmetal guns

## Vehicle [260 pts]
Chaos Predator Annihilator [130 pts]: Armoured tracks, Havoc launcher, Predator twin lascannon, Mark of Nurgle, Combi-weapon, 2 lascannons (2x Lascannon)
Maulerfiend [130 pts]: Maulerfiend fists, Lasher tendrils, Mark of Slaanesh

## Dedicated Transport [75 pts]
`;

const TauText = `Xenos - T'au Empire - Base Tau - [2000pts]

# ++ Army Roster ++ [2000pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Auxiliary Cadre
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Epic Hero [95pts]
Commander Farsight [95pts]: Dawn Blade, High-intensity plasma rifle, Warlord

## Character [310pts]
Cadre Fireblade [50pts]: Close combat weapon, Fireblade pulse rifle
Commander in Coldstar Battlesuit [120pts]: Transponder Lock Module, Battlesuit fists, Cyclic ion blaster, Plasma rifle, Shield generator, Weapon support system, 2x Shield Drone
Kroot Lone-spear [90pts]: Close combat weapon, Kalamandra's bite, Kroot long gun
Kroot War Shaper [50pts]: Kroot pistol, Shaper's blade, Dart-bow and tri-blade

## Battleline [75pts]
Strike Team [75pts]:
• 1x Fire Warrior Shas'ui: Close combat weapon, Pulse pistol, Pulse rifle, Support turret, Guardian Drone, Shield Drone
• 9x Fire Warrior w/ pulse rifle: Close combat weapon, Pulse pistol, Pulse rifle

## Infantry [340pts]
Kroot Carnivores [65pts]:
• 1x Long-quill: Close combat weapon, Kroot pistol, Kroot rifle
• 9x Kroot Carnivores: Close combat weapon, Kroot rifle
Kroot Farstalkers [85pts]:
• 1x Kroot Kill-broker: Kroot pistol, Ritual blade, T'au tech rifle
• 7x Kroot Farstalker: Close combat weapon, Farstalker firearm, Kroot pistol
• 1x Kroot Farstalker w/ Farstalker firearm and Pech'ra: Close combat weapon, Farstalker firearm, Kroot pistol
• 1x Kroot Farstalker w/ Londaxi tribalest: Close combat weapon, Kroot pistol, Londaxi tribalest
• 2x Kroot Hounds: Ripping fangs
Stealth Battlesuits [60pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Burst cannon
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon
Vespid Stingwings [65pts]:
• 1x Vespid Strain Leader: Neutron blaster, Stingwing claws
• 4x Vespid Stingwings w/ Neutron Blaster: Neutron blaster, Stingwing claws
Vespid Stingwings [65pts]:
• 1x Vespid Strain Leader: Neutron blaster, Stingwing claws
• 4x Vespid Stingwings w/ Neutron Blaster: Neutron blaster, Stingwing claws

## Mounted [285pts]
Krootox Rampagers [190pts]:
• 6x Krootox Rampagers: Hunting blades, Kroot pistol and hunting javelins, Rampager fists
Krootox Rampagers [95pts]:
• 3x Krootox Rampagers: Hunting blades, Kroot pistol and hunting javelins, Rampager fists

## Beast [40pts]
Kroot Hounds [40pts]:
• 5x Kroot Hounds: Ripping fangs

## Vehicle [855pts]
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Crisis Fireknife Battlesuits [130pts]:
• 1x Crisis Fireknife Shas’vre: Battlesuit fists, Missile pod, Plasma rifle, Gun Drone (Twin pulse carbine), Shield Drone
• 2x Crisis Fireknife Shas’ui: Battlesuit fists, Missile pod, Plasma rifle, Gun Drone (Twin pulse carbine), Shield Drone
Crisis Sunforge Battlesuits [150pts]:
• 1x Crisis Sunforge Shas’vre: Battlesuit fists, 2x Fusion blaster, Gun Drone (Twin pulse carbine), Shield Drone
• 2x Crisis Sunforge Shas’ui: Battlesuit fists, 2x Fusion blaster, Gun Drone (Twin pulse carbine), Shield Drone
Ghostkeel Battlesuit [160pts]: Ghostkeel fists, Fusion collider, Twin fusion blaster
Hammerhead Gunship [145pts]: Armoured hull, Railgun, 2x Seeker missile, 2 Smart missile systems (2x Smart missile system)`;

const FNFTauText = `Xenos - T'au Empire - FNF 3/14 - [1250 pts]

# ++ Army Roster ++ [1250 pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Retaliation Cadre
Show/Hide Options

## Epic Hero [95 pts]
Commander Farsight [95 pts]: Dawn Blade, High-intensity plasma rifle, Warlord

## Character [145 pts]
Cadre Fireblade [50 pts]: Close combat weapon, Fireblade pulse rifle
Commander in Coldstar Battlesuit [95 pts]: Airbursting fragmentation projector, Cyclic ion blaster, T'au flamer, Battlesuit fists

## Battleline [100 pts]
Breacher Team [100 pts]:
• 1x Breacher Fire Warrior Shas'ui: Close combat weapon, Pulse blaster, Pulse pistol, Support turret, Guardian Drone, Gun Drone (Twin pulse carbine)
• 9x Breacher Fire Warriors: Close combat weapon, Pulse blaster, Pulse pistol

## Infantry [275 pts]
Kroot Carnivores [65 pts]:
• 1x Long-quill: Close combat weapon, Kroot pistol, Kroot rifle
• 9x Kroot Carnivores: Close combat weapon, Kroot rifle
Pathfinder Team [90 pts]:
• 1x Pathfinder Shas'ui: Close combat weapon, Pulse carbine, Pulse pistol, Recon drone (Drone burst cannon)
• 9x Pathfinders w/ pulse carbine: Close combat weapon, Pulse carbine, Pulse pistol
Stealth Battlesuits [60 pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Fusion blaster, Marker Drone, Shield Drone
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon
Stealth Battlesuits [60 pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Fusion blaster, Marker Drone, Shield Drone
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon

## Mounted [40 pts]
Krootox Riders [40 pts]:
• 1x Krootox Rider w/ repeater cannon: Close combat weapon, Krootox fists, Repeater cannon

## Vehicle [510 pts]
Broadside Battlesuits [90 pts]:
• 1x Broadside Shas’vre: Crushing bulk, Missile Drone (Missile pod), Shield Drone, High-yield missile pods, Weapon support system, Twin smart missile system
Crisis Starscythe Battlesuits [110 pts]:
• 1x Crisis Starscythe Shas’vre: 2x T'au flamer, Battlesuit fists, Gun Drone (Twin pulse carbine), Marker Drone
• 2x Crisis Starscythe Shas’ui: 2x T'au flamer, Battlesuit fists, Gun Drone (Twin pulse carbine), Shield Drone
Crisis Sunforge Battlesuits [150 pts]:
• 1x Crisis Sunforge Shas’vre: 2x Fusion blaster, Battlesuit fists, Gun Drone (Twin pulse carbine), Marker Drone
• 2x Crisis Sunforge Shas’ui: Battlesuit fists, 2x Fusion blaster, Gun Drone (Twin pulse carbine), Shield Drone
Ghostkeel Battlesuit [160 pts]: Ghostkeel fists, Battlesuit support system, Fusion collider, Twin T'au flamer

## Dedicated Transport [85 pts]
Devilfish [85 pts]: Accelerator burst cannon, Armoured hull, 2 Smart missile systems (2x Smart missile system)`;

const NRTauText = `Xenos - T'au Empire - Base Tau - [2000pts]

# ++ Army Roster ++ [2000pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Auxiliary Cadre
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Epic Hero [95pts]
Commander Farsight [95pts]: Dawn Blade, High-intensity plasma rifle, Warlord

## Character [310pts]
Cadre Fireblade [50pts]: Close combat weapon, Fireblade pulse rifle
Commander in Coldstar Battlesuit [120pts]: Transponder Lock Module, Battlesuit fists, Cyclic ion blaster, Plasma rifle, Shield generator, Weapon support system, 2x Shield Drone
Kroot Lone-spear [90pts]: Close combat weapon, Kalamandra's bite, Kroot long gun
Kroot War Shaper [50pts]: Kroot pistol, Shaper's blade, Dart-bow and tri-blade

## Battleline [75pts]
Strike Team [75pts]:
• 1x Fire Warrior Shas'ui: Close combat weapon, Pulse pistol, Pulse rifle, Support turret, Guardian Drone, Shield Drone
• 9x Fire Warrior w/ pulse rifle: Close combat weapon, Pulse pistol, Pulse rifle

## Infantry [340pts]
Kroot Carnivores [65pts]:
• 1x Long-quill: Close combat weapon, Kroot pistol, Kroot rifle
• 9x Kroot Carnivores: Close combat weapon, Kroot rifle
Kroot Farstalkers [85pts]:
• 1x Kroot Kill-broker: Kroot pistol, Ritual blade, T'au tech rifle
• 7x Kroot Farstalker: Close combat weapon, Farstalker firearm, Kroot pistol
• 1x Kroot Farstalker w/ Farstalker firearm and Pech'ra: Close combat weapon, Farstalker firearm, Kroot pistol
• 1x Kroot Farstalker w/ Londaxi tribalest: Close combat weapon, Kroot pistol, Londaxi tribalest
• 2x Kroot Hounds: Ripping fangs
Stealth Battlesuits [60pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Burst cannon
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon
Vespid Stingwings [65pts]:
• 1x Vespid Strain Leader: Neutron blaster, Stingwing claws
• 4x Vespid Stingwings w/ Neutron Blaster: Neutron blaster, Stingwing claws
Vespid Stingwings [65pts]:
• 1x Vespid Strain Leader: Neutron blaster, Stingwing claws
• 4x Vespid Stingwings w/ Neutron Blaster: Neutron blaster, Stingwing claws

## Mounted [285pts]
Krootox Rampagers [190pts]:
• 6x Krootox Rampagers: Hunting blades, Kroot pistol and hunting javelins, Rampager fists
Krootox Rampagers [95pts]:
• 3x Krootox Rampagers: Hunting blades, Kroot pistol and hunting javelins, Rampager fists

## Beast [40pts]
Kroot Hounds [40pts]:
• 5x Kroot Hounds: Ripping fangs

## Vehicle [855pts]
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Crisis Fireknife Battlesuits [130pts]:
• 1x Crisis Fireknife Shas’vre: Battlesuit fists, Missile pod, Plasma rifle, Gun Drone (Twin pulse carbine), Shield Drone
• 2x Crisis Fireknife Shas’ui: Battlesuit fists, Missile pod, Plasma rifle, Gun Drone (Twin pulse carbine), Shield Drone
Crisis Sunforge Battlesuits [150pts]:
• 1x Crisis Sunforge Shas’vre: Battlesuit fists, 2x Fusion blaster, Gun Drone (Twin pulse carbine), Shield Drone
• 2x Crisis Sunforge Shas’ui: Battlesuit fists, 2x Fusion blaster, Gun Drone (Twin pulse carbine), Shield Drone
Ghostkeel Battlesuit [160pts]: Ghostkeel fists, Fusion collider, Twin fusion blaster
Hammerhead Gunship [145pts]: Armoured hull, Railgun, 2x Seeker missile, 2 Smart missile systems (2x Smart missile system)`;

const AncientInTerminatorArmorText = `Imperium - Adeptus Astartes - Black Templars - Astartes Test - [11785pts]

# ++ Army Roster ++ [11785pts]
## Configuration
Battle Size
Detachment
Show/Hide Options: Agents of the Imperium are visible, Imperial Knights are visible

Ancient in Terminator Armor [75pts]: Storm Bolter and Melee Weapon (Storm Bolter, Power Fist)`;

const BroadsidesText = `Xenos - T'au Empire - Base Tau - [2000pts]

# ++ Army Roster ++ [2000pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Auxiliary Cadre
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle
Broadside Battlesuits [90pts]:
• 1x Broadside Shas’vre: Crushing bulk, 2x Shield Drone, Heavy rail rifle, Seeker missile, Twin plasma rifle`;

const CountTestList = `Xenos - T'au Empire - FNF 3/14 - [1250 pts]

# ++ Army Roster ++ [1250 pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Retaliation Cadre
Show/Hide Options

Cadre Fireblade [50 pts]: Close combat weapon, Fireblade pulse rifle
## Battleline [100 pts]
Breacher Team [100 pts]:
• 1x Breacher Fire Warrior Shas'ui: Close combat weapon, Pulse blaster, Pulse pistol, Support turret, Guardian Drone, Gun Drone (Twin pulse carbine)
• 9x Breacher Fire Warriors: Close combat weapon, Pulse blaster, Pulse pistol

Stealth Battlesuits [60 pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Fusion blaster, Marker Drone, Shield Drone
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon
Stealth Battlesuits [60 pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Fusion blaster, Marker Drone, Shield Drone
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon`;

const EnhancementsText = `Chaos - Chaos Space Marines - Test - [445 pts]

# ++ Army Roster ++ [445 pts]
## Configuration
Battle Size
Detachment Choice: Creations of Bile
Show/Hide Options: Chaos Knights are visible, Khorne Daemons are visible, Legends are visible, Nurgle Daemons are visible, Slaanesh Daemons are visible, Titans are visible, Tzeentch Daemons are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Character [445 pts]
Chaos Lord [125 pts]: Prime Test Subject, Daemon hammer, Plasma pistol
Chaos Lord [100 pts]: Surgical Precision, Daemon hammer, Plasma pistol
Chaos Lord [105 pts]: Living Carapace, Daemon hammer, Plasma pistol
Chaos Lord [115 pts]: Helm of All-Seeing, Daemon hammer, Plasma pistol`;

const DeathwatchText = `Imperium - Adeptus Astartes - Deathwatch - Deathwatch - [50 pts]

# ++ Army Roster ++ [50 pts]
## Configuration
Battle Size
Detachment: Vanguard Spearhead
Show/Hide Options

## Character [50 pts]
Ancient [50 pts]: Bolt Pistol, Bolt Rifle & Close Combat Weapon (Bolt Rifle, Close Combat Weapon)`;

const LychguardText = `Xenos - Necrons - Lychguard - [170 pts]

# ++ Army Roster ++ [170 pts]
## Configuration
Battle Size
Detachment Choice
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Infantry [170 pts]
Lychguard [85 pts]:
• 5x Lychguard: Warscythe
Lychguard [85 pts]:
• 5x Lychguard: Hyperphase sword and dispersion shield`;

const AdmechText = `Imperium - Adeptus Mechanicus - Tester - [3215pts]

# ++ Army Roster ++ [3215pts]
## Configuration
Battle Size
Detachment: Cohort Cybernetica
Show/Hide Options

## Epic Hero [150pts]
Belisarius Cawl [150pts]: Arc scourge, Cawl's Omnissian axe, Mechadendrite hive, Solar atomiser, Warlord

## Character [350pts]
Cybernetica Datasmith [35pts]: Mechanicus pistol, Power fist
Skitarii Marshal [35pts]: Control stave, Mechanicus pistol
Sydonian Skatros [50pts]: Mechanicus pistol, Sydonian Feet, Radium Jezzail
Tech-Priest Dominus [70pts]: Omnissian axe, Macrostubber, Volkite blaster
Tech-Priest Enginseer [55pts]: Mechanicus pistol, Omnissian axe
Tech-Priest Manipulus [60pts]: Omnissian staff, Magnarail lance
Technoarcheologist [45pts]: Mechanicus pistol, Servo-arc claw

## Battleline [180pts]
Skitarii Rangers [85pts]:
• 1x Skitarii Ranger Alpha: Close combat weapon, Galvanic rifle
• 9x Skitarii Ranger w/ galvanic rifle: Close combat weapon, Galvanic rifle
Skitarii Vanguard [95pts]:
• 1x Skitarii Vanguard Alpha: Close combat weapon, Radium carbine
• 9x Skitarii Vanguard w/ radium carbine: Close combat weapon, Radium carbine

## Infantry [800pts]
Corpuscarii Electro-Priests [65pts]:
• 5x Corpuscarii Electro-Priests: Electrostatic gauntlets
Fulgurite Electro-Priests [70pts]:
• 5x Fulgurite Electro-Priests: Electroleech stave
Kataphron Breachers [160pts]:
• 3x Kataphron Breacher (Heavy arc rifle & arc claw): Arc claw, Heavy arc rifle
Kataphron Destroyers [105pts]:
• 3x Kataphron Destroyer (Heavy grav-cannon & phosphor blaster): Close combat weapon, Heavy grav cannon, Phosphor blaster
Kataphron Destroyers [105pts]:
• 3x Kataphron Destroyer (Heavy grav-cannon & phosphor blaster): Close combat weapon, Heavy grav cannon, Phosphor blaster
Pteraxii Skystalkers [70pts]:
• 1x Pteraxii Skystalker Alpha: Flechette blaster, Taser goad
• 4x Pteraxii Skystalkers: Close combat weapon, Flechette carbine
Pteraxii Sterylizors [80pts]:
• 1x Pteraxii Sterylizor Alpha: Flechette blaster, Pteraxii talons, Taser goad
• 4x Pteraxii Sterylizors: Phosphor torch, Pteraxii talons
Sicarian Infiltrators [70pts]:
• 4x Sicarian Infiltrator (Power weapon & stubcarbine): Power weapon, Stubcarbine
• 1x Sicarian Infiltrator Princeps (Power weapon & stub carbine): Power weapon, Stubcarbine
Sicarian Ruststalkers [75pts]:
• 4x Sicarian Ruststalker (Transonic razor & chordclaw): Transonic razor & chordclaw
• 1x Sicarian Ruststalker Princeps (Transonic razor & chordclaw): Transonic razor & chordclaw

## Mounted [115pts]
Serberys Raiders [60pts]:
• 1x Serberys Raider Alpha: Cavalry sabre & clawed limbs, Galvanic carbine, Mechanicus pistol
• 2x Serberys Raider: Cavalry sabre & clawed limbs, Galvanic carbine
Serberys Sulphurhounds [55pts]:
• 1x Serberys Sulphurhound Alpha: Cavalry arc maul, Clawed limbs, Mechanicus pistol, Sulphur breath
• 2x Serberys Sulphurhound (Twin phosphor pistols): Clawed limbs, 2x Phosphor pistol, Sulphur breath

## Vehicle [1535pts]
Archaeopter Fusilave [160pts]: Armoured hull, Cognis heavy stubber array, Command Uplink
Archaeopter Stratoraptor [185pts]: Armoured hull, 2x Cognis heavy stubber, 2x Heavy phosphor blaster, Twin cognis lascannon, Command Uplink
Archaeopter Transvector [150pts]: Armoured hull, Cognis heavy stubber array, Command Uplink
Archaeopter Transvector [150pts]: Armoured hull, Cognis heavy stubber array, Command Uplink
Ironstrider Ballistarii [75pts]:
• 1x Ironstrider Ballistarius (Twin cognis autocannon) [75pts]: Ironstrider feet, Twin cognis autocannon
Kastelan Robots [180pts]:
• 2x Kastelan Robot: Twin Kastelan fist, Incendine combustor
Kastelan Robots [180pts]:
• 2x Kastelan Robot: Twin Kastelan fist, Incendine combustor
Onager Dunecrawler [155pts]: Dunecrawler legs, Eradication beamer
Skorpius Disintegrator [175pts]: Armoured hull, 3x Cognis heavy stubber, Disruptor missile launcher, Belleros energy cannon
Sydonian Dragoons with radium jezzails [55pts]:
• 1x Sydonian Dragoon with radium jezzail: Ironstrider feet, Phosphor serpenta, Radium jezzail
Sydonian Dragoons with taser lances [70pts]:
• 1x Sydonian Dragoon with taser lance [70pts]: Phosphor serpenta, Taser lance

## Dedicated Transport [85pts]
Skorpius Dunerider [85pts]: Armoured hull, Cognis heavy stubber array`;

const SpaceMarinesText = `Imperium - Adeptus Astartes - Black Templars - Astartes Test - [11785pts]

# ++ Army Roster ++ [11785pts]
## Configuration
Battle Size
Detachment
Show/Hide Options: Agents of the Imperium are visible, Imperial Knights are visible

## Epic Hero [335pts]
Chaplain Grimaldus [130pts]: Artificer Crozius, Plasma Pistol
• 3x Cenobyte Servitor: Close Combat Weapon
High Marshal Helbrecht [130pts]: Ferocity, Sword of the High Marshals
The Emperor's Champion [75pts]: Black Sword, Bolt Pistol

## Character [1490pts]
Ancient [50pts]: Bolt Pistol, Bolt Rifle & Close Combat Weapon (Bolt Rifle, Close Combat Weapon)
Ancient in Terminator Armor [75pts]: Storm Bolter and Melee Weapon (Storm Bolter, Power Fist)
Apothecary [50pts]: Absolver Bolt Pistol, Close Combat Weapon, Reductor Pistol
Apothecary Biologis [70pts]: Absolver Bolt Pistol, Close Combat Weapon
Bladeguard Ancient [45pts]: Close Combat Weapon, Heavy Bolt Pistol
Captain [80pts]: Bolt Pistol, Master-crafted Bolt Rifle, Melee Weapon (Bolt Pistol, Master-crafted Bolt Rifle, Close Combat Weapon)
Captain in Gravis Armour [80pts]: Master-crafted Heavy Bolt Rifle and Master-crafted Power Weapon (Master-crafted Heavy Bolt Rifle, Master-crafted Power Weapon)
Captain in Phobos Armour [70pts]: Bolt Pistol, Combat Knife, Instigator Bolt Carbine
Captain in Terminator Armour [95pts]: Storm Bolter, Relic Weapon
Captain with Jump Pack [85pts]: Melee and Pistol (Astartes Chainsword, Heavy Bolt Pistol)
Castellan [60pts]: Master-crafted Power Weapon, Combi-weapon
Chaplain [60pts]: Absolver Bolt Pistol, Crozius Arcanum
Chaplain in Terminator Armour [75pts]: Crozius Arcanum, Storm Bolter
Chaplain on Bike [75pts]: Absolver Bolt Pistol, Crozius Arcanum, Twin Bolt Rifle
Chaplain with Jump Pack [75pts]: Crozius Arcanum, Bolt Pistol
Judiciar [70pts]: Absolver Bolt Pistol, Executioner Relic Blade
Lieutenant [65pts]: Pistol, Master-crafted Bolt Rifle & Melee Weapon (Close Combat Weapon, Bolt Pistol, Master-crafted Bolt Rifle)
Lieutenant in Phobos Armour [55pts]: Bolt Pistol, Master-crafted Scoped Bolt Carbine, Paired Combat Blades
Lieutenant in Reiver Armour [55pts]: Combat Knife, Master-crafted Special Issue Bolt Pistol
Lieutenant with Combi-weapon [70pts]: Combi-weapon, Paired Combat Blades
Marshal [75pts]: Master-crafted Power Weapon, Plasma Pistol
Techmarine [55pts]: Forge Bolter, Grav-pistol, Omnissian Power Axe, Servo-arm

## Battleline [640pts]
Assault Intercessor Squad [75pts]:
• 1x Assault Intercessor Sergeant: Heavy Bolt Pistol, Astartes Chainsword
• 4x Assault Intercessors: Astartes Chainsword, Heavy Bolt Pistol
Crusader Squad [85pts]:
• 4x Initiate w/Boltgun: Bolt Pistol, Boltgun
• 1x Sword Brother: Close Combat Weapon, Bolt Pistol, Boltgun
Heavy Intercessor Squad [110pts]:
• 1x Heavy Intercessor Sergeant: Heavy Bolt Rifle (Bolt Pistol, Close Combat Weapon)
• 4x Heavy Intercessors: Bolt Pistol, Close Combat Weapon, Heavy Bolt Rifle
Intercessor Squad [80pts]:
• 1x Intercessor Sergeant: Bolt Pistol, Bolt Rifle, Close Combat Weapon
• 4x Intercessors: Bolt Pistol, Bolt Rifle, Close Combat Weapon
Primaris Crusader Squad [150pts]:
• 1x Primaris Sword Brother: Power Weapon, Heavy Bolt Pistol
• 5x Primaris Initiate w/Bolt Rifle: Bolt Pistol, Bolt Rifle, Close Combat Weapon
• 4x Primaris Neophyte w/Astartes Chainsword: Astartes Chainsword, Bolt Pistol
Tactical Squad [140pts]:
• 9x Tactical Marine: Bolt Pistol, Boltgun, Close Combat Weapon
• 1x Tactical Marine Sergeant: Close Combat Weapon, Bolt Pistol, Boltgun

## Infantry [2755pts]
Aggressor Squad [120pts]:
• 1x Aggressor Sergeant: Twin Power Fist, Flamestorm Gauntlets
• 2x Aggressors: Twin Power Fist, Flamestorm Gauntlets
Assault Intercessors with Jump Packs [90pts]:
• 1x Assault Intercessor Sergeant with Jump Pack: Heavy Bolt Pistol, Astartes Chainsword
• 4x Assault Intercessors with Jump Pack: Astartes Chainsword, Heavy Bolt Pistol
Bladeguard Veteran Squad [90pts]:
• 1x Bladeguard Veteran Sergeant: Master-crafted Power Weapon, Heavy Bolt Pistol
• 2x Bladeguard Veterans: Heavy Bolt Pistol, Master-crafted Power Weapon
Centurion Assault Squad [150pts]:
• 2x Assault Centurion: Siege Drills, Centurion Bolters, Twin Flamer
• 1x Assault Centurion Sergeant: Siege Drills, Centurion Bolters, Twin Flamer
Centurion Devastator Squad [185pts]:
• 2x Devastator Centurion: Centurion Fists, Centurion Bolters, Grav-cannon
• 1x Devastator Centurion Sergeant: Centurion Fists, Centurion Bolters, Grav-cannon
Company Heroes [95pts]:
• 1x Ancient: Bolt Pistol, Bolt Rifle, Close Combat Weapon
• 1x Company Champion: Bolt Pistol, Master-crafted Power Weapon
• 1x Company Veteran w/ Bolt Rifle: Bolt Pistol, Close Combat Weapon, Master-crafted Bolt Rifle
• 1x Company Veteran w/ Heavy Bolter: Bolt Pistol, Close Combat Weapon, Master-crafted Heavy Bolter (Close Combat Weapon)
Desolation Squad [200pts]:
• 4x Desolation Marine: Bolt Pistol, Castellan Launcher, Close Combat Weapon, Superfrag Rocket Launcher
• 1x Desolation Sergeant: Bolt Pistol, Castellan Launcher, Close Combat Weapon, Superfrag Rocket Launcher
Devastator Squad [120pts]:
• 4x Devastator Marine w/ Heavy Weapon: Bolt Pistol, Close Combat Weapon, Grav-cannon
• 1x Devastator Sergeant: Close Combat Weapon, 2x Astartes Chainsword
Eliminator Squad [85pts]:
• 2x Eliminator: Bolt Pistol, Close Combat Weapon, Bolt Sniper Rifle
• 1x Eliminator Sergeant: Bolt Pistol, Close Combat Weapon, Bolt Sniper Rifle
Eradicator Squad [100pts]:
• 2x Eradicator: Bolt Pistol, Close Combat Weapon, Melta Rifle
• 1x Eradicator Sergeant: Bolt Pistol, Close Combat Weapon, Melta Rifle
Hellblaster Squad [115pts]:
• 4x Hellblaster: Bolt Pistol, Close Combat Weapon, Plasma Incinerator
• 1x Hellblaster Sergeant: Close Combat Weapon, Plasma Incinerator, Bolt Pistol
Inceptor Squad [120pts]: Assault Bolters
• 2x Inceptor: Close Combat Weapon
• 1x Inceptor Sergeant: Close Combat Weapon
Incursor Squad [80pts]:
• 4x Incursor: Bolt Pistol, Occulus Bolt Carbine, Paired Combat Blades
• 1x Incursor Sergeant: Bolt Pistol, Occulus Bolt Carbine, Paired Combat Blades
Incursor Squad [80pts]:
• 4x Incursor: Bolt Pistol, Occulus Bolt Carbine, Paired Combat Blades
• 1x Incursor Sergeant: Bolt Pistol, Occulus Bolt Carbine, Paired Combat Blades
Infernus Squad [90pts]:
• 4x Infernus Marines: Bolt Pistol, Close Combat Weapon, Pyreblaster
• 1x Infernus Sergeant: Bolt Pistol, Close Combat Weapon, Pyreblaster
Infiltrator Squad [100pts]:
• 4x Infiltrator: Bolt Pistol, Close Combat Weapon, Marksman Bolt Carbine
• 1x Infiltrator Sergeant: Bolt Pistol, Close Combat Weapon, Marksman Bolt Carbine
Primaris Sword Brethren [150pts]:
• 4x Primaris Sword Brother: Astartes Chainsword, Heavy Bolt Pistol
• 1x Sword Brother Castellan: Astartes Chainsword, Heavy Bolt Pistol
Reiver Squad [80pts]:
• 1x Reiver Sergeant: Combat Knife, Special Issue Bolt Pistol
• 4x Reivers: Special Issue Bolt Pistol, Combat Knife
Scout Squad [70pts]:
• 1x Scout Sergeant: Bolt Pistol, Close Combat Weapon, Boltgun
• 4x Scouts w/ Boltgun: Bolt Pistol, Boltgun, Close Combat Weapon
Sternguard Veteran Squad [100pts]:
• 1x Sternguard Veteran Sergeant: Close Combat Weapon, Sternguard Bolt Pistol, Sternguard Bolt Rifle
• 4x Sternguard Veteran w/ Bolt Rifle: Close Combat Weapon, Sternguard Bolt Pistol, Sternguard Bolt Rifle
Suppressor Squad [75pts]:
• 2x Suppressor: Accelerator Autocannon, Bolt Pistol, Close Combat Weapon
• 1x Suppressor Sergeant: Accelerator Autocannon, Bolt Pistol, Close Combat Weapon
Terminator Assault Squad [180pts]:
• 1x Assault Terminator Sergeant: Thunder Hammer & Storm Shield (Storm Shield, Thunder Hammer)
• 4x Assault Terminator w/ Thunder Hammer & Storm Shield: Storm Shield, Thunder Hammer
Terminator Squad [170pts]:
• 1x Terminator Sergeant: Storm Bolter, Power Fist
• 4x Terminator w/ Power Fist: Power Fist, Storm Bolter
Vanguard Veteran Squad with Jump Packs [110pts]:
• 1x Vanguard Veteran Sergeant with Jump Pack: Vanguard Veteran Weapon, Bolt Pistol
• 4x Vanguard Veterans with Jump Packs: Vanguard Veteran Weapon, Bolt Pistol

## Mounted [140pts]
Invader ATV [60pts]: Bolt Pistol, Close Combat Weapon, Twin Bolt Rifle, Onslaught Gatling Cannon
Outrider Squad [80pts]:
• 2x Outrider: Astartes Chainsword, Heavy Bolt Pistol, Twin Bolt Rifle
• 1x Outrider Sergeant: Astartes Chainsword, Heavy Bolt Pistol, Twin Bolt Rifle

## Vehicle [5990pts]
Astraeus [525pts]: Armoured hull, Ironhail Heavy Stubber, Storm bolter, Twin macro-accelerator cannon, Twin heavy bolter, Two Astraeus las-rippers (2x Astraeus las-ripper)
Ballistus Dreadnought [130pts]: Armoured Feet, Ballistus Lascannon, Ballistus Missile Launcher, Twin Storm Bolter
Black Templars Gladiator Lancer [170pts]: Armoured Hull, Lancer Laser Destroyer, 2 Storm Bolters (2x Storm Bolter)
Black Templars Gladiator Reaper [170pts]: Armoured Hull, 2x Tempest Bolter, Twin Heavy Onslaught Gatling Cannon
Black Templars Gladiator Valiant [170pts]: Armoured Hull, 2x Multi-melta, Twin Las-talon
Black Templars Repulsor [190pts]: Armoured Hull, Hunter-slayer Missile, Repulsor Defensive Array, Twin Heavy Bolter, Heavy Onslaught Gatling Cannon
Black Templars Repulsor Executioner [230pts]: Armoured Hull, Heavy Onslaught Gatling Cannon, Repulsor Executioner Defensive Array, Twin Heavy Bolter, Twin Icarus Ironhail Heavy Stubber, Heavy Laser Destroyer
Black Templars Repulsor Executioner [230pts]: Armoured Hull, Heavy Onslaught Gatling Cannon, Repulsor Executioner Defensive Array, Twin Heavy Bolter, Twin Icarus Ironhail Heavy Stubber, Heavy Laser Destroyer
Brutalis Dreadnought [160pts]: Twin Icarus Ironhail Heavy Stubber, Brutalis Fists & Brutalis Bolt Rifles (Brutalis Bolt Rifles, Brutalis Fists), Twin Heavy Bolter
Dreadnought [135pts]: Close Combat Weapon w/ Missile Launcher (Close Combat Weapon, Missile Launcher), Assault Cannon
Drop Pod [70pts]: Storm Bolter
Firestrike Servo-Turrets [75pts]:
• 1x Firestrike Servo-Turret [75pts]: Close Combat Weapon, Twin Firestrike Las-talon
Invictor Tactical Warsuit [125pts]: Fragstorm Grenade Launcher, Heavy Bolter, Invictor Fist, Twin Ironhail Heavy Stubber, Incendium Cannon
Land Raider [240pts]: Armoured Tracks, 2x Godhammer Lascannon, Twin Heavy Bolter
Land Raider Crusader [220pts]: Armoured Tracks, 2x Hurricane Bolter, Twin Assault Cannon
Land Raider Redeemer [285pts]: Armoured Tracks, 2x Flamestorm Cannon, Twin Assault Cannon
Predator Annihilator [130pts]: Armoured Tracks, Predator Twin Lascannon
Predator Destructor [130pts]: Armoured Tracks, Predator Autocannon
Redemptor Dreadnought [210pts]: Redemptor Fist, Heavy Onslaught Gatling Cannon, Heavy Flamer, Twin Fragstorm Grenade Launcher
Redemptor Dreadnought [210pts]: Redemptor Fist, Heavy Onslaught Gatling Cannon, Heavy Flamer, Twin Fragstorm Grenade Launcher
Storm Speeder Hailstrike [115pts]: Close Combat Weapon, 2x Fragstorm Grenade Launcher, Onslaught Gatling Cannon, Twin Ironhail Heavy Stubber
Storm Speeder Hammerstrike [125pts]: Close Combat Weapon, Hammerstrike Missile Launcher, 2x Krakstorm Grenade Launcher, Melta Destroyer
Storm Speeder Thunderstrike [150pts]: Close Combat Weapon, Stormfury Missiles, Thunderstrike Las-talon, Twin Icarus Rocket Pod
Stormhawk Interceptor [155pts]: Armoured Hull, Twin Assault Cannon, Las-talon, Skyhammer Missile Launcher
Stormraven Gunship [280pts]: Armoured Hull, 2x Stormstrike Missiles, Twin Assault Cannon, Typhoon Missile Launcher
Stormtalon Gunship [165pts]: Armoured Hull, Twin Assault Cannon, Skyhammer Missile Launcher
Thunderhawk Gunship [840pts]: Armoured hull, 2x Lascannon, 4x Twin heavy bolter, Thunderhawk cluster bombs, Thunderhawk heavy cannon
Vindicator [175pts]: Armoured Tracks, Demolisher Cannon
Whirlwind [180pts]: Armoured Tracks, Whirlwind Vengeance Launcher

## Dedicated Transport [260pts]
Black Templars Impulsor [90pts]: Armoured Hull, 2 Storm Bolters (2x Storm Bolter)
Razorback [95pts]: Armoured Tracks, Twin Heavy Bolter
Rhino [75pts]: Armoured Tracks, Storm Bolter

## Fortification [175pts]
Hammerfall Bunker [175pts]: Hammerfall Missile Launcher, Hammerfall Heavy Bolter Array`;

const EldarText = `Xenos - Aeldari - Tester - [9725 pts]

# ++ Army Roster ++ [9725 pts]
## Configuration
Battle Focus - Agile Manoeuvres
Battle Size
Detachment
Show/Hide Options

## Epic Hero [1220 pts]
Asurmen [135 pts]: The Bloody Twins, The Sword of Asur
Avatar of Khaine [300 pts]: The Wailing Doom
Baharroth [115 pts]: Fury of the Tempest, The Shining Blade
Eldrad Ulthran [110 pts]: Mind War, Shuriken Pistol, Staff of Ulthamar and witchblade
Fuegan [120 pts]: Searsong, The Fire Axe
Jain Zar [105 pts]: Silent Death, The Blade of Destruction
Lhykhis [120 pts]: Brood Twain, Spider's Fangs, Weaverender
Maugan Ra [100 pts]: Maugetar
Solitaire [115 pts]: Solitaire Weapons

## Character [640 pts]
Autarch [75 pts]: Star Glaive, Shuriken Pistol
Autarch Wayleaper [80 pts]: Star Glaive, Shuriken Pistol
Death Jester [90 pts]: Jester's Blade, Shrieker Cannon
Farseer [70 pts]: Eldritch Storm, Shuriken Pistol, Witchblade
Farseer Skyrunner [80 pts]: Eldritch Storm, Shuriken Pistol, Twin Shuriken Catapult, Witchblade
Shadowseer [60 pts]: Miststave, Shuriken Pistol
Spiritseer [65 pts]: Shuriken Pistol, Witch Staff
Troupe Master [75 pts]: Harlequin's Special Weapon, Shuriken Pistol
Warlock [45 pts]: Destructor, Shuriken Pistol, Witchblade

## Battleline [260 pts]
Corsair Voidreavers [60 pts]:
• 4x Voidreaver: Close Combat Weapon, Shuriken pistol Power sword
• 1x Voidreaver Felarch: Close Combat Weapon, Power sword, Shuriken pistol
Guardian Defenders [100 pts]:
• 10x Guardian Defender: Close Combat Weapon, Shuriken Catapult
• 1x Heavy Weapon Platform: Close Combat Weapon, Shuriken Cannon
Storm Guardians [100 pts]:
• 1x Serpent's Scale Platform: Close Combat Weapon
• 10x Storm Guardian: Close Combat Weapon, Shuriken Pistol

## Infantry [1485 pts]
Corsair Voidscarred [80 pts]:
• 1x Voidscarred Felarch: Close Combat Weapon, Power sword, Shuriken pistol
• 4x Voidscarred w/ pistol and sword: Close Combat Weapon, Power sword, Shuriken Pistol
D-Cannon Platform [125 pts]: Close Combat Weapon, D-cannon, Shuriken Catapult
Dark Reapers [90 pts]:
• 4x Dark Reaper: Close combat weapon, Reaper Launcher
• 1x Dark Reaper Exarch: Close combat weapon, Reaper Launcher
Dire Avengers [75 pts]:
• 4x Dire Avenger: Avenger Shuriken Catapult, Close Combat Weapon
• 1x Dire Avenger Exarch: Close Combat Weapon, Avenger Shuriken Catapult
Fire Dragons [100 pts]:
• 4x Fire Dragon: Close combat weapon, Dragon Fusion Gun
• 1x Fire Dragon Exarch: Close combat weapon, Exarch's Dragon Fusion Gun
Howling Banshees [90 pts]:
• 4x Howling Banshee: Banshee Blade, Shuriken Pistol
• 1x Howling Banshee Exarch: Banshee Blade and Shuriken Pistol
Rangers [55 pts]:
• 5x Ranger: Close Combat Weapon, Long rifle, Shuriken Pistol
Shadow Weaver Platform [75 pts]: Close Combat Weapon, Shadow weaver, Shuriken Catapult
Striking Scorpions [75 pts]:
• 4x Striking Scorpion: Scorpion chainsword, Shuriken pistol
• 1x Striking Scorpion Exarch: Shuriken Pistol, Scorpion Chainsword & Scorpion's claw
Swooping Hawks [85 pts]:
• 4x Swooping Hawk: Close combat weapon, Lasblaster
• 1x Swooping Hawk Exarch: Close combat weapon, Hawk's Talon
Troupe [85 pts]:
• 1x Lead Player: Harlequin's Blade, Shuriken Pistol
• 4x Player with Harlequin's Blade: Harlequin's Blade, Shuriken Pistol
Vibro Cannon Platform [60 pts]: Close Combat Weapon, Shuriken Catapult, Vibro Cannon
Warlock Conclave [55 pts]:
• 2x Warlock with Witchblade: Destructor, Shuriken Pistol, Witchblade
Warp Spiders [95 pts]:
• 4x Warp Spider: Close Combat Weapon, Death spinner
• 1x Warp Spider Exarch: Close Combat Weapon, Exarch's death spinner
Wraithblades [170 pts]:
• 5x Wraithblade: Ghostswords
Wraithguard [170 pts]:
• 5x Wraithguard: Close Combat Weapon, Wraithcannon

## Mounted [420 pts]
Shining Spears [120 pts]:
• 2x Shining Spear: Laser Lance, Twin Shuriken Catapult
• 1x Shining Spear Exarch: Twin Shuriken Catapult, Laser Lance
Shroud Runners [80 pts]:
• 3x Shroud Runner: Close Combat Weapon, Long rifle, Scatter Laser, Shuriken Pistol
Skyweavers [95 pts]:
• 2x Skyweaver: Close Combat Weapon, Shuriken Cannon, Star Bolas
Warlock Skyrunners [45 pts]:
• 1x Warlock Skyrunner with Witchblade: Destructor, Shuriken Pistol, Twin Shuriken Catapult, Witchblade
Windriders [80 pts]:
• 3x Windrider with Twin Shuriken Catapult: Close Combat Weapon, Twin Shuriken Catapult

## Monster [4355 pts]
Phantom Titan [2100 pts]: Phantom feet, Voidstorm missile launcher, D-bombard, Phantom pulsar, Phantom starcannon
Revenant Titan [1100 pts]: Cloudburst missile launcher, Revenant feet, Revenant Pulsar, Sonic Lance
Wraithknight [435 pts]: Titanic feet, Scattershield, Suncannon
Wraithknight with Ghostglaive [420 pts]: Titanic Ghostglaive, Scattershield
Wraithlord [140 pts]: Wraithbone Fists, 2x Shuriken Catapult
Wraithseer [Legends] [160 pts]: Destructor, Ghostspear, Wraithseer D-Cannon

## Vehicle [1080 pts]
Crimson Hunter [160 pts]: Pulse Laser, Wraithbone Hull, 2 Starcannons
Falcon [130 pts]: Pulse Laser, Wraithbone hull, Shuriken Cannon, Twin Shuriken Catapult
Fire Prism [160 pts]: Prism Cannon, Wraithbone hull, Twin Shuriken Catapult
Hemlock Wraithfighter [155 pts]: 2x Heavy D-Scythe
Night Spinner [190 pts]: Doomweaver, Wraithbone hull, Twin Shuriken Catapult
Voidweaver [125 pts]: Close Combat Weapon, 2x Shuriken Cannon, Voidweaver Haywire Cannon
Vypers [65 pts]:
• 1x Vyper [65 pts]: Twin Shuriken Catapult, Wraithbone hull, Shuriken Cannon
War Walkers [95 pts]:
• 1x War Walker [95 pts]: War Walker feet, 2x Shuriken Cannon

## Dedicated Transport [265 pts]
Starweaver [80 pts]: Close Combat Weapon, 2x Shuriken Cannon
Wave Serpent [115 pts]: Wraithbone Hull, Twin Shuriken Catapult, Twin Shuriken Cannon
Ynnari Venom [70 pts]: Bladevanes, Splinter Cannon, Twin Splinter Rifle`;

const CKText = `Chaos - Chaos Knights - Tester - [7500pts]

# ++ Army Roster ++ [7500pts]
## Configuration
Battle Size
Detachment Choice
Show/Hide Options: Khorne Daemons are visible, Legends are visible, Nurgle Daemons are visible, Slaanesh Daemons are visible, Titans are visible, Tzeentch Daemons are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Character [5300pts]
Chaos Cerastus Knight Acheron [420pts]: Acheron flame cannon, Reaper chainfist, Twin heavy bolter
Chaos Cerastus Knight Atrapos [420pts]: Atrapos lascutter, Graviton singularity cannon
Chaos Cerastus Knight Castigator [445pts]: Castigator bolt cannon, Tempest warblade
Chaos Cerastus Knight Lancer [420pts]: Cerastus shock lance
Chaos Questoris Knight Magaera [435pts]: Lightning cannon, Phased plasma-fusil, Reaper chainsword
Chaos Questoris Knight Styrix [430pts]: Graviton crusher, Volkite chierovile, Reaper chainsword
Knight Abominant [365pts]: Balemace, Diabolus heavy stubber, Electroscourge, Volkite combustor
Knight Desecrator [410pts]: Desecrator laser destructor, Diabolus heavy stubber, Reaper chainsword
Knight Despoiler [415pts]: Titanic feet, Reaper chainsword, Warpstrike claw, Daemonbreath meltagun
Knight Rampager [380pts]: Diabolus heavy stubber, Reaper chainsword, Warpstrike claw
Knight Tyrant [510pts]: Titanic feet, 2x Twin daemonbreath meltagun, 2 Gheiststrike missile launchers and 1 twin desecrator cannon (2x Gheiststrike missile launcher, Twin desecrator cannon), Brimstone volcano lance and ectoplasma decimator
Knight Tyrant [510pts]: Titanic feet, 2x Twin daemonbreath meltagun, 2 Gheiststrike missile launchers and 1 twin desecrator cannon (2x Gheiststrike missile launcher, Twin desecrator cannon), Brimstone volcano lance and ectoplasma decimator
War Dog Stalker [140pts]: Diabolus heavy stubber, Avenger chaincannon, Slaughterclaw

## Battleline [735pts]
War Dog Brigand [165pts]: Armoured feet, Avenger chaincannon, Daemonbreath spear, Diabolus heavy stubber
War Dog Executioner [130pts]: Armoured feet, 2x War Dog autocannon, Diabolus heavy stubber
War Dog Huntsman [140pts]: Daemonbreath spear, Reaper chaintalon, Diabolus heavy stubber
War Dog Karnivore [140pts]: Reaper chaintalon, Slaughterclaw, Diabolus heavy stubber
War Dog Moirax [160pts]: Armoured feet, Graviton pulsar, Volkite veuglaire

## Vehicle [1465pts]
Chaos Acastus Knight Asterius [765pts]: 2x Asterius volkite culverin, Karacnos mortar battery, Titanic feet, 2x Twin conversion beam cannon
Chaos Acastus Knight Porphyrion [700pts]: Titanic feet, 2x Twin magna lascannon, Acastus ironstorm missile pod, 2x Acastus autocannon`;

const DemonsText = `Chaos - Chaos Daemons - Tester - [12900pts]

# ++ Army Roster ++ [12900pts]
## Configuration
Battle Size
Detachment Choice
Khorne Daemons are visible
Nurgle Daemons are visible
Slaanesh Daemons are visible
Tzeentch Daemons are visible
Show/Hide Options: Chaos Knights are visible, Legends are visible, Titans are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Epic Hero [3600pts]
An'ggrath the Unbound [Legends] [415pts]: Axe of Khorne, Bloodlash
Be'lakor [325pts]: Betraying Shades, The Blade of Shadows
Epidemius [80pts]: Balesword and nurgling attendants
Horticulous Slimux [120pts]: Acidic maw, Lopping shears
Kairos Fateweaver [270pts]: Infernal Gateway, Staff of Tomorrow
Karanak [65pts]: Collar of Khorne, Soul-rending fangs
Rotigus [230pts]: Gnarlrod, Streams of brackish filth
Scabeiathrax the Bloated [Legends] [275pts]: Blade of decay, Putrid vomit
Shalaxi Helbane [425pts]: Lash of Slaanesh, Pavane of Slaanesh, Snapping claws, Soulpiercer
Skarbrand [305pts]: Bellow of endless fury, Slaughter and Carnage
Skulltaker [85pts]: The Slayer Sword
Syll'esske [120pts]: Axe of Dominion, Cacophonic choir, Scourging whip
The Blue Scribes [75pts]: Sharp quills
The Changeling [90pts]: Infernal Flames, The Trickster's Staff
The Masque of Slaanesh [85pts]: Serrated claws
Zarakynel [Legends] [320pts]: Phantasmagoria, Snapping claws, Souleater blade

## Character [2645pts]
Bloodmaster [65pts]: Blade of blood
Bloodthirster [305pts]: Hellfire breath, Great axe of Khorne
Changecaster [60pts]: Arcane Fireball, Herald combat weapon
Contorted Epitome [80pts]: Coiled tentacles, Ravaging claws
Daemon Prince of Chaos [190pts]: Hellforged weapons, Infernal cannon, Khorne
Daemon Prince of Chaos with wings [180pts]: Hellforged weapons, Infernal cannon, Khorne
Exalted Flamer [65pts]: Fires of Tzeentch, Flamer mouths
Fateskimmer [95pts]: Arcane Fireball, Herald combat weapon, Screamer bites
Fluxmaster [60pts]: Arcane Fireball, Herald combat weapon
Great Unclean One [230pts]: Putrid vomit, Bilesword, Plague flail
Herald of Slaanesh on Steed of Slaanesh [Legends] [70pts]: Lashing tongue, Ravaging claws
Infernal Enrapturess [60pts]: Heartstring lyre, Ravaging claws
Keeper of Secrets [290pts]: Phantasmagoria, Snapping claws, Witstealer sword
Lord of Change [260pts]: Bolt of Change, Staff of Tzeentch
Poxbringer [55pts]: Foul balesword
Rendmaster on Blood Throne [165pts]: Attendant's hellblades, Blade of blood
Skullmaster [100pts]: Blade of blood, Juggernaut's bladed horn
Sloppity Bilepiper [55pts]: Marotter
Spoilpox Scrivener [60pts]: Disgusting Sneezes, Plaguesword and distended maw
Tormentbringer on Exalted Seeker Chariot [140pts]: Exalted Seeker tongues, Lashes of torment, Ravaging claws
Tranceweaver [60pts]: Ravaging claws

## Battleline [625pts]
Bloodletters [110pts]:
• 10x Bloodletter: Hellblade
Blue Horrors [125pts]:
• 10x Blue Horror: Blue claws, Coruscating Blue flames
Daemonettes [100pts]:
• 10x Daemonette: Slashing claws
Nurglings [40pts]:
• 3x Nurgling Swarm: Diseased claws and teeth
Pink Horrors [140pts]:
• 10x Pink Horror: Coruscating Pink flames, Pink claws
Plaguebearers [110pts]:
• 10x Plaguebearer: Plaguesword

## Infantry [115pts]
Flamers [75pts]:
• 3x Flamer: Flamer mouths, Flickering Flames
Furies [Legends] [40pts]: Khorne
• 5x Fury: Daemonic claws

## Mounted [1070pts]
Bloodcrushers [110pts]:
• 2x Bloodcrusher: Hellblade, Juggernaut's bladed horn
• 1x Bloodhunter: Hellblade, Juggernaut's bladed horn
Burning Chariot [115pts]: Fires of Tzeentch, Flamer mouths, Screamer bites
Burning Chariot [115pts]: Fires of Tzeentch, Flamer mouths, Screamer bites
Exalted Seeker Chariot [115pts]: Lashes of torment, Seeker tongues, Slashing claws
Hellflayer [105pts]:
• 1x Hellflayer [105pts]: Bladed axle, Lashes of torment, Seeker tongues, Slashing claws
Plague Drones [110pts]:
• 3x Plague Drone: Death's heads, Foul mouthparts, Plaguesword
Pox Riders [Legends] [160pts]:
• 3x Pox Rider: Grasping tongue, Pox rider plaguesword, Yawning maw
Seeker Chariot [65pts]:
• 1x Seeker Chariot [65pts]: Lashes of torment, Seeker tongues, Slashing claws
Seekers [80pts]:
• 5x Seeker: Lashing tongues, Slashing claws
Skull Cannon [95pts]: Attendant's hellblades, Biting maw, Skull cannon

## Beast [445pts]
Beasts of Nurgle [65pts]:
• 1x Beast of Nurgle [65pts]: Putrid appendages
Fiends [105pts]:
• 3x Fiends: Barbed tail and dissecting claws
Flesh Hounds [70pts]:
• 4x Flesh Hound: Collar of Khorne, Gore-drenched fangs
• 1x Gore Hound: Burning maw, Collar of Khorne, Gore-drenched fangs
Plague Toads [Legends] [120pts]:
• 3x Plague Toad: Grasping tongue, Yawning maw
Screamers [85pts]:
• 3x Screamer: Lamprey bite

## Monster [275pts]
Giant Chaos Spawn [Legends] [130pts]: Churning fangs and claws, Khorne
Spined Chaos Beast [Legends] [145pts]: Jagged claws and tusked maw, Khorne

## Vehicle [360pts]
Khorne Soul Grinder [180pts]: Harvester cannon, Iron claw, Torrent of burning blood, Warpsword

## Fortification [3765pts]
Aegis Defence Line with Weapon Emplacement [Legends] [145pts]: Quad-gun
Bastion [Legends] [275pts]
Feculent Gnarlmaw [100pts]
Firestorm Redoubt [Legends] [260pts]: 2x Quad lascannon
Fortress of Redemption [Legends] [480pts]: Redemptor lascannons, Redemptor missile silo
Macro-cannon Aquila Strongpoint [Legends] [550pts]: Aquila macro-cannon
Plasma Obliterator [Legends] [225pts]: Plasma obliterator
Primaris Redoubt [Legends] [220pts]: Primaris Redoubt turbo-laser destructor
Skull Altar [105pts]
Skyshield Landing Pad [Legends] [125pts]
Vengeance Weapon Battery [Legends] [140pts]: Battle cannon
Void Shield Generator [Legends] [155pts]
Vortex Missile Strongpoint [Legends] [525pts]: Vortex missile battery
Wall of Martyrs Bunker [Legends] [180pts]
Wall of Martyrs Defence Emplacement [Legends] [140pts]
Wall of Martyrs Defence Line [Legends] [140pts]`;

const GuardText = `Imperium - Astra Militarum - Guard - [10260 pts]

# ++ Army Roster ++ [10260 pts]
## Configuration
Battle Size
Detachment: Bridgehead Strike
Show/Hide Options

## Epic Hero [595 pts]
Gaunt’s Ghosts [110 pts]:
• 1x Ibram Gaunt: Bolt pistol, Gaunt's chainsword
• 1x Tanith Ghost w/ Bragg's autocannon: Bragg's autocannon, Straight silver knife
• 1x Tanith Ghost w/ Corbec's hot-shot lascarbine: Corbec's hot-shot lascarbine, Straight silver knife
• 1x Tanith Ghost w/ Larkin's long-las: Larkin's long-las, Straight silver knife
• 1x Tanith Ghost w/ Mkoll's Straight Silver Knife: Lascarbine, Mkoll's straight silver knife
• 1x Tanith Ghost w/ Rawne's lascarbine: Rawne's lascarbine, Straight silver knife
Lord Marshal Dreir [100 pts]: Laspistol, Sabre of Sacrifice, Savage claws
Lord Solar Leontus [150 pts]: Conquest, Konstantin's hooves, Sol's Righteous Gaze, Warlord
Nork Deddog [60 pts]: Huge knife, Ripper gun
Sly Marbo [55 pts]: Envenomed blade, Ripper pistol
Sly Marbo [55 pts]: Envenomed blade, Ripper pistol
Ursula Creed [65 pts]: Duty and Vengeance, Power weapon

## Character [1045 pts]
Cadian Castellan [55 pts]: Chainsword, Laspistol
Cadian Command Squad [65 pts]:
• 1x Cadian Commander: Chainsword, Laspistol
• 1x Cadian Veteran Guardsman w/ Chainsword: Chainsword, Bolt pistol
• 1x Cadian Veteran Guardsman w/ Master vox: Close combat weapon, Lasgun, Master vox
• 1x Cadian Veteran Guardsman w/ Medi-pack: Close combat weapon, Lasgun, Medi-pack
• 1x Cadian Veteran Guardsman w/ Regimental standard: Close combat weapon, Regimental standard and lasgun (Lasgun, Regimental standard)
Catachan Command Squad [65 pts]:
• 1x Catachan Commander: Close combat weapon, Laspistol
• 4x Veteran Guardsman: Close combat weapon, Laspistol, Lasgun
Commissar [30 pts]: Bolt pistol, Chainsword
Krieg Command Squad [65 pts]:
• 1x Lord Commissar: Laspistol, Power weapon
• 1x Veteran Guardsman w/ Alchemyk counteragents: Alchemyk Counteragents, Close combat weapon, Laspistol, Servo-scribes
• 1x Veteran Guardsman w/ Boltgun: Close combat weapon, Boltgun
• 1x Veteran Guardsman w/ Chainsword: Chainsword, Laspistol
• 1x Veteran Guardsman w/ Master vox: Close combat weapon, Lasgun, Master vox
• 1x Veteran Guardsman w/ Regimental standard: Close combat weapon, Lasgun, Regimental standard
Leman Russ Commander [235 pts]: Armoured tracks, Leman Russ battle cannon, Lascannon
Militarum Tempestus Command Squad [85 pts]:
• 1x Tempestor Prime: Tempestus dagger, Bolt pistol
• 4x Tempestus Scion: Close combat weapon, Hot-shot lasgun
Ministorum Priest [35 pts]: Zealot's vindicator
Ogryn Bodyguard [40 pts]: Close combat weapon, Huge knife, Bullgryn maul
Primaris Psyker [60 pts]: Force weapon, Laspistol, Psychic maelstrom
Rogal Dorn Commander [265 pts]: Armoured tracks, Heavy stubber, Twin battle cannon, Castigator gatling cannon
Tech-Priest Enginseer [45 pts]: Enginseer Axe, Mechanicus pistol, Servo-arm

## Battleline [195 pts]
Cadian Shock Troops [65 pts]: 1 Shock Trooper Sergeant and 9 Shock Troopers
• 1x Shock Trooper Sergeant: Laspistol and chainsword (Chainsword, Laspistol)
• 9x Shock Trooper: Close combat weapon, Lasgun
Catachan Jungle Fighters [65 pts]: 1 Jungle Fighter Sergeant and 9 Jungle Fighters
• 1x Jungle Fighter Sergeant: Close combat weapon, Laspistol
• 9x Jungle Fighter: Close combat weapon, Lasgun
Death Korps of Krieg [65 pts]: 1 Death Korps Watchmaster and 9 Death Korps Troopers
• 1x Death Korps Watchmaster: Laspistol and chainsword (Chainsword, Bolt pistol)
• 9x Death Korps Trooper: Close combat weapon, Lasgun

## Infantry [1000 pts]
Artillery Team [95 pts]: Crew close combat weapons, Lasgun, Heavy mortar
Bullgryn Squad [110 pts]:
• 1x Bullgryn Bone 'ead: Close combat weapon, Bullgryn maul, Brute shield
• 2x Bullgryn: Close combat weapon, Grenadier gauntlet, Slabshield
Cadian Heavy Weapons Squad [65 pts]:
• 3x Heavy Weapons Team w/ Heavy bolter: Heavy bolter, Laspistol, Weapons team close combat weapons
Catachan Heavy Weapons Squad [65 pts]:
• 3x Heavy Weapons Team w/ Heavy bolter: Heavy bolter, Lasgun, Weapons team close combat weapons
Field Ordnance Battery [110 pts]:
• 2x Ordnance Team w/ Malleus rocket launcher: Battery close combat weapons, Lasgun, Laspistol, Malleus rocket launcher
Kasrkin [110 pts]:
• 1x Kasrkin Sergeant: Chainsword, Hot-shot laspistol
• 9x Kasrkin Trooper: Close combat weapon, Hot-shot lasgun
Krieg Combat Engineers [70 pts]:
• 1x Krieg Engineer Watchmaster: Autopistol, Trench club
• 4x Krieg Combat Engineer: Autopistol, Trench club
Krieg Heavy Weapons Squad [75 pts]:
• 1x Fire Coordinator: Close combat weapon, Laspistol
• 3x Heavy Weapons Gunners w/ Lascannon: Close combat weapon, Lascannon, Laspistol
Ogryn Squad [60 pts]:
• 1x Ogryn Bone 'ead: Ripper gun
• 2x Ogryn: Ripper gun
Ratlings [60 pts]:
• 5x Ratlings: Close combat weapon, Sniper rifle
Tempestus Aquilons [110 pts]:
• 1x Tempestor Aquilon: Close combat weapon, Hot-shot lascarbine, Sentry flamer
• 9x Tempestus Aquilon: Close combat weapon, Hot-shot lascarbine
Tempestus Scions [70 pts]:
• 1x Tempestor: Chainsword, Hot-shot laspistol
• 4x Tempestus Scion: Close combat weapon, Hot-shot lasgun

## Mounted [130 pts]
Attilan Rough Riders [60 pts]:
• 1x Rough Rider Sergeant: Lasgun, Laspistol, Steed's hooves, Hunting lance
• 4x Rough Rider w/ Hunting lance: Hunting lance, Lasgun, Laspistol, Steed's hooves
Death Riders [70 pts]:
• 1x Ridemaster: Death Rider lascarbine, Frag lance, Power sabre, Steed's savage claws
• 4x Death Rider: Death Rider lascarbine, Frag lance, Power sabre, Steed's savage claws

## Vehicle [6910 pts]
Armoured Sentinels [65 pts]:
• 1x Armoured Sentinel [65 pts]: Close combat weapon, Multi-laser
Armoured Sentinels [65 pts]:
• 1x Armoured Sentinel [65 pts]: Close combat weapon, Multi-laser
Avenger Strike Fighter [130 pts]: Armoured hull, Avenger bolt cannon, Heavy stubber, 2x Lascannon
Baneblade [480 pts]: Armoured tracks, Baneblade cannon, Coaxial autocannon, Demolisher cannon, Heavy stubber, 2x Lascannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Banehammer [450 pts]: Armoured tracks, 2x Lascannon, Tremor cannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Banesword [480 pts]: Armoured tracks, 2x Lascannon, Quake cannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Banesword [480 pts]: Armoured tracks, 2x Lascannon, Quake cannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Basilisk [140 pts]: Armoured tracks, Earthshaker cannon, Heavy bolter
Cyclops Demolition Vehicle [25 pts]
Deathstrike [145 pts]: Armoured tracks, Deathstrike Missile, Heavy bolter
Doomhammer [445 pts]: Armoured tracks, 2x Lascannon, Magma cannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Hellhammer [450 pts]: Armoured tracks, Coaxial autocannon, Demolisher cannon, Heavy stubber, Hellhammer cannon, 2x Lascannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Hellhound [125 pts]: Inferno cannon, Heavy flamer, Armoured tracks
Hydra [95 pts]: Armoured tracks, Hydra autocannon, Heavy bolter
Leman Russ Battle Tank [175 pts]: Armoured tracks, Leman Russ battle cannon, Lascannon
Leman Russ Demolisher [190 pts]: Armoured tracks, Demolisher battle cannon, Lascannon
Leman Russ Eradicator [170 pts]: Armoured tracks, Eradicator nova cannon, Lascannon
Leman Russ Executioner [170 pts]: Armoured tracks, Executioner plasma cannon, Lascannon
Leman Russ Exterminator [180 pts]: Armoured tracks, Exterminator autocannon, Lascannon
Leman Russ Punisher [150 pts]: Armoured tracks, Punisher gatling cannon, Lascannon
Leman Russ Vanquisher [145 pts]: Armoured tracks, Vanquisher battle cannon, Lascannon
Manticore [165 pts]: Armoured tracks, Storm eagle rockets, Heavy bolter
Rogal Dorn Battle Tank [240 pts]: Armoured tracks, Heavy stubber, Twin battle cannon, Castigator gatling cannon
Scout Sentinels [55 pts]:
• 1x Scout Sentinel [55 pts]: Close combat weapon, Multi-laser
Shadowsword [440 pts]: Armoured tracks, 2x Lascannon, Twin heavy bolter, Volcano cannon, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Stormlord [460 pts]: Armoured tracks, 2x Heavy stubber, 2x Lascannon, Twin heavy bolter, Vulcan mega-bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Stormsword [495 pts]: Armoured tracks, 2x Lascannon, Stormsword siege cannon, Twin heavy bolter, 2 Twin Heavy Bolters (2x Twin heavy bolter)
Valkyrie [190 pts]: Armoured hull, Hellstrike missiles, Multi-laser
Wyvern [110 pts]: Armoured tracks, Wyvern quad stormshard mortar, Heavy bolter

## Dedicated Transport [240 pts]
Chimera [85 pts]: Armoured tracks, Lasgun array, Multi-laser, Heavy bolter
Taurox [65 pts]: Armoured tracks, Twin autocannon
Taurox Prime [90 pts]: Armoured tracks, Taurox battle cannon, Twin Taurox hot-shot volley gun

## Fortification [145 pts]
Aegis Defence Line [145 pts]`;

const TyranidsText = `Xenos - Tyranids - Nids - [2475pts]

# ++ Army Roster ++ [2475pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Unending Swarm
Show/Hide Options

## Epic Hero [80pts]
Deathleaper [80pts]: Lictor Claws and Talons

## Character [565pts]
Broodlord [80pts]: Broodlord Claws and Talons, Warlord
Hive Tyrant [235pts]: Monstrous Bonesword and Lash Whip, Monstrous Scything Talons
Neurotyrant [105pts]: Neurotyrant claws and lashes, Psychic scream
Parasite of Mortrex [80pts]: Barbed Ovipositor, Clawed Limbs
Winged Tyranid Prime [65pts]: Prime Talons

## Battleline [540pts]
Gargoyles [170pts]:
• 20x Gargoyles: Blinding Venom, Fleshborer
Hormagaunts [130pts]:
• 20x Hormagaunts: Hormagaunt talons
Termagants [120pts]:
• 20x Termagants: Chitinous Claws and Teeth, Fleshborer
Termagants [120pts]:
• 20x Termagants: Chitinous Claws and Teeth, Fleshborer

## Infantry [585pts]
Barbgaunts [55pts]:
• 5x Barbgaunt: Barblauncher, Chitinous claws and teeth
Biovores [50pts]:
• 1x Biovore [50pts]: Chitin-barbed Limbs, Spore Mine Launcher
Genestealers [150pts]:
• 10x Genestealer: Genestealers claws and talons
Genestealers [150pts]:
• 10x Genestealer: Genestealers claws and talons
Neurogaunts [45pts]:
• 1x Neurogant Nodebeast: Chitinous claws and teeth
• 10x Neurogaunt: Chitinous claws and teeth
Tyranid Warriors with Ranged Bio-Weapons [65pts]:
• 1x Tyranid Prime: Tyranid Warrior Claws and Talons, Venom Cannon
• 2x Tyranid Warrior: Tyranid Warrior Claws and Talons, Devourer
Von Ryan's Leapers [70pts]:
• 3x Von Ryan's Leaper: Leaper's Talons

## Monster [705pts]
Norn Assimilator [275pts]: Monstrous scything talons, Toxinjecter harpoon
Psychophage [95pts]: Psycholastic Torrent, Talons and Betentacled Maw
Screamer-killer [145pts]: Bio-plasmic Scream, Screamer-killer Talons
Tyrannofex [190pts]: Powerful Limbs, Stinger Salvoes, Rupture Cannon`;

const TyranidWeaponsText = `Xenos - Tyranids - 3/12 Nids - [1995 pts]

# ++ Army Roster ++ [1995 pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Invasion Fleet
Show/Hide Options

## Epic Hero [80 pts]
Deathleaper [80 pts]: Lictor claws and talons

## Character [435 pts]
Broodlord [95 pts]: Perfectly Adapted, Broodlord Claws and Talons
Hive Tyrant [235 pts]: Monstrous bonesword and lash whip, Heavy venom cannon
Neurotyrant [105 pts]: Warlord, Neurotyrant claws and lashes, Psychic scream

## Battleline [335 pts]
Gargoyles [85 pts]:
• 10x Gargoyles: Blinding venom, Fleshborer
Hormagaunts [65 pts]:
• 10x Hormagaunts: Hormagaunt talons
Hormagaunts [65 pts]:
• 10x Hormagaunts: Hormagaunt talons
Termagants [60 pts]:
• 10x Termagants: Chitinous claws and teeth, Fleshborer
Termagants [60 pts]:
• 10x Termagants: Chitinous claws and teeth, Fleshborer

## Infantry [460 pts]
Biovores [50 pts]:
• 1x Biovore [50 pts]: Chitin-barbed limbs, Spore mine launcher
Genestealers [150 pts]:
• 10x Genestealer: Genestealers claws and talons
Neurolictor [90 pts]: Piercing claws and talons
Von Ryan's Leapers [70 pts]:
• 3x Von Ryan's Leaper: Leaper's talons
Zoanthropes [100 pts]:
• 1x Neurothrope: Chitinous claws and teeth, Warp blast
• 2x Zoanthrope: Chitinous claws and teeth, Warp blast

## Monster [685 pts]
Haruspex [125 pts]: Grasping tongue, Ravenous maw, Shovelling claws
Norn Assimilator [275 pts]: Monstrous scything talons, Toxinjecter harpoon
Psychophage [95 pts]: Psycholastic torrent, Talons and betentacled maw
Tyrannofex [190 pts]: Powerful limbs, Stinger salvoes, Rupture cannon`;

const VotannText = `Xenos - Leagues of Votann - Votann Tester - [1520 pts]

# ++ Army Roster ++ [1520 pts]
## Configuration
Battle Size
Detachment Choice: Hearthband
Show/Hide Options

## Epic Hero [80 pts]
Ûthar the Destined [80 pts]: Blade of the Ancestors, Rampart crest, Volkanite disintegrator

## Character [260 pts]
Brôkhyr Iron-master [65 pts]: Graviton hammer, Graviton rifle
• 1x E-COG: Autoch-pattern bolt pistol, Close combat weapon
• 1x E-COG: Plasma torch
• 1x E-COG: Manipulator arms
• 1x Ironkyn Assistant: Close combat weapon, Las-beam cutter
Einhyr Champion [60 pts]: Autoch-pattern combi-bolter, Weavefield crest, Mass hammer
Grimnyr [65 pts]: Ancestral ward stave, Ancestral Wrath
• 2x CORV: Autoch-pattern bolter, Close combat weapon
Kâhl [70 pts]: Rampart crest, Forgewrought plasma axe, Autoch-pattern combi-bolter

## Battleline [100 pts]
Hearthkyn Warriors [100 pts]:
• 9x Hearthkyn Warrior: Autoch-pattern bolt pistol, Close combat weapon, Autoch-pattern bolter
• 1x Theyn: Close combat weapon, Weavefield crest, Autoch-pattern bolt pistol, Autoch-pattern bolter

## Infantry [420 pts]
Brôkhyr Thunderkyn [80 pts]:
• 3x Brôkhyr Thunderkyn: Close combat weapon, Bolt cannon
Cthonian Beserks [100 pts]:
• 5x Beserk: Heavy plasma axe
Einhyr Hearthguard [150 pts]:
• 1x Hesyr: Exo-armour grenade launcher, Weavefield crest, Concussion gauntlet, EtaCarn plasma gun
• 4x Einhyr Hearthguard: Exo-armour grenade launcher, Concussion gauntlet, EtaCarn plasma gun
Hernkyn Yaegirs [90 pts]:
• 10x Hernkyn Yaegir: Close combat weapon, Bolt shotgun

## Mounted [90 pts]
Hernkyn Pioneers [90 pts]:
• 3x Hernkyn Pioneer: Bolt revolver, Bolt shotgun, Magna-coil autocannon, Plasma knife

## Vehicle [225 pts]
Hekaton Land Fortress [225 pts]: Armoured wheels, MATR autocannon, Cyclic ion cannon, 2x Twin bolt cannon, Pan spectral scanner

## Dedicated Transport [345 pts]
Sagitaur [115 pts]: Armoured wheels, Twin bolt cannon, HYLas beam cannon
Sagitaur [115 pts]: Armoured wheels, Twin bolt cannon, L7 missile launcher and Sagitaur missile launcher
Sagitaur [115 pts]: Armoured wheels, Twin bolt cannon, MATR autocannon`;

const YnnariText = `Aeldari - Ynnari - Dhdb - [1995pts]

# ++ Army Roster ++ [1995pts]
## Configuration
Battle Size
Detachment
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Epic Hero [195pts]
Illic Nightspear [70pts]: Aeldari power sword, Shuriken Pistol, Voidbringer
Yvraine [125pts]: Kha-vir, the Sword of Sorrows, Storm of Whispers

## Character [145pts]
Farseer [80pts]: Eldritch Storm, Shuriken Pistol, Witchblade
Spiritseer [65pts]: Shuriken Pistol, Witch Staff

## Battleline [330pts]
Kabalite Warriors [110pts]:
• 9x Kabalite Warrior: Close Combat Weapon, Splinter rifle
• 1x Sybarite: Close Combat Weapon, Splinter Rifle
Kabalite Warriors [110pts]:
• 9x Kabalite Warrior: Close Combat Weapon, Splinter rifle
• 1x Sybarite: Close Combat Weapon, Splinter Rifle
Kabalite Warriors [110pts]:
• 9x Kabalite Warrior: Close Combat Weapon, Splinter rifle
• 1x Sybarite: Close Combat Weapon, Splinter Rifle

## Infantry [580pts]
Rangers [55pts]:
• 5x Ranger: Close Combat Weapon, Ranger long rifle, Shuriken Pistol
Rangers [55pts]:
• 5x Ranger: Close Combat Weapon, Ranger long rifle, Shuriken Pistol
Rangers [55pts]:
• 5x Ranger: Close Combat Weapon, Ranger long rifle, Shuriken Pistol
Troupe [75pts]:
• 1x Lead Player: Harlequin's Blade, Shuriken Pistol
• 4x Player: Harlequin's Blade, Shuriken Pistol
Wraithblades [340pts]:
• 10x Wraithblade: Ghostswords

## Mounted [185pts]
Shroud Runners [80pts]:
• 3x Shroud Runner: Close Combat Weapon, Ranger long rifle, Scatter Laser, Shuriken Pistol
Skyweavers [105pts]:
• 2x Skyweaver: Close Combat Weapon, Shuriken Cannon, Star Bolas

## Vehicle [350pts]
Falcon [130pts]: Pulse Laser, Wraithbone hull, Shuriken Cannon, Twin Shuriken Catapult
Ravager [110pts]: Bladevanes, 3x Dark Lance
Ravager [110pts]: Bladevanes, 3x Dark Lance

## Dedicated Transport [210pts]
Venom [70pts]: Bladevanes, Splinter Cannon, Twin Splinter Rifle
Venom [70pts]: Bladevanes, Splinter Cannon, Twin Splinter Rifle
Venom [70pts]: Bladevanes, Splinter Cannon, Twin Splinter Rifle`;

const WorldEatersText = `Chaos - World Eaters - This list is a MOE Proxy - [2000pts]

## Epic Hero [675pts]
Angron [435pts]: Samni’arius and Spinegrinder, Warlord
Khârn the Betrayer [100pts]: Gorechild, Khârn's plasma pistol
Lord Invocatus [140pts]: Bolt pistol, Coward's Bane, Juggernaught's bladed horn

## Battleline [490pts]
Jakhals [65pts]:
• 1x Jakhal Pack Leader: Autopistol, Jakhal chainblades
• 1x Dishonoured w/ skullsmasher: Skullsmasher, Icon of Khorne
  B: 1 mauler chainblade, 7 chainblades
• 7x Jakhal: Autopistol, Jakhal chainblades
• 1x Jakhal w/ mauler chainblade: Autopistol, Mauler chainblade
Jakhals [65pts]:
• 1x Jakhal Pack Leader: Autopistol, Jakhal chainblades
• 1x Dishonoured w/ skullsmasher: Skullsmasher, Icon of Khorne
  B: 1 mauler chainblade, 7 chainblades
• 7x Jakhal: Autopistol, Jakhal chainblades
• 1x Jakhal w/ mauler chainblade: Autopistol, Mauler chainblade
Khorne Berserkers [180pts]:
• 1x Khorne Berserker Champion: Berserker chainblade, Plasma pistol
• 7x Khorne Berserker: Berserker chainblade, Bolt pistol
• 1x Khorne Berserker w/ alternate weapons: Khornate eviscerator, Plasma pistol
• 1x Khorne Berserker w/ alternate weapons: Khornate eviscerator, Plasma pistol, Icon of Khorne
Khorne Berserkers [90pts]:
• 1x Khorne Berserker Champion: Berserker chainblade, Plasma pistol
• 3x Khorne Berserker: Berserker chainblade, Bolt pistol
• 1x Khorne Berserker w/ alternate weapons: Khornate eviscerator, Plasma pistol, Icon of Khorne
Khorne Berserkers [90pts]:
• 1x Khorne Berserker Champion: Berserker chainblade, Plasma pistol
• 3x Khorne Berserker: Berserker chainblade, Bolt pistol
• 1x Khorne Berserker w/ alternate weapons: Khornate eviscerator, Plasma pistol, Icon of Khorne

## Infantry [620pts]
Exalted Eightbound [310pts]:
• 5x Exalted Eightbound: Eightbound chainfist, Eightbound eviscerator
• 1x Exalted Eightbound Champion: Paired Eightbound chainfists
Exalted Eightbound [310pts]:
• 5x Exalted Eightbound: Eightbound chainfist, Eightbound eviscerator
• 1x Exalted Eightbound Champion: Paired Eightbound chainfists

## Beast [140pts]
World Eaters Chaos Spawn [70pts]:
• 2x Chaos Spawn: Hideous Mutations
World Eaters Chaos Spawn [70pts]:
• 2x Chaos Spawn: Hideous Mutations

## Dedicated Transport [75pts]
World Eaters Rhino [75pts]: Armoured tracks, 2x Combi-bolter, Havoc launcher`;

const CustodesShieldHost = `Imperium - Adeptus Custodes - Shield Host Test - [120 pts]

# ++ Army Roster ++ [120 pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachments: Shield Host
Show/Hide Options

## Character [120 pts]
Blade Champion [120 pts]: Vaultswords`;

const WraithbladeText = `Xenos - Aeldari - Aeldari Wraith - [1990 pts]

# ++ Army Roster ++ [1990 pts]
## Configuration
Battle Focus - Agile Manoeuvres
Battle Size: Strike Force (2000 Point limit)
Detachment: Spirit Conclave
Show/Hide Options

## Battleline [1020 pts]
Wraithblades [170 pts]:
• 5x Wraithblade: Ghostaxe and Forceshield`;

const PiranhasText = `Xenos - T'au Empire - Full - [605pts]

# ++ Army Roster ++ [605pts]
## Configuration
Battle Size: Onslaught (3000 Point limit)
Detachment: Mont'ka
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

Piranha [60pts]:
• 1x Piranhas [60pts]: Armoured hull, 2x Twin pulse carbine, Piranha fusion blaster, 2x Seeker missile`;

const NecronsText = `Xenos - Necrons - Tester - [8135pts]

# ++ Army Roster ++ [8135pts]
## Configuration
Battle Size
Detachment Choice
Show/Hide Options: Legends are visible

## Epic Hero [2070pts]
Anrakyr the Traveller [Legends] [95pts]: Tachyon arrow, Warscythe
C'tan Shard of the Deceiver [265pts]: Cosmic insanity, Golden fists
C'tan Shard of the Nightbringer [305pts]: Gaze of death, Scythe of the Nightbringer
C'tan Shard of the Void Dragon [300pts]: Canoptek tail blades, Spear of the Void Dragon, Voltaic storm
Illuminor Szeras [175pts]: Eldritch lance, Impaling legs
Imotekh the Stormlord [100pts]: Gauntlet of Fire, Staff of the Destroyer
Nemesor Zahndrekh [Legends] [85pts]: Staff of light
Orikan the Diviner [80pts]: Staff of Tomorrow
The Silent King [420pts]: Warlord
• 1x Szarekh: Sceptre of Eternal Glory, Staff of Stars, Weapons of the Final Triarch
• 2x Triarchal Menhir: Annihilator beam, Armoured bulk
Trazyn the Infinite [75pts]: Empathic Obliterator

## Character [1200pts]
Catacomb Command Barge [120pts]: Gauss cannon, Staff of light
Chronomancer [65pts]: Chronomancer's stave
Hexmark Destroyer [75pts]: Close combat weapon, Enmitic disintegrator pistols
Lokhust Lord [80pts]: Staff of light
Lord [Legends] [65pts]: Staff of light
Overlord [85pts]: Overlord's blade and tachyon arrow (Overlord's blade, Tachyon arrow)
Overlord with Translocation Shroud [85pts]: Overlord's blade, Resurrection orb
Plasmancer [60pts]: Plasmic lance
Psychomancer [55pts]: Abyssal lance
Royal Warden [50pts]: Close combat weapon, Relic gauss blaster
Skorpekh Lord [80pts]: Enmitic annihilator, Flensing claw, Hyperphase harvester
Technomancer [85pts]: Staff of light
Transcendant C'tan [295pts]: Crackling tendrils, Seismic assault

## Battleline [160pts]
Immortals [70pts]:
• 5x Immortal: Close combat weapon, Gauss blaster
Necron Warriors [90pts]:
• 10x Warrior w/ gauss flayer: Close combat weapon, Gauss flayer

## Infantry [540pts]
Cryptothralls [60pts]:
• 2x Cryptothrall: Scouring eye, Scythed limbs
Deathmarks [65pts]:
• 5x Deathmark: Close combat weapon, Synaptic disintegrator
Flayed Ones [60pts]:
• 5x Flayed One: Flayer claws
Lychguard [85pts]:
• 5x Lychguard: Warscythe
Ophydian Destroyers [80pts]:
• 3x Ophydian Destroyer: Ophydian hyperphase weapons
Skorpekh Destroyers [90pts]:
• 3x Skorpekh Destroyer: Skorpekh hyperphase weapons
Triarch Praetorians [100pts]:
• 5x Triarch Praetorian: Rod of covenant

## Swarm [40pts]
Canoptek Scarab Swarms [40pts]:
• 3x Canoptek Scarab Swarm: Feeder mandibles

## Mounted [165pts]
Lokhust Destroyers [35pts]:
• 1x Lokhust Destroyer: Close combat weapon, Gauss cannon
Lokhust Heavy Destroyers [55pts]:
• 1x Destroyer w/ enmitic exterminator [55pts]: Close combat weapon, Enmitic exterminator
Tomb Blades [75pts]:
• 3x Tomb Blade: Close combat weapon, Twin gauss blaster

## Beast [200pts]
Canoptek Acanthrites [Legends] [85pts]:
• 3x Canoptek Acanthrite: Cutting beam, Voidblade
Canoptek Wraiths [115pts]:
• 3x Wraith w/ claws: Vicious claws

## Monster [245pts]
Canoptek Tomb Sentinel [Legends] [115pts]: Exile cannon, Gloom prism, Tomb Sentinel claws
Canoptek Tomb Stalker [Legends] [130pts]: Gauss slicers, Gloom prism, Tomb Stalker claws

## Vehicle [3010pts]
Annihilation Barge [105pts]: Armoured bulk, Twin tesla destructor, Gauss cannon
Canoptek Doomstalker [145pts]: Doomsday blaster, Doomstalker limbs, Twin gauss flayer
Canoptek Reanimator [75pts]: 2x Atomiser beam, Reanimator's claws
Canoptek Spyders [75pts]:
• 1x Canoptek Spyder [75pts]: Automaton claws
Doom Scythe [230pts]: Armoured bulk, Heavy death ray, Twin tesla destructor
Doomsday Ark [190pts]: Armoured bulk, Doomsday cannon, 2x Gauss flayer array
Monolith [400pts]: Particle whip, Portal of exile, Four gauss flux arcs (4x Gauss flux arc)
Night Scythe [145pts]: Armoured bulk, Twin tesla destructor
Night Shroud [Legends] [140pts]: Armoured bulk, Twin tesla destructor
Obelisk [300pts]: Armoured bulk, 4x Tesla sphere
Seraptek Heavy Construct [540pts]: Titanic forelimbs, Two singularity generators (2x Singularity generator)
Tesseract Ark [Legends] [130pts]: Armoured bulk, Tesseract singularity chamber, Two tesla cannons (2x Tesla cannon)
Tesseract Vault [425pts]: Armoured bulk, C'tan Powers, 4x Tesla sphere
Triarch Stalker [110pts]: Stalker's forelimbs, Heat ray

## Dedicated Transport [115pts]
Ghost Ark [115pts]: Armoured bulk, 2x Gauss flayer array

## Fortification [390pts]
Convergence of Dominion [60pts]:
• 1x Convergence of Dominion Starstele [60pts]: Transdimensional abductor
Gauss Pylon [Legends] [210pts]: Gauss annihilator, Tesla arc
Sentry Pylon [Legends] [120pts]: Gauss exterminator`;

const Tau4225 = `Xenos - T'au Empire - 4/2/25 Tau - [2000 pts]

# ++ Army Roster ++ [2000 pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Detachment: Experimental Prototype Cadre
Show/Hide Options

## Epic Hero [95 pts]
Commander Farsight [95 pts]: Dawn Blade, High-intensity plasma rifle, Warlord

## Character [370 pts]
Cadre Fireblade [50 pts]: Close combat weapon, Fireblade pulse rifle, Marker Drone, Shield Drone
Cadre Fireblade [50 pts]: Close combat weapon, Fireblade pulse rifle
Commander in Coldstar Battlesuit [120 pts]: Fusion Blades, Cyclic ion blaster, 2x Fusion blaster, Battlesuit fists, Marker Drone, Shield Drone, Fusion blaster (Fusion Blades upgrade)
Commander in Enforcer Battlesuit [100 pts]: Thermoneutronic Projector, Cyclic ion blaster, 2x T'au flamer, Battlesuit fists, Marker Drone, Shield Drone, T'au flamer (Thermoneutronic Projector upgrade)
Kroot War Shaper [50 pts]: Kroot pistol, Shaper's blade, Dart-bow and tri-blade

## Battleline [200 pts]
Breacher Team [100 pts]:
• 1x Breacher Fire Warrior Shas'ui: Close combat weapon, Pulse blaster, Pulse pistol, Support turret, Guardian Drone, Gun Drone (Twin pulse carbine)
• 9x Breacher Fire Warriors: Close combat weapon, Pulse blaster, Pulse pistol
Breacher Team [100 pts]:
• 1x Breacher Fire Warrior Shas'ui: Close combat weapon, Pulse blaster, Pulse pistol, Support turret, Guardian Drone, Gun Drone (Twin pulse carbine)
• 9x Breacher Fire Warriors: Close combat weapon, Pulse blaster, Pulse pistol

## Infantry [405 pts]
Kroot Carnivores [65 pts]:
• 1x Long-quill: Close combat weapon, Kroot pistol, Kroot rifle
• 9x Kroot Carnivores: Close combat weapon, Kroot rifle
Pathfinder Team [90 pts]:
• 1x Pathfinder Shas'ui: Close combat weapon, Pulse carbine, Pulse pistol, Semi-automatic grenade launcher, Marker Drone, Gun Drone (Twin pulse carbine), Recon drone (Drone burst cannon)
• 9x Pathfinders w/ pulse carbine: Close combat weapon, Pulse carbine, Pulse pistol
Stealth Battlesuits [60 pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Fusion blaster, Marker Drone, Gun Drone (Twin pulse carbine)
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon
Stealth Battlesuits [60 pts]:
• 1x Stealth Shas'vre: Battlesuit fists, Battlesuit support system, Homing beacon, Fusion blaster, Marker Drone, Gun Drone (Twin pulse carbine)
• 2x Stealth Shas'ui w/ burst cannon: Battlesuit fists, Burst cannon
Vespid Stingwings [130 pts]:
• 1x Vespid Strain Leader: Neutron blaster, Oversight Drone, Stingwing claws
• 6x Vespid Stingwings w/ Neutron Blaster: Neutron blaster, Stingwing claws
• 1x Vespid Stingwings w/ Neutron Grenade Launcher: Neutron grenade launcher, Stingwing claws
• 1x Vespid Stingwings w/ Neutron Rail Rifle: Neutron rail rifle, Stingwing claws
• 1x Vespid Stingwings w/ T'au Flamer: Stingwing claws, T'au flamer

## Vehicle [845 pts]
Broadside Battlesuits [90 pts]:
• 1x Broadside Shas’vre: Crushing bulk, Heavy rail rifle
Crisis Starscythe Battlesuits [110 pts]:
• 1x Crisis Starscythe Shas’vre: 2x T'au flamer, Battlesuit fists, Marker Drone, Gun Drone (Twin pulse carbine)
• 2x Crisis Starscythe Shas’ui: 2x T'au flamer, Battlesuit fists, Marker Drone, Shield Drone
Crisis Sunforge Battlesuits [150 pts]:
• 1x Crisis Sunforge Shas’vre: 2x Fusion blaster, Battlesuit fists, Marker Drone, Gun Drone (Twin pulse carbine)
• 2x Crisis Sunforge Shas’ui: Battlesuit fists, 2x Fusion blaster, Marker Drone, Shield Drone
Ghostkeel Battlesuit [160 pts]: Ghostkeel fists, Battlesuit support system, Fusion collider, Twin T'au flamer
Hammerhead Gunship [145 pts]: Armoured hull, Railgun, 2x Seeker missile, 2 Smart missile systems (2x Smart missile system)
Riptide Battlesuit [190 pts]: Riptide fists, Ion accelerator, Twin smart missile system, 2x Missile Drone (Missile pod)

## Dedicated Transport [85 pts]
Devilfish [85 pts]: Accelerator burst cannon, Armoured hull, 2x Seeker missile, 2 Smart missile systems (2x Smart missile system)`;

const samplePreload = [
  {
    uuid: "8a776952-8b58-4fd8-99f6-5db83d484da4",
    text: TauText,
    name: "(Sample) 2K Tau List",
    units: [],
    phase: Phase.Command,
    faction: undefined,
    detachment: undefined,
    created: Date.now().toString(),
    updated: Date.now().toString(),
  },
];

const defaultObject = {
  units: [],
  textFormat: "nr",
  phase: Phase.Command,
  faction: undefined,
  detachment: undefined,
  created: Date.now().toString(),
  updated: Date.now().toString(),
};

const testingPreload = [
  ...samplePreload,
  {
    text: FNFTauText,
    name: "FNF Tau",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: NRTauText,
    name: "NR Tau",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: AncientInTerminatorArmorText,
    name: "Ancient in Terminator Armor",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: BroadsidesText,
    name: "Broadsides",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: CountTestList,
    name: "Count Test List",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: EnhancementsText,
    name: "Enhancements Test",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: DeathwatchText,
    name: "Deathwatch Test",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: LychguardText,
    name: "Lychguard Test",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: AdmechText,
    name: "Admech Test",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: SpaceMarinesText,
    name: "Space Marines Test",
    uuid: "47926d58-4daf-4201-90cf-0fc3e0326d6e",
    ...defaultObject,
  },
  {
    text: CKText,
    name: "Chaos Knights",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: EldarText,
    name: "Eldar",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: DemonsText,
    name: "Demons",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: GuardText,
    name: "Guard",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: TyranidsText,
    name: "Tyranids Default",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: TyranidWeaponsText,
    name: "Tyranids Weapons",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: VotannText,
    name: "Votann",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: YnnariText,
    name: "Ynnari",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: CSMText,
    name: "CSM",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: CustodesShieldHost,
    name: "Custodes Shield Host",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: PiranhasText,
    name: "Piranhas",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: WraithbladeText,
    name: "Wraithblade",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: NecronsText,
    name: "Necrons",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: InvalidText,
    name: "Invalid",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: Invalid2Text,
    name: "Invalid 2",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: WorldEatersText,
    name: "World Eaters",
    uuid: v4(),
    ...defaultObject,
  },
  {
    text: Tau4225,
    name: "Tau 4/2/25",
    uuid: v4(),
    ...defaultObject,
  },
];

export { samplePreload, testingPreload };
