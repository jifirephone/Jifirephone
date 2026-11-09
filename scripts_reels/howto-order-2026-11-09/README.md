# How to order from the app + 25k discount + free delivery (started 2026-11-09)
Owner brief: a tutorial like the Facebook reference (refs/ref5_fb.mp4, gitignored; technique only: dark glowing UI cards,
tap cursor, success checks, kinetic labels) using the owner's real site, applying the discount and ordering.

Captured from https://jifirephone.com on a phone viewport (Playwright, iPhone 13), `work/howto/shots/` (gitignored):
home banner (25,000 / J2026), product 17 Pro Max (physical SIM, 256GB, orange, 2,100,000 IQD, was 2,200,000),
offer box (j2026, timer, «استخدام كود الخصم» → «تم إدخال كود الخصم ✓»), add to cart, cart (j2026 −25,000 → 2,075,000,
«التوصيل مجاني لجميع محافظات العراق»), checkout = phone sign-in with a WhatsApp code.
**No order was placed**: checkout needs a real phone number + OTP, and a real order is an outward action the owner must do.

Store check (Shopify, read-only, 2026-11-09): j2026 = 25,000 IQD, min 200,000, **ends 2026-11-09T21:00Z (10/11 00:00 Baghdad)**.
A video published after that advertises an expired code: the VO says «كود الخصم» (no code name) so only the on-screen code changes.
Price note: the site shows 17 Pro Max 2,100,000; the owner's offer ad uses «يبدي من 1,950,000».

Script (voicecheck PASS, Iraqi 100 %, hook «تريد خصم خمسة وعشرين ألف؟» 78 STRONG, ~25 s, loop on «خصم خمسة وعشرين ألف»): vo_script.txt
