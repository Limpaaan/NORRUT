# NORRUT! 0.3 — bildmaterial och animation

Projektets bildfiler finns i `public/art/landscape.webp`, `public/art/parts.webp` och `public/art/foliage.webp`. De skapades med den inbyggda bildgeneratorn, med användarens andra uppladdade konceptbild som stilreferens. PNG-originalen är bevarade. WebP-filerna är webboptimerade kopior med bibehållen alfakanal för delarna och lövverket.

Det här är illustrerad och schematisk spelgeografi. Miljöbilden är ingen verifierad utsikt från Östbergs parkering.

## Slutprompter till den inbyggda bildgeneratorn

### Miljö

Use case: stylized-concept. Asset type: production game background panorama for a 2D side-scrolling Swedish flying game. Input image is STYLE AND ENVIRONMENT REFERENCE ONLY, not a UI to reproduce. Create a new very wide 16:9 richly detailed painterly semi-realistic Nordic indie game landscape matching its quality and sunny daylight, blue Swedish sky with gorgeous fluffy clouds in upper 45%, wooded Avesta hills with the old brick industrial ironworks and tall chimney in middle distance center-left, Dalälven reflective river stretching horizontally across the lower middle, small red timber houses with white trim on far right shore, large painted red Dala horse on distant right hill. Asphalt parking foreground occupies lower 15% of canvas with white parking lines and concrete curbstones. IMPORTANT entirely remove ALL UI, HUD, lettering, logos, signage, pilots, aircraft, ramps, vehicles and close foreground tree branches from the composition; no text anywhere. This is only environment scenery, NOT a screenshot or menu, with empty launch space at left lower third. No airplane anywhere. Crisp luminous natural textures, hand-painted game art, no flat vector shapes, no low-poly, no pixel art. Do not add foreground obstructions. Highest detail. Produce a clean landscape suitable behind independent animated sprites.

### Farkostdelar

Use case: stylized-concept. Asset type: transparent production game sprite PARTS ATLAS, a square canvas divided into EXACT 2 columns and 2 rows of equal square cells, four separate objects on true transparent alpha, NO grid lines, NO text. Input image is STYLE REFERENCE: detailed hand-painted semi-realistic homemade early aircraft, brown leather, ivory stitched canvas, bamboo and steel. EVERY object faces RIGHT, exact flat side view, not perspective, fully within its cell with 8% transparent margin. TOP LEFT cell: entire homemade ultralight airplane chassis INCLUDING large ivory fabric overhead wing, bamboo struts and fuselage, rear motor, small Swedish flag badge, no text. Critically NO pilot, NO wheels, NO propeller anywhere on this chassis; leave open cockpit space. Nose points right. Wing spans mostly horizontally. TOP RIGHT cell: a separate seated early aviator pilot facing right, leather cap, goggles, dark jacket, hands forward on controls, cropped neatly as complete seated torso and legs, NO scarf tails, NO aircraft. BOTTOM LEFT cell: ONE isolated detailed spoked aircraft wheel, circular perfectly side-on with dark rubber tire and metal spokes, centered. BOTTOM RIGHT cell: ONE isolated two-blade wooden airplane propeller, long axis vertical, front-on narrow side sprite, centered. Equal cell sizes. All four parts have consistent sunny upper-left lighting and realistic painted textures matching the reference. Absolutely transparent background, no shadows behind objects, no scenery, no white/checkerboard baked background. Objects never cross cell boundaries.

Resultatet fick ojämna celler. Spelet använder därför manuellt avgränsade ramar i Phaser i stället för att förutsätta ett jämnt rutnät.

### Lövverk

Use case: stylized-concept. Asset type: transparent foreground overlay for a 2D Swedish indie game, wide landscape frame. Use supplied picture ONLY as reference for detailed painted foliage quality. Paint a graceful birch branch entering from upper-left corner extending along top edge with many small luminous green summer leaves, plus low bushes in the bottom-left and bottom-right corners; keep the ENTIRE central 75% of the canvas completely transparent and keep right upper corner empty. True alpha transparency around and between all leaves. Natural sunlight, rich semi-realistic hand-painted texture, subtle depth, not vector. No background sky, no buildings, no scenery, no UI, no lettering, no aircraft. Branches and foliage only, clean edges.

## Animationer i spelet

Fristående pilot, hjul, propeller och vingdel. Propellern svarar på motordrift, hjulen roterar, pilotens kropp rör sig, halsduken fladdrar och vingen flexar. Start, boost och landning har särskilda rörelser och partiklar. Björklöv och vattenreflexer rör sig med olika hastigheter. Inställningen Minska dekorativa rörelser dämpar dessa utan att ändra fysiken. Rörelserna är kodstyrd animation av separata bilder, inte en förinspelad video.
