# Cart redesign proposal (2026-11-09)
Owner asked for a cart page that is attractive, calm and professional. Built from the owner's own cart screenshots (same items and prices).
Open `cart.html` in a browser (phone width). Thumbnails are crops of the owner's screenshots.
Changes vs the current cart: one accent (brand gold) + black primary button instead of blue/green/red/orange; light cards, no thick
coloured frames; add-on services (screen protector, case) grouped under the device they belong to; accessories as compact rows;
discount code, address, one order summary (delivery «مجاني» in green); one sticky total + «إتمام الطلب» button; light upsell row at the end.

## v2 (`cart_v2.html`) — owner asked for something nicer
Luxury black header with a gold glow showing the order total and chips (free delivery, all provinces, instalments);
white sheet with rounded top, 3-segment progress; hero card for the device with spec chips and on/off toggles for its
protection services; accessories list; ticket-shaped code field; address card; receipt-style summary with a torn edge;
trust row (delivery, cash/instalments, WhatsApp support); upsell row; floating black pay bar with a gold «إتمام الطلب».

## v3 «Black Edition» (`cart_v3.html`) — owner asked for even more luxury
Fully dark page (#09090B) with soft gold glows, glass cards with hairline edges, the device card framed by a gold gradient
border, ivory product tiles, light-weight titles with heavy gold numbers, gold progress line for free delivery, «باقة الحماية»
with gold checks, gold-outline code field and buttons, gold-gradient text for the total, trust tiles, and a floating
gold-gradient «إتمام الطلب» button with a shine and «دفع آمن عبر جي فاير للموبايل».

## v4 light themes — owner: «مش اسود، ابيض وذهبي او ابيض وازرق»
Same v3 layout on white, two themes from one stylesheet (CSS variables): `cart_v4_gold.html` (brand gold #F3B406, dark text on
the gold button) and `cart_v4_blue.html` (the site's blue #1F6FD1, white text on the blue button). Soft accent glow at the top,
white cards with soft shadows, accent-gradient border on the device card, dashed accent code field, accent pay button with shine.
