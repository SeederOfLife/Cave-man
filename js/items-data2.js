"use strict";
// ---------- item catalog 2/2: defense (16) · speed (7) · tools/actives (6) ----------
const ITEMS_DEF=[
 {id:'d01',name:'BEAR CLOAK',     from:['hide','hide'],  cost:{sinew:1},   s:{hp:4},              fx:'+2 HEARTS'},
 {id:'d02',name:'BONE WALL',      from:['bone2','hide'], cost:{bone:1},    s:{hp:2,blockcd:12},   fx:'+1 HEART · BLOCKS A HIT (12S)'},
 {id:'d03',name:'LIVING ROOT',    from:['hide','haft'],  cost:{wood:1},    s:{regen:1},           fx:'HEALS 1 EVERY 20S'},
 {id:'d04',name:'THORN SHELL',    from:['hide','fang2'], cost:{fang:1},    s:{thorns:1,hp:2},     fx:'+1 HEART · BITERS BLEED'},
 {id:'d05',name:"GROK'S GIFT",    from:['hide','cord'],  cost:{sinew:1},   s:{hp:2,hungerslow:.25},fx:'+1 HEART · HUNGER BITES SLOWER'},
 {id:'d06',name:'SLAB SKIN',      from:['hide','flint2'],cost:{flint:1},   s:{blockcd:9},         fx:'BLOCKS A HIT EVERY 9S'},
 {id:'d07',name:'MOUNTAIN HEART', from:['hide','glass'], cost:{obsidian:1},s:{hp:2,spirit:1},     fx:'+1 HEART · +1 SKILL DMG'},
 {id:'d08',name:'ANCESTOR TOTEM', from:['bone2','cord'], cost:{bone:2},    s:{revive:1},          fx:'RISE ONCE FROM THE BONES'},
 {id:'d09',name:'WARM FUR',       from:['hide','plume'], cost:{feather:1}, s:{hp:2,mv:.05},       fx:'+1 HEART · +5% MOVE'},
 {id:'d10',name:'STONE GUARD',    from:['bone2','flint2'],cost:{flint:1},  s:{thorns:1,dmg:1},    fx:'+1 DMG · BITERS BLEED'},
 {id:'d11',name:'DEEP ROOTS',     from:['haft','hide'],  cost:{wood:1},    s:{regen:1,hp:2},      fx:'+1 HEART · HEALS OVER TIME'},
 {id:'d12',name:'TRIBE BANNER',   from:['cord','hide'],  cost:{sinew:1},   s:{hp:2,ultrate:.1},   fx:'+1 HEART · WRATH CHARGES FASTER'},
 {id:'d13',name:'UNBROKEN JAW',   from:['bone2','fang2'],cost:{bone:1},    s:{hp:2,dmg:1},        fx:'+1 HEART · +1 DMG'},
 {id:'d14',name:'CAVE SHELL',     from:['hide','bone2'], cost:{sinew:1},   s:{hp:4,hungerslow:.1},fx:'+2 HEARTS · EATS LESS'},
 {id:'d15',name:"URM'S PATIENCE", from:['bone2','glass'],cost:{obsidian:1},s:{blockcd:10,ultrate:.15},fx:'BLOCKS HITS · WRATH FASTER'},
 {id:'d16',name:'LAST STAND',     from:['hide','fang2'], cost:{sinew:1},   s:{hp:2,lowbuff:2},    fx:'+1 HEART · +2 DMG WHEN BLOODIED'},
];
const ITEMS_MOVE=[
 {id:'v01',name:'SWIFT WRAPS',   from:['plume','cord'],  cost:{feather:1},s:{mv:.1},            fx:'+10% MOVE'},
 {id:'v02',name:'WIND SANDALS',  from:['plume','plume'], cost:{feather:2},s:{mv:.18},           fx:'+18% MOVE'},
 {id:'v03',name:'RIVER STRIDER', from:['plume','hide'],  cost:{sinew:1},  s:{mv:.08,waterwalk:1},fx:'+8% MOVE · WATER IS A ROAD'},
 {id:'v04',name:'GHOST STEP',    from:['plume','glass'], cost:{obsidian:1},s:{mv:.1,cdr:.1},    fx:'+10% MOVE · SKILLS COOL FASTER'},
 {id:'v05',name:"HUNTER'S PACE", from:['plume','haft'],  cost:{wood:1},   s:{mv:.08,aspd:.1},   fx:'+8% MOVE · +10% THROW'},
 {id:'v06',name:'CHARGING TUSK', from:['plume','fang2'], cost:{fang:1},   s:{mv:.1,dmg:1},      fx:'+10% MOVE · +1 DMG'},
 {id:'v07',name:'HERD RUNNER',   from:['plume','bone2'], cost:{bone:1},   s:{mv:.14,hp:2},      fx:'+14% MOVE · +1 HEART'},
];
const ITEMS_TOOLS=[
 {id:'bola', name:'BOLA',          from:['cord','bone2'], cost:{bone:1},   s:{},active:1,cd:4, fx:'TOOL [1/2] · SNARES BEASTS'},
 {id:'dart', name:'OBSIDIAN DART', from:['glass','plume'],cost:{obsidian:1},s:{},active:1,cd:5, fx:'TOOL [1/2] · PIERCING SNIPE'},
 {id:'fist', name:"URM'S FIST",    from:['glass','bone2'],cost:{bone:1},   s:{},active:1,cd:7, fx:'TOOL [1/2] · GROUND SLAM'},
 {id:'ember',name:'EMBER OF URM',  from:['haft','glass'], cost:{wood:1},   s:{},active:1,cd:6, fx:'TOOL [1/2] · FIRE BURST'},
 {id:'shield',name:'SHIELD STONE', from:['hide','bone2'], cost:{sinew:1},  s:{},active:1,cd:14,fx:'TOOL [1/2] · 2S OF STONE SKIN'},
 {id:'decoy',name:'BONE DECOY',    from:['bone2','plume'],cost:{feather:1},s:{},active:1,cd:12,fx:'TOOL [1/2] · BEASTS CHASE THE BONES'},
];
const SHOP_TABS=[
 {name:'FURY',  list:ITEMS_PHYS},
 {name:'SPIRIT',list:ITEMS_MAGIC},
 {name:'HIDE',  list:ITEMS_DEF},
 {name:'WIND',  list:ITEMS_MOVE},
 {name:'TOOLS', list:ITEMS_TOOLS},
];
const ITEM_BY_ID={};
for(const c of COMPS)ITEM_BY_ID[c.id]=c;
for(const t of SHOP_TABS)for(const it of t.list)ITEM_BY_ID[it.id]=it;
const ACD_MAX={};
for(const it of ITEMS_TOOLS)ACD_MAX[it.id]=it.cd;
