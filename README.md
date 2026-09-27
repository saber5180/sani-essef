# STE SANI-ESSEF

Boutique Next.js pour le showroom STE SANI-ESSEF à Ksour Essef : carrelage, revêtements et équipements de maison.

## Démarrage

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Administration : `/admin`  
Email : `admin@sani-essef.tn`

La base PostgreSQL se configure avec `DATABASE_URL` (Neon). Sans cette variable, le site utilise `data/db.json`.

## Déploiement

Renseigner `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans les variables d'environnement de l'hébergeur.
