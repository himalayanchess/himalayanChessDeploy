// src/app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs"; // Force Node.js runtime

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
