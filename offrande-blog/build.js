import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const root = process.cwd();
const contentDir = path.join(root, 'content', 'posts');
const distDir = path.join(root, 'dist');
const adminDir = path.join(root, 'admin');
const srcDir = path.join(root, 'src');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'articles'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'admin'), { recursive: true });

const allPosts = fs.readdirSync(contentDir)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data, content } = matter(raw);
    const plain = content.replace(/[#>*_`\-]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plain ? plain.split(' ').length : 0;
    return {
      ...data,
      body: md.render(content),
      excerpt: data.intro || '',
      file,
      status: data.status || 'published',
      readingTime: Math.max(1, Math.ceil(words / 220))
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const posts = allPosts.filter((post) => post.status !== 'draft');
const featured = posts.slice(0, 3);

const site = {
  title: "L'Offrande Vivante",
  description: 'Blog personnel faceless dédié à la vie consacrée, à la foi chrétienne, aux leçons de vie et au discernement.',
  url: '',
  tagline: 'Une présence discrète, une parole assumée.',
  subtitle: 'Foi chrétienne · Consécration · Discernement · Sanctification'
};

function escapeHtml(str='') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date(dateStr + 'T12:00:00'));
}

function layout({ title, description = site.description, content, current = '' }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | ${escapeHtml(site.title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Cinzel:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="/">
        <span class="brand-mini">L'</span>
        <span class="brand-main">OFFRANDE VIVANTE</span>
        <span class="brand-sub">Blog personnel faceless</span>
      </a>
      <button class="menu-toggle" type="button" aria-label="Ouvrir le menu">☰</button>
      <nav class="site-nav">
        <a href="/" ${current==='home'?'aria-current="page"':''}>Accueil</a>
        <a href="/articles/" ${current==='articles'?'aria-current="page"':''}>Articles</a>
        <a href="/a-propos/" ${current==='about'?'aria-current="page"':''}>À propos</a>
        <a href="/contact/" ${current==='contact'?'aria-current="page"':''}>Contact</a>
      </nav>
    </div>
  </header>
  <main>${content}</main>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p class="footer-title">${site.title}</p>
      <p>${site.tagline}</p>
      <p class="footer-small">Déployable sur Netlify · Formulaires intégrés · Admin éditable avec prévisualisation · Version premium claire</p>
    </div>
  </footer>
  <script src="/main.js"></script>
</body>
</html>`;
}

function articleCard(post) {
  return `<article class="post-card">
    <p class="eyebrow">${escapeHtml(post.cat || 'Article')}</p>
    <h3><a href="/articles/${escapeHtml(post.slug)}/">${escapeHtml(post.titre)}</a></h3>
    <p class="post-meta">${formatDate(post.date)} · ${escapeHtml(post.verset || '')} · ${post.readingTime} min</p>
    <p>${escapeHtml(post.excerpt)}</p>
    <a class="read-more" href="/articles/${escapeHtml(post.slug)}/">Lire l'article →</a>
  </article>`;
}

function newsletterForm() {
  return `<section class="form-section" id="newsletter">
    <div class="container narrow">
      <p class="section-kicker">Newsletter</p>
      <div class="quote-panel">
        <h2>Recevoir les nouveaux articles</h2>
        <p>Ce formulaire est connecté à Netlify Forms. Tu peux donc récupérer les inscriptions et les messages sans backend supplémentaire.</p>
        <form name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/merci/" class="stack-form card-form">
          <input type="hidden" name="form-name" value="newsletter" />
          <p class="hidden"><label>Ne pas remplir <input name="bot-field" /></label></p>
          <label>Email
            <input type="email" name="email" placeholder="ton@email.com" required />
          </label>
          <button type="submit">S'inscrire</button>
        </form>
        <p class="notice">Les inscriptions seront visibles dans l'onglet Forms de Netlify après le premier déploiement.</p>
      </div>
    </div>
  </section>`;
}

const homeContent = `
<section class="hero">
  <div class="container hero-grid">
    <div class="card hero-main">
      <div class="private-badge">Version premium · blanc éditorial · féminin haut de gamme</div>
      <p class="section-kicker">${site.subtitle}</p>
      <h1><span>L'Offrande Vivante</span>, un blog personnel premium, lumineux et profondément habité</h1>
      <p class="lead">Un espace de lecture délicat et affirmé pour parler de foi chrétienne, de vie consacrée, de discernement, de féminité, de guérison intérieure et de transformation, avec sobriété, pudeur et beauté.</p>
      <div class="hero-actions">
        <a class="btn" href="/articles/">Découvrir les articles</a>
        <a class="btn btn-secondary" href="/admin/">Écrire depuis l'admin</a>
      </div>
      <div class="tag-row">
        <span class="pill-tag">Direction artistique claire</span>
        <span class="pill-tag">Blog faceless crédible</span>
        <span class="pill-tag">Publication simple</span>
        <span class="pill-tag">Aperçu avant mise en ligne</span>
      </div>
    </div>
    <aside class="hero-box">
      <div>
        <p class="small-label">Manifeste</p>
        <h3>Écrire avec présence, sans surexposition</h3>
        <p>Le blog protège l'identité visuelle tout en construisant une voix forte, cohérente et reconnaissable. L'esthétique reste douce, mais le positionnement est net.</p>
        <div class="decor-line"></div>
        <div class="meta-row">
          <span class="mini-tag">Voix faceless</span>
          <span class="mini-tag">Foi chrétienne</span>
          <span class="mini-tag">Discernement</span>
        </div>
      </div>
      <div>
        <p class="verse">« Offrez votre corps comme un sacrifice vivant. »</p>
        <p class="verse-ref">Romains 12:1</p>
      </div>
    </aside>
  </div>
</section>
<section class="section">
  <div class="container metrics-grid">
    <div class="metric"><strong>Premium</strong><span>Une esthétique éditoriale élégante</span></div>
    <div class="metric"><strong>Clair</strong><span>Palette blanche, crème et or</span></div>
    <div class="metric"><strong>Simple</strong><span>Admin pratique et mobile</span></div>
    <div class="metric"><strong>Rapide</strong><span>Statique, léger et prêt à déployer</span></div>
  </div>
</section>
<section class="section alt">
  <div class="container premium-grid">
    <div class="editorial-card">
      <p class="section-kicker">Note éditoriale</p>
      <h2>Un lieu de beauté, de vérité et de maturation intérieure</h2>
      <p>Le site ne sert pas seulement à publier. Il crée un cadre de lecture crédible, inspirant et durable, pour que chaque article respire la cohérence, la douceur et l'autorité.</p>
      <p>La lumière, les espacements, les typos et les cartes ont été retravaillés pour donner un rendu plus haut de gamme sans alourdir l'expérience.</p>
    </div>
    <div class="premium-card">
      <p class="section-kicker">Fonctionnalités</p>
      <h3>Tout reste simple à gérer</h3>
      <ul class="list">
        <li>Publication d'articles via <strong>/admin</strong></li>
        <li>Prévisualisation avant publication</li>
        <li>Formulaires Netlify pour contact et newsletter</li>
        <li>Blog public qui masque les brouillons</li>
        <li>Déploiement sur domaine gratuit <strong>.netlify.app</strong></li>
      </ul>
      <a class="text-link" href="/contact/">Préparer le lancement →</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="section-kicker">Sélection</p>
        <h2>Articles mis en avant</h2>
      </div>
      <p>Une vitrine éditoriale pour montrer immédiatement le ton, la profondeur et l'univers du blog.</p>
    </div>
    <div class="posts-grid">
      ${featured.map(articleCard).join('')}
    </div>
  </div>
</section>
<section class="section alt">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="section-kicker">Univers du blog</p>
        <h2>Des thèmes clairs, une voix identifiable</h2>
      </div>
      <p>Le design premium soutient plusieurs familles de contenu sans perdre l'unité du projet.</p>
    </div>
    <div class="theme-list">
      <div class="theme-card">
        <p class="section-kicker">Foi</p>
        <h3>Sanctification et vie intérieure</h3>
        <p>Des textes qui parlent du corps, de l'âme, de l'esprit, de la consécration et du cheminement avec Dieu.</p>
      </div>
      <div class="theme-card">
        <p class="section-kicker">Discernement</p>
        <h3>Regarder le monde avec lucidité</h3>
        <p>Des réflexions sur l'époque, la confusion, la pudeur, la vigilance intérieure et l'alignement.</p>
      </div>
      <div class="theme-card">
        <p class="section-kicker">Féminité</p>
        <h3>Une parole douce mais ferme</h3>
        <p>Une voix féminine sobre, pudique et assumée, sans exhibition, mais sans effacement non plus.</p>
      </div>
      <div class="theme-card">
        <p class="section-kicker">Leçons de vie</p>
        <h3>Transformer l'attente et les saisons lentes</h3>
        <p>Des articles sur la guérison, l'espérance, les recommencements, les échecs transformés et la croissance.</p>
      </div>
    </div>
  </div>
</section>
<section class="section">
  <div class="container story-grid">
    <div class="story-card">
      <p class="section-kicker">Positionnement</p>
      <h3>Une présence discrète, une autorité réelle</h3>
      <p>Le blog reste faceless tout en donnant confiance : le fond, la structure et la cohérence remplacent la surexposition.</p>
    </div>
    <div class="story-card">
      <p class="section-kicker">Croissance</p>
      <h3>Publier régulièrement sans dépendre d'un développeur</h3>
      <p>Après le déploiement sur Netlify, tu peux créer et publier tes textes de manière autonome grâce à l'admin intégré.</p>
    </div>
  </div>
</section>
${newsletterForm()}`;

const articlesIndex = `
<section class="page-intro">
  <div class="container narrow">
    <p class="section-kicker">Bibliothèque</p>
    <h1>Tous les articles</h1>
    <p>Les articles publiés apparaissent ici automatiquement. Les brouillons restent privés dans l'admin tant qu'ils ne sont pas passés en <code>published</code>.</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="posts-grid">
      ${posts.map(articleCard).join('')}
    </div>
  </div>
</section>`;

const aboutContent = `
<section class="page-intro">
  <div class="container narrow prose">
    <p class="section-kicker">À propos</p>
    <h1>Une présence faceless, une identité éditoriale forte</h1>
    <p>Ce blog est né d'une conviction simple : on peut écrire avec profondeur sur la foi chrétienne, la consécration, la vie intérieure et les saisons de transformation, sans surexposer sa vie privée.</p>
    <p><strong>L'Offrande Vivante</strong> a été pensé comme un espace personnel, sobre, lumineux et cohérent. L'absence de visage y est compensée par un ton clair, une ligne éditoriale assumée et une vraie expérience de lecture.</p>
    <blockquote>
      <p>Que le Dieu de paix vous sanctifie lui-même tout entières — l'esprit, l'âme et le corps.</p>
      <cite>1 Thessaloniciens 5:23</cite>
    </blockquote>
    <h2>Ce que l'on y trouve</h2>
    <ul>
      <li>des textes sur la sanctification et la foi chrétienne</li>
      <li>des réflexions sur le discernement face au monde moderne</li>
      <li>des leçons de vie, d'attente, d'échecs et d'espérance</li>
      <li>une parole féminine, pudique et méditative</li>
    </ul>
    <h2>Pourquoi ce format</h2>
    <p>Le site a été conçu pour rester simple à administrer, mais suffisamment travaillé visuellement pour inspirer confiance. Il permet de publier de nouveaux articles depuis une interface d'administration avec prévisualisation, tout en gardant un style blanc premium et apaisé.</p>
  </div>
</section>`;

const contactContent = `
<section class="page-intro">
  <div class="container narrow">
    <p class="section-kicker">Contact</p>
    <h1>Envoyer un message</h1>
    <p>Ce formulaire utilise Netlify Forms. Les messages apparaîtront dans l'onglet <strong>Forms</strong> de Netlify après déploiement.</p>
  </div>
</section>
<section class="section">
  <div class="container narrow">
    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/merci/" class="stack-form card-form">
      <input type="hidden" name="form-name" value="contact" />
      <p class="hidden"><label>Ne pas remplir <input name="bot-field" /></label></p>
      <label>Nom
        <input type="text" name="name" required />
      </label>
      <label>Email
        <input type="email" name="email" required />
      </label>
      <label>Sujet
        <input type="text" name="subject" required />
      </label>
      <label>Message
        <textarea name="message" rows="6" required></textarea>
      </label>
      <button type="submit">Envoyer</button>
    </form>
  </div>
</section>`;

const thankYouContent = `
<section class="page-intro">
  <div class="container narrow prose center">
    <p class="section-kicker">Merci</p>
    <h1>Ton message a bien été envoyé</h1>
    <p>Le formulaire a été soumis. Sur Netlify, tu retrouveras les entrées dans l'espace Forms.</p>
    <p><a class="btn" href="/">Retour à l'accueil</a></p>
  </div>
</section>`;

fs.writeFileSync(path.join(distDir, 'index.html'), layout({ title: 'Accueil', current: 'home', content: homeContent }));
fs.mkdirSync(path.join(distDir, 'articles'), { recursive: true });
fs.writeFileSync(path.join(distDir, 'articles', 'index.html'), layout({ title: 'Articles', current: 'articles', content: articlesIndex }));
fs.mkdirSync(path.join(distDir, 'a-propos'), { recursive: true });
fs.writeFileSync(path.join(distDir, 'a-propos', 'index.html'), layout({ title: 'À propos', current: 'about', content: aboutContent }));
fs.mkdirSync(path.join(distDir, 'contact'), { recursive: true });
fs.writeFileSync(path.join(distDir, 'contact', 'index.html'), layout({ title: 'Contact', current: 'contact', content: contactContent }));
fs.mkdirSync(path.join(distDir, 'merci'), { recursive: true });
fs.writeFileSync(path.join(distDir, 'merci', 'index.html'), layout({ title: 'Merci', content: thankYouContent }));

for (const post of posts) {
  const html = `
  <section class="page-intro">
    <div class="container narrow">
      <p class="section-kicker">${escapeHtml(post.cat || 'Article')}</p>
      <h1>${escapeHtml(post.titre)}</h1>
      <p class="lead">${escapeHtml(post.soustitre || '')}</p>
      <p class="post-meta">${formatDate(post.date)} · ${escapeHtml(post.verset || '')} · ${post.readingTime} min</p>
    </div>
  </section>
  <section class="section">
    <div class="container narrow prose">
      ${post.body}
    </div>
  </section>
  <section class="section article-nav">
    <div class="container narrow">
      <a class="text-link" href="/articles/">← Retour aux articles</a>
    </div>
  </section>`;
  const postDir = path.join(distDir, 'articles', post.slug);
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(path.join(postDir, 'index.html'), layout({ title: post.titre, description: post.excerpt, current: 'articles', content: html }));
}

const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(srcDir, 'main.js'), 'utf8');
fs.writeFileSync(path.join(distDir, 'style.css'), css);
fs.writeFileSync(path.join(distDir, 'main.js'), js);

for (const file of fs.readdirSync(adminDir)) {
  fs.copyFileSync(path.join(adminDir, file), path.join(distDir, 'admin', file));
}

const manifest = allPosts.map(({ body, file, ...rest }) => rest);
fs.writeFileSync(path.join(distDir, 'posts.json'), JSON.stringify(manifest, null, 2));
