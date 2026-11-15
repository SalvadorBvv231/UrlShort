# Recorta

Acortador de enlaces — proyecto de Programación Web (UVAQ).
Pega una dirección larga y obtén un enlace corto, con QR, historial y conteo de clics.

**Stack:** Next.js (App Router, TypeScript, Tailwind) · Prisma + `@prisma/adapter-pg` · Neon Postgres · Vercel.

## Funciones

- Acortar enlaces (códigos base62 de 5 caracteres, `node:crypto`) con validación http/https.
- Copiar el enlace y código QR (`qrcode`).
- `/[code]` redirige con 307 y suma un clic de forma atómica; 404 amigable.
- `/mis-enlaces`: historial del visitante (cookie anónima), búsqueda, copiar y eliminar.
- Diseño adaptable a computadora y celular.

## Cómo correrlo

```bash
npm install                 # también ejecuta `prisma generate` (postinstall)
cp .env.example .env        # y pega tus cadenas de Neon
npx prisma migrate deploy   # aplica las migraciones
npm run dev
```

Variables de entorno (ver `.env.example`):

| Variable       | Uso                                                              |
| -------------- | ---------------------------------------------------------------- |
| `DATABASE_URL` | Conexión **con pooler** de Neon (la usa la app en ejecución).    |
| `DIRECT_URL`   | Conexión **directa** de Neon (la usa el CLI de Prisma / migrate). |

## Propiedad de los enlaces (sin login)

En la primera visita `src/proxy.ts` crea una cookie anónima `recorta_owner` (UUID, `httpOnly`, `sameSite=lax`,
`secure` en producción). Cada enlace guarda ese `ownerId`; «Mis enlaces» solo muestra los del dueño y eliminar
se valida en el servidor.

## Participantes

Desarrollado por Salvador Bustamante Garnica.

El proyecto se planeó originalmente en pareja con Ángel Fernando González Alemán, quien dejó el proyecto.
