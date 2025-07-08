# AUTOMATION RELANCE PANIER – VERSION COMPLÈTE

Ce guide explique **pas à pas** comment mettre en place une automation de relance de paniers abandonnés en PHP, avec gestion multi-site, scénarios et étapes illimités, personnalisation avancée (UTM, bannières, coupons, contenus dynamiques), logs, sécurité, et bonnes pratiques e-commerce.

---

## 1. SQL TABLE STRUCTURE (ENGLISH, WITH FRENCH COMMENTS)

### 1.1. itekstats_relance_scenario
```sql
CREATE TABLE itekstats_relance_scenario (
  id_itekstats_relance_scenario INT AUTO_INCREMENT PRIMARY KEY,   -- Unique scenario ID
  name VARCHAR(255) NOT NULL,                                    -- Scenario name
  id_shop INT NOT NULL,                                          -- Shop ID
  active TINYINT(1) DEFAULT 1,                                   -- Active status
  date_add DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',      -- Creation date
  date_upd DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00'       -- Update date
);
```

### 1.2. itekstats_relance_scenario_step
```sql
CREATE TABLE itekstats_relance_scenario_step (
  id_itekstats_relance_scenario_step INT AUTO_INCREMENT PRIMARY KEY, -- Step unique ID
  id_itekstats_relance_scenario INT NOT NULL,                        -- Parent scenario reference
  position INT NOT NULL,                                             -- Send order (1, 2, 3...)
  delay INT NOT NULL,                                                -- Delay after abandonment
  delay_unit ENUM('hours','days') NOT NULL,                          -- Delay unit
  mail_title VARCHAR(255),                                           -- Email title
  mail_subject VARCHAR(255) NOT NULL,                                -- Email subject
  mail_preview VARCHAR(255),                                         -- Email preview text
  mail_content_top TEXT,                                             -- Email top content
  mail_content_bottom TEXT,                                          -- Email bottom content
  image_url VARCHAR(512),                                            -- Image/banner URL
  banner_link VARCHAR(512),                                          -- Banner link
  utm_source VARCHAR(64),                                            -- UTM source
  utm_medium VARCHAR(64),                                            -- UTM medium
  utm_campaign VARCHAR(64),                                          -- UTM campaign
  utm_term VARCHAR(64),                                              -- UTM term
  utm_content VARCHAR(64),                                           -- UTM content
  button_link VARCHAR(512),                                          -- Button link
  button_text VARCHAR(255),                                          -- Button text
  button_utm_source VARCHAR(64),                                     -- Button UTM source
  button_utm_medium VARCHAR(64),                                     -- Button UTM medium
  button_utm_campaign VARCHAR(64),                                   -- Button UTM campaign
  button_utm_term VARCHAR(64),                                       -- Button UTM term
  button_utm_content VARCHAR(64),                                    -- Button UTM content
  reduction_active TINYINT(1) DEFAULT 0,                             -- Coupon active (0/1)
  reduction_amount DECIMAL(10,2),                                    -- Discount amount
  reduction_type ENUM('percent','euro'),                             -- Discount type
  active TINYINT(1) DEFAULT 1,                                       -- Active status
  date_add DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',          -- Creation date
  date_upd DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',          -- Update date
  FOREIGN KEY (id_itekstats_relance_scenario) REFERENCES itekstats_relance_scenario(id_itekstats_relance_scenario) ON DELETE CASCADE -- Scenario link
);
```

### 1.3. itekstats_relance_scenario_mail
```sql
CREATE TABLE itekstats_relance_scenario_mail (
  id_itekstats_relance_scenario_mail INT AUTO_INCREMENT PRIMARY KEY, -- Mail log ID
  id_cart VARCHAR(255) NOT NULL,                                     -- Cart ID
  id_itekstats_relance_scenario_step INT NOT NULL,                   -- Step reference
  email_type INT NOT NULL,                                           -- Template ID used
  email VARCHAR(255),                                                -- Customer email
  coupon_code VARCHAR(64),                                           -- Used coupon code
  is_send TINYINT(1) DEFAULT 0,                                      -- Mail sent (0/1)
  is_open TINYINT(1) DEFAULT 0,                                      -- Mail opened (0/1)
  nb_opened INT DEFAULT 0,                                           -- Number of opens
  id_shop INT NOT NULL,                                              -- Shop ID
  date_add DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',          -- Creation date
  date_upd DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',          -- Update date
  FOREIGN KEY (id_itekstats_relance_scenario_step) REFERENCES itekstats_relance_scenario_step(id_itekstats_relance_scenario_step)      -- Step link
);
```

### 1.3bis. itekstats_relance_scenario_mail_click
```sql
CREATE TABLE itekstats_relance_scenario_mail_click (
  id_itekstats_relance_scenario_mail_click INT AUTO_INCREMENT PRIMARY KEY, -- Click log ID
  id_itekstats_relance_scenario_mail INT NOT NULL,                         -- Associated mail log
  click_url VARCHAR(1024) NOT NULL,                                        -- Clicked URL
  utm_source VARCHAR(64),                                                  -- UTM source
  utm_medium VARCHAR(64),                                                  -- UTM medium
  utm_campaign VARCHAR(64),                                                -- UTM campaign
  utm_term VARCHAR(64),                                                    -- UTM term
  utm_content VARCHAR(64),                                                 -- UTM content
  ip_address VARCHAR(64),                                                  -- IP address
  user_agent VARCHAR(255),                                                 -- User agent
  date_add DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',                -- Click date
  date_upd DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',                -- Update date
  FOREIGN KEY (id_itekstats_relance_scenario_mail) REFERENCES itekstats_relance_scenario_mail(id_itekstats_relance_scenario_mail)
);
```

### 1.4. itekstats_relance_scenario_coupon
```sql
CREATE TABLE itekstats_relance_scenario_coupon (
  id_itekstats_relance_scenario_coupon INT AUTO_INCREMENT PRIMARY KEY, -- Coupon ID
  id_cart VARCHAR(255) NOT NULL,                                       -- Cart ID
  id_itekstats_relance_scenario_step INT NOT NULL,                     -- Step reference
  coupon_code VARCHAR(64) NOT NULL,                                    -- Coupon code
  reduction_amount DECIMAL(10,2) NOT NULL,                             -- Discount amount
  reduction_type ENUM('percent','euro') NOT NULL,                      -- Discount type
  date_add DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',            -- Creation date
  date_expiration DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',     -- Expiration date
  used TINYINT(1) DEFAULT 0,                                           -- Used status
  id_shop INT NOT NULL,                                                -- Shop ID
  date_upd DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',            -- Update date
  FOREIGN KEY (id_itekstats_relance_scenario_step) REFERENCES itekstats_relance_scenario_step(id_itekstats_relance_scenario_step)
);
```

### 1.5. ps_itekstat_cart (modifications)
```sql
ALTER TABLE ps_itekstat_cart
  ADD COLUMN last_relance_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' AFTER is_sent,         -- Last reminder date
  ADD COLUMN relance_step INT DEFAULT 0 AFTER last_relance_at,    -- Reminder step reached
  ADD COLUMN relance_scenario INT DEFAULT NULL AFTER relance_step;-- Used scenario
```

- `is_treated` (tinyint) : déjà présent, indique si le panier a fini son parcours de relance.
- `is_sent` (tinyint) : déjà présent, indique si au moins une relance a été envoyée.
- `id_site` (int) : déjà présent, pour la gestion multi-site.

---

## 2. LOGIQUE MÉTIER DÉTAILLÉE

### 2.1. Détection des paniers abandonnés
- Un panier est **abandonné** si :
  - Il n'a pas été transformé en commande.
  - Il n'a pas été modifié depuis le délai défini dans le scénario (`delaiCreation`, `delaiCreationUnite`).
  - Il n'est pas déjà traité (`is_treated = 0`).

### 2.2. Application dynamique des scénarios et étapes
- Pour chaque site, on peut activer plusieurs scénarios (un seul actif à la fois par site conseillé).
- Chaque scénario contient un nombre illimité d'étapes, chacune avec :
  - Délai après abandon (ex : 4h, 24h, 2j...)
  - Contenus personnalisés (haut, bas, objet, aperçu, image, bannière, bouton, etc.)
  - Paramètres UTM pour tracking marketing
  - Option de coupon (montant, type, durée, code unique)
- À chaque étape, on vérifie si le délai est dépassé depuis la dernière relance ou l'abandon, et si l'étape n'a pas déjà été envoyée.

### 2.3. Génération dynamique des liens et contenus
- Les liens (bannière, bouton) sont enrichis avec les UTM de l'étape.
- Les contenus sont personnalisés avec les infos du panier, du client, du site, etc.
- Si un coupon est actif, il est généré et injecté dans le mail.

### 2.4. Gestion des coupons
- Si `reduction_active` est à 1, un code unique est généré (ou réutilisé si déjà existant pour ce panier/étape).
- Le code, le montant, le type et la date d'expiration sont stockés dans `itekstats_relance_scenario_coupon`.
- Le code est injecté dans le mail (ex : « Utilisez le code PANIER5 »).

---

## 3. SCRIPTS CRON PHP (EXEMPLES)

### 3.1. Cron 1 : Détection et planification des relances
À exécuter toutes les 15 minutes.

**Pseudo-code** :
```php
// Connexion à la BDD
// 1. Sélectionner les paniers abandonnés non traités
$sql = "SELECT * FROM ps_itekstat_cart WHERE is_treated = 0 AND ...";
foreach ($paniers as $panier) {
  // 2. Récupérer le scénario actif du site
  $scenario = getScenarioActif($panier['id_site']);
  if (!$scenario) continue;
  // 3. Récupérer l'étape suivante à envoyer
  $etape = getNextEtape($scenario, $panier['relance_step']);
  if (!$etape) continue;
  // 4. Vérifier si le délai est dépassé
  $dateRef = $panier['last_relance_at'] ?? $panier['created_at'];
  if (now() > $dateRef + délai de l'étape) {
    // 5. Planifier l'envoi (insertion dans itekstats_relance_scenario_mail)
    $log = [
      'id_cart' => $panier['id_cart'],
      'id_step' => $etape['id_step'],
      'date_envoi' => now(),
      'statut' => 'a_envoyer',
      'id_site' => $panier['id_site'],
      'email' => getEmailClient($panier['id_cart'])
    ];
    insertRelanceMail($log);
    // 6. Mettre à jour le panier
    updatePanierRelance($panier['id_cart'], $etape['position'], now(), $scenario['id_itekstats_relance_scenario']);
  }
}
```

### 3.2. Cron 2 : Envoi des mails de relance
À exécuter toutes les 5 minutes.

**Pseudo-code** :
```php
// Connexion à la BDD
// 1. Sélectionner les relances à envoyer
$sql = "SELECT * FROM itekstats_relance_scenario_mail WHERE statut = 'a_envoyer'";
foreach ($relances as $relance) {
  $etape = getStep($relance['id_itekstats_relance_scenario_step']);
  $panier = getPanier($relance['id_cart']);
  $client = getClient($panier['id_contact']);
  // 2. Générer le contenu du mail (avec UTM, coupon, etc.)
  $mail = genererMailRelance($etape, $panier, $client);
  // 3. Envoyer le mail (PHPMailer, etc.)
  $ok = envoyerMail($client['email'], $mail);
  // 4. Mettre à jour le log
  updateRelanceMail($relance['id_itekstats_relance_scenario_mail'], $ok ? 'envoye' : 'echec', now(), $ok ? null : 'Erreur d'envoi');
  // 5. Mettre à jour le panier
  if ($ok) {
    updatePanierRelanceStep($panier['id_cart'], $etape['position'], now());
    if (isLastStep($etape, $panier['relance_scenario'])) {
      markPanierTreated($panier['id_cart']);
    }
  }
}
```

**À adapter selon votre framework et vos conventions.**

---

## 4. GESTION MULTI-SITE ET PERSONNALISATION

- Chaque site (`id_shop`) peut avoir ses propres scénarios, étapes, contenus, images, UTM, coupons, etc.
- Les mails sont dynamiques : tous les champs de l'étape/scénario sont injectés dans le template.
- Les filtres dans l'interface permettent de gérer les scénarios par site.
- Les statistiques (taux de conversion, nombre de paniers relancés, etc.) sont calculées par site/scénario/étape.

---

## 5. SÉCURITÉ, RGPD, BONNES PRATIQUES

- **Sécuriser les scripts cron** (IP whitelist, clé secrète, etc.)
- **Logger tous les envois et erreurs** dans `itekstats_relance_scenario_mail` (utile pour le support et la conformité RGPD)
- **Prévoir un lien de désinscription** dans chaque mail (table blacklist à prévoir)
- **Respecter la durée de conservation des logs** (purge régulière)
- **Tester sur un environnement de préproduction** avant la mise en production
- **Limiter le nombre de mails envoyés par client/jour** (anti-spam)

---

## 6. EXEMPLE DE WORKFLOW COMPLET

1. Un client abandonne son panier sur le site 2.
2. Le cron détecte le panier, trouve le scénario actif du site 2.
3. Après 2h, le cron planifie la première relance (étape 1 : mail de rappel).
4. Le cron d'envoi envoie le mail, log l'action, met à jour le panier.
5. Après 10h, le cron planifie la deuxième relance (étape 2 : mail avec coupon 5%).
6. Après 2 jours, le cron planifie la troisième relance (étape 3 : mail « dernière chance » avec coupon 10%).
7. Après la dernière étape, le panier est marqué comme traité (`is_treated = 1`).
8. Toutes les actions sont tracées dans `itekstats_relance_scenario_mail` et les coupons dans `itekstats_relance_scenario_coupon`.

---

## 7. ANNEXES ET ASTUCES

- **Pour l'envoi des mails** : utiliser PHPMailer, Symfony Mailer ou un service transactionnel (Mailjet, Sendgrid...)
- **Pour la génération des coupons** : prévoir une fonction qui génère un code unique, stocke la date d'expiration, et vérifie l'utilisation.
- **Pour la personnalisation** : utiliser des templates HTML avec variables (Twig, Blade, ou simple str_replace).
- **Pour la désinscription** : ajouter un lien unique par mail, qui ajoute l'email à une table `relance_blacklist`.
- **Pour le reporting** : croiser les logs avec les commandes pour calculer le taux de conversion.

---

## 8. RÉSUMÉ DES CHAMPS DISPONIBLES PAR ÉTAPE

- Délai (heures/jours)
- Objet, titre, texte aperçu
- Contenu haut, contenu bas
- Image, bannière, liens, UTM (tous champs)
- Bouton (texte, lien, UTM)
- Coupon (actif, montant, type, durée, code)
- Statut (actif/inactif)

---

**Visuels et interface** : voir les captures d'écran pour l'UX attendue (gestion des scénarios, étapes, édition, etc).

**Auteur** : Généré par IA, à adapter selon vos besoins spécifiques. Pour toute question ou exemple de code PHP détaillé, demandez ! 